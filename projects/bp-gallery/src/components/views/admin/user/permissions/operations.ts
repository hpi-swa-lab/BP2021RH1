import {
  GroupName,
  GroupSettings,
  OperationWithoutGroupName,
  PermissionName,
  groups as groupsMap,
  operations as operationsMap,
  sections as sectionNames,
} from 'bp-graphql';
import { Operation } from 'bp-graphql/build';

export type OperationsStructure = {
  system: SectionStructure[];
  perArchive: SectionStructure[];
};

export type SectionStructure = {
  name: string;
  groups: GroupStructure[];
};

export type GroupStructure = {
  name: PermissionName;
  operations: Operation[];
};

export const generateOperationsStructure = (): OperationsStructure => {
  const systemSections: SectionStructure[] = sectionNames.map(name => ({
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
    isArchiveSpecificGroup(settings) ? perArchiveSections : systemSections;

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
    system: filterOutEmptySections(systemSections),
    perArchive: filterOutEmptySections(perArchiveSections),
  };
};

export const sections = generateOperationsStructure();