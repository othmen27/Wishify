import React, { useState } from 'react';

const PostWish = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit wish to backend
    alert(`Wish posted! Title: ${title}, Description: ${description}`);
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <h1>Post a Wish</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <button type="submit">Submit Wish</button>
      </form>
    </div>
  );
};

export default PostWish;
