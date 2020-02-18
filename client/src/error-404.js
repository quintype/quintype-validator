import React from 'react';
import { Link } from 'react-router-dom';

function Error404(){
  return (
    <div className="error-page">
      <h1>Not Found</h1>
      <h3>Would you like to return <Link to="/website">home</Link> instead?</h3>
    </div>
  );
}

export default Error404;