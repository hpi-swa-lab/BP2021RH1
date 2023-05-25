// @types/extract-files is on v8, so this is the bare minimum we need to use it
declare module 'extract-files' {
  export function extractFiles(value: any): {
    files: Map<unknown, unknown>;
  };
}
