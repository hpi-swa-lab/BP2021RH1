import { NetworkStatus } from '@apollo/client';
import { ExpandMore, Search } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Operation, Parameter } from 'bp-graphql/build';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import {
  useAddPermissionMutation,
  useDeleteParameterizedPermissionMutation,
  useGetAllArchiveTagsQuery,
  useGetParameterizedPermissionsQuery,
  useGetUserQuery,
} from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { useCanUsePermissionsView } from '../../../../hooks/can-do-hooks';
import {
  FlatArchiveTag,
  FlatParameterizedPermission,
  FlatUsersPermissionsUser,
} from '../../../../types/additionalFlatTypes';
import { HelpTooltip } from '../../../common/HelpTooltip';
import Loading from '../../../common/Loading';
import ProtectedRoute from '../../../common/ProtectedRoute';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';
import { SaveStatus } from '../../../common/SaveStatus';
import { DialogPreset, useDialog } from '../../../provider/DialogProvider';
import { FALLBACK_PATH } from '../../../routes';
import { CenteredContainer } from '../CenteredContainer';
import { equalOrBothNullish, parseUserId } from './helper';
import { BooleanParameter } from './permissions/BooleanParamater';
import { Coverage, CoverageCheckbox } from './permissions/Coverage';
import { combineCoverages } from './permissions/combineCoverages';
import { GroupStructure, sections } from './permissions/operations';
import { ParametersWithoutArchive, PresetType, presets } from './permissions/presets';

export type Parameters = Pick<FlatParameterizedPermission, Parameter>;

