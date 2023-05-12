import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Input,
  Stack,
  Typography,
} from '@mui/material';
import { Operation } from 'bp-graphql/build';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
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
import { Coverage, CoverageCheckbox, combineCoverages } from './permissions/Coverage';
import { GroupStructure, SectionStructure, sections } from './permissions/operations';
import { presets } from './permissions/presets';

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

  const groupCoverage = useCallback(
    (group: GroupStructure, archive: FlatArchiveTag | null) => {
      const hasOperations = group.operations.map(operation => {
        const permission = findPermission(operation, archive);
        return !!permission && equalOrBothNullish(archive?.id, permission.archive_tag?.id);
      });
      return combineCoverages(hasOperations.map(has => (has ? Coverage.ALL : Coverage.NONE)));
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
      coverage: Coverage,
      header: string,
      prompt = false
    ) => {
      const removeAll = coverage !== Coverage.NONE;
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

  const [filter, setFilter] = useState('');

  const onFilterChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback(
    event => {
      setFilter(event.currentTarget.value);
    },
    []
  );

  const renderSections = useCallback(
    (summary: string, sections: SectionStructure[], archive: FlatArchiveTag | null) => {
      if (!summary.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
        return null;
      }
      const sectionsWithCoverages = sections.map(section => ({
        ...section,
        groups: section.groups.map(group => ({
          ...group,
          coverage: groupCoverage(group, archive),
        })),
      }));
      const relevantPresets = presets
        .filter(preset => preset.type === (archive === null ? 'system' : 'archive'))
        .map(preset => ({
          ...preset,
          operations: sectionsWithCoverages.flatMap(section =>
            section.groups
              .filter(group => preset.permissions.includes(group.name))
              .flatMap(group => group.operations)
          ),
        }));
      return (
        <Accordion key={archive?.id ?? 'system'} sx={{ backgroundColor: '#e9e9e9' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight='bold'>
              <CoverageCheckbox
                coverage={combineCoverages(
                  sectionsWithCoverages.flatMap(section =>
                    section.groups.map(group => group.coverage)
                  )
                )}
                operations={sectionsWithCoverages.flatMap(section =>
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
              {sectionsWithCoverages.map(section => (
                <Accordion key={section.name}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <CoverageCheckbox
                      coverage={combineCoverages(section.groups.map(group => group.coverage))}
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
                          <CoverageCheckbox
                            coverage={group.coverage}
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
    [filter, groupCoverage, addPermissionsIfMissing, toggleOperations, t]
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
        <div className='mb-2'>
          <Input
            fullWidth
            value={filter}
            onChange={onFilterChange}
            placeholder={t('admin.permissions.filterPlaceholder')}
          />
        </div>
        {renderSections(t('admin.permissions.systemPermissions'), sections.system, null)}
        {archives.map(archive => renderSections(archive.name, sections.perArchive, archive))}
      </div>
    );
  } else {
    return <Redirect to={FALLBACK_PATH} />;
  }
};

export default PermissionsView;
