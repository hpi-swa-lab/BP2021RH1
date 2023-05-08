import { Checkbox, FormControlLabel } from '@mui/material';
import {
  GroupSettings,
  Operation,
  groups as groupsMap,
  operations as operationsMap,
  sections as sectionNames,
} from 'bp-graphql';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import {
  useCreateParameterizedPermissionMutation,
  useDeleteParameterizedPermissionMutation,
  useGetAllArchiveTagsQuery,
  useGetParameterizedPermissionsQuery,
  useGetUsersPermissionsUserQuery,
} from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import {
  FlatArchiveTag,
  FlatParameterizedPermission,
  FlatUsersPermissionsUser,
} from '../../../../types/additionalFlatTypes';
import Loading from '../../../common/Loading';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';
import { FALLBACK_PATH } from '../../../routes';
import { equalOrBothNullish } from './helper';

type OperationsStructure = {
  global: SectionStructure[];
  perArchive: SectionStructure[];
};

type SectionStructure = {
  name: string;
  groups: GroupStructure[];
};

type GroupStructure = {
  name: string;
  operations: Operation[];
};

const generateOperationsStructure = (): OperationsStructure => {
  const globalSections: SectionStructure[] = sectionNames.map(name => ({
    name,
    groups: [],
  }));
  const perArchiveSections: SectionStructure[] = sectionNames.map(name => ({
    name,
    groups: [],
  }));

  const groups: Record<string, GroupStructure> = Object.fromEntries(
    Object.entries(groupsMap).map(([name, group]) => [name, { name, operations: [] }])
  );

  const isArchiveSpecificGroup = (settings: GroupSettings) =>
    settings.needsParameters.includes('archive_tag');
  const getSections = (settings: GroupSettings) =>
    isArchiveSpecificGroup(settings) ? perArchiveSections : globalSections;

  for (const [name, group] of Object.entries(groupsMap)) {
    getSections(group)
      .find(section => section.name === group.section)
      ?.groups.push(groups[name]);
  }
  for (const operation of Object.values(operationsMap)) {
    if ('group' in operation) {
      groups[operation.group].operations.push(operation);
    } else {
      const section = getSections(operation).find(section => section.name === operation.section);
      if (!section) {
        console.warn(
          `operation ${operation.document.name} has an invalid section ${operation.section}`
        );
        continue;
      }
      section.groups.push({
        name: operation.document.name,
        operations: [operation],
      });
    }
  }
  const filterOutEmptySections = (sections: SectionStructure[]) =>
    sections.filter(section => section.groups.length > 0);

  return {
    global: filterOutEmptySections(globalSections),
    perArchive: filterOutEmptySections(perArchiveSections),
  };
};

const sections = generateOperationsStructure();

const PermissionsView = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();

  const isPublic = userId === 'public';
  const parsedUserId = isPublic ? null : userId;

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useGetUsersPermissionsUserQuery({
    variables: {
      id: parsedUserId ?? '',
    },
    skip: isPublic,
  });
  const user: FlatUsersPermissionsUser | undefined =
    useSimplifiedQueryResponseData(userData)?.usersPermissionsUser;

  const {
    data: permissionsData,
    loading: permissionsLoading,
    error: permissionsError,
  } = useGetParameterizedPermissionsQuery({
    variables: {
      userId: parsedUserId,
    },
  });
  const permissions: FlatParameterizedPermission[] | undefined =
    useSimplifiedQueryResponseData(permissionsData)?.parameterizedPermissions;

  const permissionLookup = useMemo(() => {
    if (!permissions) {
      return undefined;
    }
    const lookup: Partial<Record<string, Map<string | null, FlatParameterizedPermission>>> = {};
    for (const permission of permissions) {
      const operationName = permission.operation_name ?? '';
      const map = (lookup[operationName] ??= new Map());
      map.set(permission.archive_tag?.id ?? null, permission);
    }
    return lookup;
  }, [permissions]);

  const findPermission = useCallback(
    (operation: Operation, archive: FlatArchiveTag | null) =>
      permissionLookup?.[operation.document.name]?.get(archive?.id ?? null) ?? null,
    [permissionLookup]
  );

  const {
    data: archivesData,
    loading: archivesLoading,
    error: archivesError,
  } = useGetAllArchiveTagsQuery();
  const archives: FlatArchiveTag[] | undefined =
    useSimplifiedQueryResponseData(archivesData)?.archiveTags;

  const [createPermission] = useCreateParameterizedPermissionMutation({
    refetchQueries: ['getParameterizedPermissions'],
  });
  const [deletePermission] = useDeleteParameterizedPermissionMutation({
    refetchQueries: ['getParameterizedPermissions'],
  });

  const loading = userLoading || permissionsLoading || archivesLoading;
  const error = userError ?? permissionsError ?? archivesError;

  const renderSections = useCallback(
    (sections: SectionStructure[], archive: FlatArchiveTag | null) => {
      return sections.map(section => (
        <div key={section.name}>
          <h4>{t(`admin.permissions.section.${section.name}`)}</h4>
          {section.groups
            .map(group => [t(`admin.permissions.group.${group.name}`), group] as const)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, group]) => {
              const hasOperations = group.operations.map(operation => {
                const permission = findPermission(operation, archive);
                return !!permission && equalOrBothNullish(archive?.id, permission.archive_tag?.id);
              });
              const hasAll = hasOperations.every(has => has);
              const hasNone = hasOperations.every(has => !has);
              const checked = hasAll ? true : hasNone ? false : undefined;
              const indeterminate = checked === undefined;

              const onClick = !hasNone
                ? () => {
                    for (const operation of group.operations) {
                      const permission = findPermission(operation, archive);
                      if (!permission) {
                        continue;
                      }
                      deletePermission({
                        variables: {
                          id: permission.id,
                        },
                      });
                    }
                  }
                : () => {
                    for (const operation of group.operations) {
                      createPermission({
                        variables: {
                          operationName: operation.document.name,
                          userId: parsedUserId,
                          archiveId: archive?.id,
                        },
                      });
                    }
                  };

              return (
                <div key={group.name}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        indeterminate={indeterminate}
                        checked={checked}
                        onChange={onClick}
                      />
                    }
                    label={name}
                  />
                </div>
              );
            })}
        </div>
      ));
    },
    [createPermission, deletePermission, parsedUserId, findPermission, t]
  );

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (permissionLookup && archives) {
    return (
      <div className='w-[800px] mx-auto mt-4'>
        <h1>
          {isPublic
            ? t('admin.permissions.publicTitle')
            : t('admin.permissions.title', { userName: user?.username })}
        </h1>
        <div className=''>
          {renderSections(sections.global, null)}
          {archives.map(archive => (
            <>
              <h2>{archive.name}</h2>
              {renderSections(sections.perArchive, archive)}
            </>
          ))}
        </div>
      </div>
    );
  } else {
    return <Redirect to={FALLBACK_PATH} />;
  }
};

export const Sections = ({ sections }: { sections: SectionStructure[] }) => {};

export default PermissionsView;
