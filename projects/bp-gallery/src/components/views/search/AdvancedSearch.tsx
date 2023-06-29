import { Button } from '@mui/material';
import { SearchFilterInput } from './SearchFilterInput';

export type SingleFilterProps = {
  filterOperator: string;
  combinationOperator: string;
  values: string[];
};

export type AttributeFilterProps = { attribute: string; filterProps: SingleFilterProps[] };

export const AdvancedSearch = ({
  advancedSearchProps,
}: {
  advancedSearchProps: AttributeFilterProps[];
}) => {
  return (
    <div className='advanced-search'>
      <div className='advanced-search-content'>
        {advancedSearchProps.map(props => (
          <SearchFilterInput
            key={props.attribute}
            attribute={props.attribute}
            advancedSearchProps={advancedSearchProps}
          ></SearchFilterInput>
        ))}
      </div>
      <Button onClick={() => console.log(advancedSearchProps)}>press me</Button>
    </div>
  );
};

export default AdvancedSearch;
