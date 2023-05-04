import { Checkbox, FormControlLabel } from '@mui/material';
import {
  Operation,
  groups as groupsMap,
  operations as operationsMap,
  sections as sectionNames,
} from 'bp-graphql';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import {
  useCreateParameterizedPermissionMutation,
  useDeleteParameterizedPermissionMutation,
  useGetParameterizedPermissionsQuery,
  useGetUsersPermissionsUserQuery,
} from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import {
  FlatParameterizedPermission,
  FlatUsersPermissionsUser,
} from '../../../../types/additionalFlatTypes';
import Loading from '../../../common/Loading';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';
import { FALLBACK_PATH } from '../../../routes';

type SectionStructure = {
  name: string;
  groups: GroupStructure[];
};

type GroupStructure = {
  name: string;
  operations: Operation[];
};

const generateOperationsStructure = () => {
  const sections: SectionStructure[] = sectionNames.map(name => ({
    name,
    groups: [],
  }));

  const groups: Record<string, GroupStructure> = Object.fromEntries(
    Object.entries(groupsMap).map(([name, group]) => [name, { name, operations: [] }])
  );
  for (const [name, group] of Object.entries(groupsMap)) {
    sections.find(section => section.name === group.section)?.groups.push(groups[name]);
  }
  for (const operation of Object.values(operationsMap)) {
    if ('group' in operation) {
      groups[operation.group].operations.push(operation);
    } else {
      const section = sections.find(section => section.name === operation.section);
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
  return sections;
};

const sections = generateOperationsStructure();

const PermissionsView = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useGetUsersPermissionsUserQuery({
    variables: {
      id: userId,
    },
  });
  const user: FlatUsersPermissionsUser | undefined =
    useSimplifiedQueryResponseData(userData)?.usersPermissionsUser;

  const {
    data: permissionsData,
    loading: permissionsLoading,
    error: permissionsError,
  } = useGetParameterizedPermissionsQuery({
    variables: {
      userId,
    },
  });
  const permissions: FlatParameterizedPermission[] | undefined =
    useSimplifiedQueryResponseData(permissionsData)?.parameterizedPermissions;

  const permissionLookup: Partial<Record<string, FlatParameterizedPermission>> | undefined =
    useMemo(
      () =>
        permissions
          ? Object.fromEntries(
              permissions.map(permission => [permission.operation_name ?? '', permission] as const)
            )
          : undefined,
      [permissions]
    );

  const [createPermission] = useCreateParameterizedPermissionMutation({
    refetchQueries: ['getParameterizedPermissions'],
  });
  const [deletePermission] = useDeleteParameterizedPermissionMutation({
    refetchQueries: ['getParameterizedPermissions'],
  });

  const loading = userLoading || permissionsLoading;
  const error = userError ?? permissionsError;

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (user && permissionLookup) {
    return (
      <div className='w-[800px] mx-auto mt-4'>
        <h1>{t('admin.permissions.title', { userName: user.username })}</h1>
        <div className=''>
          {sections.map(section => (
            <div key={section.name}>
              <h4>{t(`admin.permissions.section.${section.name}`)}</h4>
              {section.groups
                .map(group => [t(`admin.permissions.group.${group.name}`), group] as const)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([name, group]) => {
                  const hasOperations = group.operations.map(
                    operation => operation.document.name in permissionLookup
                  );
                  const hasAll = hasOperations.every(has => has);
                  const hasNone = hasOperations.every(has => !has);
                  const checked = hasAll ? true : hasNone ? false : undefined;
                  const indeterminate = checked === undefined;

                  const onClick = !hasNone
                    ? () => {
                        for (const operation of group.operations) {
                          const permission = permissionLookup[operation.document.name];
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
                              userId,
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
          ))}
        </div>
      </div>
    );
  } else {
    return <Redirect to={FALLBACK_PATH} />;
  }
};

export default PermissionsView;
