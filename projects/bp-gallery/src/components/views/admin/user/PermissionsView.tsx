import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import {
  GroupName,
  GroupSettings,
  Operation,
  OperationWithoutGroupName,
  PermissionName,
  groups as groupsMap,
  operations as operationsMap,
  sections as sectionNames,
} from 'bp-graphql';
import { ChangeEvent, useCallback, useMemo } from 'react';
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
import { DialogPreset, useDialog } from '../../../provider/DialogProvider';
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
  name: PermissionName;
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
    Object.keys(groupsMap).map(name => [name, { name: name as GroupName, operations: [] }])
  );

  const isArchiveSpecificGroup = (settings: GroupSettings) =>
    settings.needsParameters.includes('archive_tag');
  const getSections = (settings: GroupSettings) =>
    isArchiveSpecificGroup(settings) ? perArchiveSections : globalSections;

  for (const [name, group] of Object.entries(groupsMap)) {
    getSections(group)
      .find(section => section.name === group.section)
      ?.groups.push(groups[name as GroupName]);
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
        name: operation.document.name as OperationWithoutGroupName,
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

enum HasGroup {
  NONE,
  SOME,
  ALL,
}

const combineHasGroups = (hasGroups: HasGroup[]) => {
  if (hasGroups.every(has => has === HasGroup.ALL)) {
    return HasGroup.ALL;
  }
  if (hasGroups.every(has => has === HasGroup.NONE)) {
    return HasGroup.NONE;
  }
  return HasGroup.SOME;
};

const HasGroupCheckbox = ({
  hasGroup,
  operations,
  archive,
  label,
  prompt,
  toggleOperations,
}: {
  hasGroup: HasGroup;
  operations: Operation[];
  archive: FlatArchiveTag | null;
  label: string;
  prompt?: boolean;
  toggleOperations: (
    operations: Operation[],
    archive: FlatArchiveTag | null,
    hasGroup: HasGroup,
    header: string,
    prompt?: boolean
  ) => void;
}) => {
  const checked = hasGroup === HasGroup.ALL;
  const indeterminate = hasGroup === HasGroup.SOME;

  const onClick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      toggleOperations(operations, archive, hasGroup, label, prompt);
      // prevent Accordion from toggling
      event.stopPropagation();
    },
    [toggleOperations, operations, archive, hasGroup, label, prompt]
  );

  return (
    <FormControlLabel
      control={<Checkbox indeterminate={indeterminate} checked={checked} onChange={onClick} />}
      label={label}
    />
  );
};

type PresetType = 'global' | 'archive';

type Preset = {
  type: PresetType;
  name: string;
  permissions: readonly PermissionName[];
};

