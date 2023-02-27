import Checkbox from './Checkbox';
import './LocationEntry.scss';

const LocationPanelHeader = () => {
  return (
    <>
      <div className='location-header-container'>
        <div className='location-header-name location-column-250'>Name</div>
        <div className='location-header-synonyms location-column-750'>Synonyme</div>
        <div className='location-header-edit location-column-110'>Bearbeiten</div>
        <div className='location-header-detach location-column-110'>Loslösen</div>
        <div className='location-header-relocate location-column-110'>Unterordnen</div>
        <div className='location-header-is-visible location-column-110'>Sichtbarkeit</div>
        <div className='location-header-delete location-column-110'>Löschen</div>
      </div>
      <hr />
    </>
  );
};

export default LocationPanelHeader;
