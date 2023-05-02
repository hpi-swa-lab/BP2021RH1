import { Checkbox, FormControlLabel } from '@mui/material';
import {
  Operation,
  groups as groupsMap,
  operations as operationsMap,
  sections as sectionNames,
} from 'bp-graphql';
import { useTranslation } from 'react-i18next';
import { useGetUsersPermissionsUserQuery } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatUsersPermissionsUser } from '../../../../types/additionalFlatTypes';
import Loading from '../../../common/Loading';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';

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
  const { data, loading, error } = useGetUsersPermissionsUserQuery({
    variables: {
      id: userId,
    },
  });
  const user: FlatUsersPermissionsUser | undefined =
    useSimplifiedQueryResponseData(data)?.usersPermissionsUser;
  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else {
    return (
      <div className='w-[800px] mx-auto mt-4'>
        <h1>{t('admin.permissions.title', { userName: user?.username })}</h1>
        <div className=''>
          {sections.map(section => (
            <div key={section.name}>
              <h4>{t(`admin.permissions.section.${section.name}`)}</h4>
              {section.groups
                .map(group => [t(`admin.permissions.group.${group.name}`), group] as const)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([name, group]) => (
                  <div key={group.name}>
                    <FormControlLabel control={<Checkbox />} label={name} />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default PermissionsView;