const presets: Preset[] = [
  {
    type: 'global',
    name: 'public',
    permissions: [
      'getPictures',
      'getAllPicturesByArchive',
      'viewCollection',
      'getTagThumbnails',
      'getAllArchiveTags',
      'geo',
      'login',
    ],
  },
  {
    type: 'archive',
    name: 'public',
    permissions: ['viewPicture', 'getDailyPictureInfo', 'like', 'postComment', 'getArchive'],
  },
];

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

  const hasGroup = useCallback(
    (group: GroupStructure, archive: FlatArchiveTag | null) => {
      const hasOperations = group.operations.map(operation => {
        const permission = findPermission(operation, archive);
        return !!permission && equalOrBothNullish(archive?.id, permission.archive_tag?.id);
      });
      return combineHasGroups(hasOperations.map(has => (has ? HasGroup.ALL : HasGroup.NONE)));
    },
    [findPermission]
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

  const dialog = useDialog();

  const addPermission = useCallback(
    (operation: Operation, archive: FlatArchiveTag | null) => {
      createPermission({
        variables: {
          operationName: operation.document.name,
          userId: parsedUserId,
          archiveId: archive?.id,
        },
      });
    },
    [createPermission, parsedUserId]
  );

  const addPermissionIfMissing = useCallback(
    (operation: Operation, archive: FlatArchiveTag | null) => {
      if (findPermission(operation, archive)) {
        return;
      }
      addPermission(operation, archive);
    },
    [findPermission, addPermission]
  );

  const addPermissionsIfMissing = useCallback(
    (operations: Operation[], archive: FlatArchiveTag | null) => {
      for (const operation of operations) {
        addPermissionIfMissing(operation, archive);
      }
    },
    [addPermissionIfMissing]
  );

  const toggleOperations = useCallback(
    async (
      operations: Operation[],
      archive: FlatArchiveTag | null,
      hasGroup: HasGroup,
      header: string,
      prompt = false
    ) => {
      const removeAll = hasGroup !== HasGroup.NONE;
      if (prompt) {
        const really = await dialog({
          preset: DialogPreset.CONFIRM,
          title: removeAll
            ? t('admin.permissions.reallyRemoveAllPermissions', { header })
            : t('admin.permissions.reallyGrantAllPermissions', { header }),
          content: t('admin.permissions.reallyEditAllPermissionsContent'),
        });
        if (!really) {
          return;
        }
      }
      if (removeAll) {
        for (const operation of operations) {
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
      } else {
        for (const operation of operations) {
          addPermission(operation, archive);
        }
      }
    },
    [dialog, t, findPermission, deletePermission, addPermission]
  );

  const renderSections = useCallback(
    (summary: string, sections: SectionStructure[], archive: FlatArchiveTag | null) => {
      const sectionsWithHasGroups = sections.map(section => ({
        ...section,
        groups: section.groups.map(group => ({
          ...group,
          hasGroup: hasGroup(group, archive),
        })),
      }));
      const relevantPresets = presets
        .filter(preset => preset.type === (archive === null ? 'global' : 'archive'))
        .map(preset => ({
          ...preset,
          operations: sectionsWithHasGroups.flatMap(section =>
            section.groups
              .filter(group => preset.permissions.includes(group.name))
              .flatMap(group => group.operations)
          ),
        }));
      return (
        <Accordion key={archive?.id ?? 'global'} sx={{ backgroundColor: '#e9e9e9' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight='bold'>
              <HasGroupCheckbox
                hasGroup={combineHasGroups(
                  sectionsWithHasGroups.flatMap(section =>
                    section.groups.map(group => group.hasGroup)
                  )
                )}
                operations={sectionsWithHasGroups.flatMap(section =>
                  section.groups.flatMap(group => group.operations)
                )}
                archive={archive}
                label={summary}
                prompt
                toggleOperations={toggleOperations}
              />
            </Typography>
          </AccordionSummary>
          <div className='m-4'>
            <Stack direction='row' spacing={1}>
              {relevantPresets.map(preset => (
                <Button
                  key={preset.name}
                  color='info'
                  variant='outlined'
                  onClick={() => addPermissionsIfMissing(preset.operations, archive)}
                >
                  {t(`admin.permissions.preset.${preset.name}`)}
                </Button>
              ))}
            </Stack>
            <div className='mt-2'>
              {sectionsWithHasGroups.map(section => (
                <Accordion key={section.name}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <HasGroupCheckbox
                      hasGroup={combineHasGroups(section.groups.map(group => group.hasGroup))}
                      operations={section.groups.flatMap(group => group.operations)}
                      archive={archive}
                      label={t(`admin.permissions.section.${section.name}`)}
                      prompt
                      toggleOperations={toggleOperations}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    {section.groups
                      .map(group => [t(`admin.permissions.group.${group.name}`), group] as const)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([name, group]) => (
                        // div forces every checkbox on a separate line
                        <div key={group.name}>
                          <HasGroupCheckbox
                            hasGroup={group.hasGroup}
                            operations={group.operations}
                            archive={archive}
                            label={name}
                            toggleOperations={toggleOperations}
                          />
                        </div>
                      ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </Accordion>
      );
    },
    [hasGroup, addPermissionsIfMissing, toggleOperations, t]
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
        {renderSections(t('admin.permissions.globalPermissions'), sections.global, null)}
        {archives.map(archive => renderSections(archive.name, sections.perArchive, archive))}
      </div>
    );
  } else {
    return <Redirect to={FALLBACK_PATH} />;
  }
};

export const Sections = ({ sections }: { sections: SectionStructure[] }) => {};

export default PermissionsView;
