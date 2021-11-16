import React from 'react';

const NewCommentForm = () => {
  return (
    <form>
      <label>
        Name:
        <input type='text' name='name' />
      </label>
      <br />
      <label>
        Text:
        <input type='text' name='text' />
      </label>
      <br />
      <input type='submit' value='Submit' />
    </form>
  );
};

export default NewCommentForm;