const PermissionsView = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();

  const { parsedUserId, isPublic } = parseUserId(userId);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useGetUserQuery({
    variables: {
      id: parsedUserId ?? '',
    },
    skip: isPublic,
  });
  const user: FlatUsersPermissionsUser | undefined =
    useSimplifiedQueryResponseData(userData)?.usersPermissionsUser;

  const {
    data: permissionsData,
    loading: rawPermissionsLoading,
    error: permissionsError,
    refetch: refetchPermissions,
    networkStatus,
  } = useGetParameterizedPermissionsQuery({
    variables: {
      userId: parsedUserId,
    },
    notifyOnNetworkStatusChange: true,
  });
  const permissionsLoading = rawPermissionsLoading && networkStatus !== NetworkStatus.refetch;
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

  const [createPermission, { loading: createPermissionLoading }] = useAddPermissionMutation();
  const [deletePermission, { loading: deletePermissionLoading }] =
    useDeleteParameterizedPermissionMutation();

  const isWorking =
    createPermissionLoading || deletePermissionLoading || networkStatus === NetworkStatus.refetch;

  const loading = userLoading || permissionsLoading || archivesLoading;
  const error = userError ?? permissionsError ?? archivesError;

  const dialog = useDialog();

  const addPermission = useCallback(
    async (operation: Operation, { archive_tag, ...parameters }: Parameters) => {
      await createPermission({
        variables: {
          operation_name: operation.document.name,
          user_id: parsedUserId,
          archive_tag: archive_tag?.id,
          ...parameters,
        },
      });
    },
    [createPermission, parsedUserId]
  );

  const addPreset = useCallback(
    async (
      operations: { operation: Operation; parameters: ParametersWithoutArchive }[],
      archive: FlatArchiveTag | null
    ) => {
      await Promise.all(
        operations.map(async ({ operation, parameters }) => {
          await addPermission(operation, { archive_tag: archive ?? undefined, ...parameters });
        })
      );
      await refetchPermissions();
    },
    [addPermission, refetchPermissions]
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
        await Promise.all(
          operations.map(async operation => {
            const permission = findPermission(operation, archive);
            if (!permission) {
              return;
            }
            await deletePermission({
              variables: {
                id: permission.id,
              },
            });
          })
        );
      } else {
        await Promise.all(
          operations.map(async operation => {
            await addPermission(operation, { archive_tag: archive ?? undefined });
          })
        );
      }
      await refetchPermissions();
    },
    [dialog, t, findPermission, deletePermission, addPermission, refetchPermissions]
  );

  const [filter, setFilter] = useState('');

  const onFilterChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback(
    event => {
      setFilter(event.currentTarget.value);
    },
    []
  );

  const renderSections = useCallback(
    (type: PresetType, archive: FlatArchiveTag | null = null) => {
      const summary =
        type === 'system'
          ? t('admin.permissions.systemPermissions')
          : archive
          ? archive.name
          : t('admin.permissions.withoutArchive');
      const summaryTooltip =
        type === 'system'
          ? t('admin.permissions.systemPermissionsTooltip')
          : archive
          ? t('admin.permissions.archiveTooltip', { archiveName: archive.name })
          : t('admin.permissions.withoutArchiveTooltip');
      if (!summary.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
        return null;
      }

      const sectionsForType = type === 'system' ? sections.system : sections.perArchive;
      const sectionsWithCoverages = sectionsForType.map(section => ({
        ...section,
        groups: section.groups.map(group => ({
          ...group,
          coverage: groupCoverage(group, archive),
        })),
      }));
      const relevantPresets = presets
        .filter(preset => preset.type === type)
        .map(preset => ({
          ...preset,
          operations: sectionsWithCoverages.flatMap(section =>
            section.groups.flatMap(group => {
              const permission = preset.permissions.find(permission => {
                const name = typeof permission === 'string' ? permission : permission.name;
                return group.name === name;
              });
              if (!permission) {
                return [];
              }
              return group.operations.map(operation => ({
                operation,
                parameters: typeof permission === 'string' ? {} : permission.parameters,
              }));
            })
          ),
        }));
      const accordionStyle = {
        backgroundColor: '#e9e9e9',
      };
      return (
        <Accordion
          key={archive?.id ?? type}
          sx={accordionStyle}
          classes={{
            root: 'before:z-20', // ::before is the divider between Accordions
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            classes={{
              root: '!sticky top-0 z-10 ',
            }}
            sx={accordionStyle}
          >
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
                clickThrough
              />
            </Typography>
            <HelpTooltip title={summary} content={summaryTooltip} iconClassName='!ml-auto' />
          </AccordionSummary>
          <div className='m-4'>
            {relevantPresets.length > 0 && (
              <Stack direction='row' spacing={1}>
                {relevantPresets.map(preset => (
                  <Button
                    key={preset.name}
                    color='info'
                    variant='outlined'
                    onClick={() => addPreset(preset.operations, archive)}
                  >
                    {t(`admin.permissions.preset.${preset.name}`)}
                  </Button>
                ))}
              </Stack>
            )}
            <div className='mt-2'>
              {sectionsWithCoverages.map(section => {
                const label = t(`admin.permissions.section.${section.name}`, { context: type });
                return (
                  <Accordion key={section.name}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <CoverageCheckbox
                        coverage={combineCoverages(section.groups.map(group => group.coverage))}
                        operations={section.groups.flatMap(group => group.operations)}
                        archive={archive}
                        label={label}
                        prompt
                        toggleOperations={toggleOperations}
                        clickThrough
                      />
                      <HelpTooltip
                        title={label}
                        content={t(`admin.permissions.section-tooltip.${section.name}`, {
                          context: type,
                          archiveName: archive?.name,
                        })}
                        iconClassName='!ml-auto'
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
                            <ParameterInputs
                              group={group}
                              findPermission={findPermission}
                              archive={archive}
                              deletePermission={deletePermission}
                              addPermission={addPermission}
                              refetchPermissions={refetchPermissions}
                            />
                            <HelpTooltip
                              title={name}
                              content={t(`admin.permissions.group-tooltip.${group.name}`)}
                              iconClassName='float-right'
                            />
                          </div>
                        ))}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </Accordion>
      );
    },
    [
      filter,
      toggleOperations,
      groupCoverage,
      t,
      addPreset,
      findPermission,
      addPermission,
      deletePermission,
      refetchPermissions,
    ]
  );

  const { canUsePermissionsView, loading: canUsePermissionsViewLoading } =
    useCanUsePermissionsView(userId);

  return (
    <ProtectedRoute canUse={canUsePermissionsView} canUseLoading={canUsePermissionsViewLoading}>
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else if (permissionLookup && archives) {
          return (
            <>
              <CenteredContainer
                title={
                  isPublic
                    ? t('admin.permissions.publicTitle')
                    : t('admin.permissions.title', { userName: user?.username })
                }
                titleOnLeftSideOfScreenAfterScroll
              >
                <div className='mb-2'>
                  <TextField
                    fullWidth
                    value={filter}
                    onChange={onFilterChange}
                    placeholder={t('admin.permissions.filterPlaceholder')}
                    variant='outlined'
                    InputProps={{
                      endAdornment: <Search />,
                    }}
                  />
                </div>
                {renderSections('system')}
                {renderSections('archive', null)}
                {archives.map(archive => renderSections('archive', archive))}
              </CenteredContainer>
              <div className='absolute right-5 top-[6.75rem]'>
                <SaveStatus
                  label={t(isWorking ? 'curator.saveStatus.saving' : 'curator.saveStatus.saved')}
                />
              </div>
            </>
          );
        } else {
          return <Redirect to={FALLBACK_PATH} />;
        }
      }}
    </ProtectedRoute>
  );
};

export default PermissionsView;

const ParameterInputs = ({
  group,
  findPermission,
  archive,
  deletePermission,
  addPermission,
  refetchPermissions,
}: {
  group: GroupStructure;
  findPermission: (
    operation: Operation,
    archive: FlatArchiveTag | null
  ) => FlatParameterizedPermission | null;
  archive: FlatArchiveTag | null;
  deletePermission: (parameters: { variables: { id: string } }) => Promise<unknown>;
  addPermission: (operation: Operation, parameters: Parameters) => Promise<unknown>;
  refetchPermissions: () => Promise<unknown>;
}) => {
  const { t } = useTranslation();

  const sharedProps = {
    operations: group.operations,
    findPermission,
    addPermission,
    deletePermission,
    refetchPermissions,
    archive,
  };

  return (
    <>
      {group.needsParameters.map(parameter => {
        switch (parameter) {
          case 'on_other_users':
            return (
              <BooleanParameter
                key={parameter}
                parameter={'on_other_users'}
                falseTitle={t(`admin.permissions.parameter.on_other_users.${group.name}.onlyOwn`)}
                trueTitle={t(
                  `admin.permissions.parameter.on_other_users.${group.name}.onOtherUsers`
                )}
                {...sharedProps}
              />
            );
          case 'archive_tag':
            return null;
        }
      })}
    </>
  );
};
