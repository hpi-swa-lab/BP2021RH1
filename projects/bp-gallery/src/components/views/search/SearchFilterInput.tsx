import { AttributeFilterProps, SingleFilterProps } from './AdvancedSearch';
import { SearchFilterInputItem } from './SearchFilterInputItem';

export const SearchFilterInput = ({
  key,
  attribute,
  advancedSearchProps,
}: {
  key: string;
  attribute: string;
  advancedSearchProps: AttributeFilterProps[];
}) => {
  let filterProps = advancedSearchProps.filter(attrProps => attrProps.attribute === attribute)[0]
    .filterProps;

  const updateFilterProps = (index: number, action: string, property: string, value: string) => {
    let update;
    if (action === 'add') {
      update = filterProps.map((item: SingleFilterProps) => item);
      console.log('update pre splice', update);
      update.splice(index + 1, 0, {
        filterOperator: '',
        combinationOperator: '',
        values: [],
      });
      console.log('filterProps', filterProps);
      console.log('update post splice', update);
      filterProps = update;
      console.log('filterProps', filterProps);
    } else if (action === 'delete') {
      update = filterProps.map((item: SingleFilterProps) => item).splice(index, 1);
      filterProps = update;
    } else if (action === 'set') {
      switch (property) {
        case 'filterOperator':
          update = filterProps.map((item: SingleFilterProps) => item);
          update[index].filterOperator = value;
          filterProps = update;
          break;
        case 'combinationOperator':
          update = filterProps.map((item: SingleFilterProps) => item);
          update[index].combinationOperator = value;
          filterProps = update;
          break;
        case 'firstValue':
          update = filterProps.map((item: SingleFilterProps) => item);
          update[index].values[0] = value;
          filterProps = update;
          break;
        case 'secondValue':
          update = filterProps.map((item: SingleFilterProps) => item);
          update[index].values[1] = value;
          filterProps = update;
          break;
        default:
          return;
      }
    }

    return;
  };

  return (
    <>
      {filterProps.map((props, index) => (
        <SearchFilterInputItem
          key={index.toString()}
          index={index}
          attribute={attribute}
          updateFilterProps={updateFilterProps}
        ></SearchFilterInputItem>
      ))}
    </>
  );
};
