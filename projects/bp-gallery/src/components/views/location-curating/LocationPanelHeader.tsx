import './LocationEntry.scss';

const LocationPanelHeader = () => {
  return (
    <>
      <div className='location-header-container'>
        <div className='location-header-name'>Name</div>
        <div className='location-header-synonyms'>Synonyme</div>
      </div>
      <hr />
    </>
  );
};

export default LocationPanelHeader;
