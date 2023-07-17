import { Dispatch, SetStateAction } from 'react';
import { useObjectIds } from '../../../hooks/object-ids.hook';
import { AttributeFilterProps, SingleFilterProps } from './AdvancedSearch';
import { SearchFilterInputItem } from './SearchFilterInputItem';

export const SearchFilterInput = ({
  attribute,
  advancedSearchProps,
  setAdvancedSearchProps,
}: {
  attribute: string;
  advancedSearchProps: AttributeFilterProps[];
  setAdvancedSearchProps: Dispatch<SetStateAction<AttributeFilterProps[]>>;
}) => {
  const { getObjectId } = useObjectIds<SingleFilterProps>();

  const filterProps = advancedSearchProps.filter(attrProps => attrProps.attribute === attribute)[0]
    .filterProps;

  const updateFilterProps = (index: number, action: string, property: string, value: string) => {
    let update: SingleFilterProps[];
    if (action === 'add') {
      update = filterProps.map((item: SingleFilterProps) => item);
      update.splice(index + 1, 0, {
        filterOperator: '',
        combinationOperator: '',
        values: [],
      });
    } else if (action === 'delete') {
      if (filterProps.length === 1) {
        return;
      }
      update = filterProps.slice();
      update.splice(index, 1);
    } else if (action === 'set') {
      update = filterProps.slice();
      switch (property) {
        case 'filterOperator':
          update[index].filterOperator = value;
          break;
        case 'combinationOperator':
          update[index].combinationOperator = value;
          break;
        case 'firstValue':
          update[index].values[0] = value;
          break;
        case 'secondValue':
          update[index].values[1] = value;
          break;
        default:
          return;
      }
    }
    const advancedSearchPropsUpdate: AttributeFilterProps[] = advancedSearchProps.map(entry =>
      entry.attribute === attribute ? { attribute: attribute, filterProps: update } : entry
    );
    setAdvancedSearchProps(advancedSearchPropsUpdate);

    return;
  };

  return (
    <div className='m-1 p-1 bg-gray-100'>
      {filterProps.map((props, index) => (
        <SearchFilterInputItem
          key={getObjectId(props)}
          index={index}
          attribute={attribute}
          advancedSearchProps={advancedSearchProps}
          updateFilterProps={updateFilterProps}
        ></SearchFilterInputItem>
      ))}
    </div>
  );
};
