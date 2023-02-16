import { useTranslation } from 'react-i18next';
import TagList from './TagList';
import { TagType } from '../../../types/additionalFlatTypes';
import DecadesList from './DecadesList';

const SearchHub = () => {
  const { t } = useTranslation();

  return (
    <div className='search-hub'>
      <div className='search-section'>
        <h3>{t('common.keywords').toUpperCase()}</h3>
        <TagList type={TagType.KEYWORD} />
      </div>
      <div className='search-section'>
        <h3>{t('common.locations').toUpperCase()}</h3>
        <TagList type={TagType.LOCATION} />
      </div>
      <div className='search-section'>
        <h3>{t('common.persons').toUpperCase()}</h3>
        <TagList type={TagType.PERSON} />
      </div>
      <div className='search-section'>
        <h3>{t('common.decades').toUpperCase()}</h3>
        <DecadesList />
      </div>
    </div>
  );
};

export default SearchHub;
