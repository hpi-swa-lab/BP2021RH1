/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const HomePage = () => {
  const fileInputRef = React.createRef();

  const importFromFile = () => {
    fileInputRef.current.click();
  };

  const processFile = (evt) => {
    console.log(evt);
    const data = JSON.parse(`
        {     "title": "new picture",     "date": "2021-10-01",     "description": "test upload post request",     "comments": [],     "media": {         "id": 5     } }
    `);
    console.log(strapi);
  }

  return (
    <div>
      <h1>Wordpress Bulk Imports</h1>
      <input ref={fileInputRef} type="file" style={{visibility: 'hidden'}} accept='json' onChange={(evt) => processFile(evt)}/>
      <button onClick={importFromFile}>Import from File</button>
    </div>
  );
};

export default memo(HomePage);
