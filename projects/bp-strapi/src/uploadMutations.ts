import { createWriteStream } from 'fs';
import { mkdtemp, rm, stat } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import type { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import type { GqlExtension } from './types';

// graphql-upload has no type declarations
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');

type FileUpload = { filename: string; mimetype: string; createReadStream: () => Readable };

/**
 * Strapi 5's GraphQL plugin has no upload mutations. The gallery uploads through GraphQL so that
 * the parameterized permissions check uploads like every other operation, so these add
 * multipleUpload and removeFile back. src/middlewares/graphqlUpload.ts parses the requests.
 */
export const uploadMutations = ({ strapi, nexus }: GqlExtension) => {
  const uploadService = () => strapi.plugin('upload').service('upload');
  return {
    types: [
      GraphQLUpload,
      nexus.mutationField('multipleUpload', {
        type: nexus.nonNull(nexus.list('UploadFile')),
        args: { files: nexus.nonNull(nexus.list('Upload')) },
        async resolve(_, { files: uploads }: { files: Promise<FileUpload>[] }) {
          const directory = await mkdtemp(path.join(tmpdir(), 'bp-upload-'));
          try {
            const files = await Promise.all(
              uploads.map(async (pendingUpload, index) => {
                const upload = await pendingUpload;
                const filepath = path.join(directory, String(index));
                await pipeline(upload.createReadStream(), createWriteStream(filepath));
                return {
                  filepath,
                  originalFilename: upload.filename,
                  mimetype: upload.mimetype,
                  size: (await stat(filepath)).size,
                };
              })
            );
            const folder = (
              await strapi.plugin('upload').service('api-upload-folder').getAPIUploadFolder()
            ).id;
            return await uploadService().upload({
              data: { fileInfo: files.map(() => ({ folder })) },
              files,
            });
          } finally {
            await rm(directory, { recursive: true, force: true });
          }
        },
      }),
      nexus.mutationField('removeFile', {
        type: 'UploadFile',
        args: { id: nexus.nonNull('ID') },
        async resolve(_, { id }: { id: string }) {
          const file = await uploadService().findOne(id);
          return file ? uploadService().remove(file) : null;
        },
      }),
    ],
    resolversConfig: {
      'Mutation.multipleUpload': { auth: { scope: ['plugin::upload.content-api.upload'] } },
      'Mutation.removeFile': { auth: { scope: ['plugin::upload.content-api.destroy'] } },
    },
  };
};
