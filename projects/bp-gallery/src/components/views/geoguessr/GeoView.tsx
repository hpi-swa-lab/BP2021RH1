import GeoMap from './GeoMap';
import './GeoView.scss';

const GeoView = () => {
  return (
    <div className='map-container'>
      <img src='/bad-harzburg-stiftung-logo.png' />
      <GeoMap />
    </div>
  );
};

export default GeoView;
