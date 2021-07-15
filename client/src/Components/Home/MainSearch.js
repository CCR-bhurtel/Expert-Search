import React from 'react';
import logo from '../../img/ai.png';
import SearchBar from './SearchBar';

function MainSearch({ getExperts, setSearched }) {
  return (
    <div className="searchContainer">
      <div className="searchPageTitle">
        <h3 className="text">Find your expert witness</h3>
        <img src={logo} alt="logo" />
      </div>

      <div className="center">
        <SearchBar getExperts={getExperts} setSearched={setSearched} />
      </div>

      <a
        style={{ textDecoration: 'none' }}
        href="/getlisted"
        className="bottomText"
      >
        Get listed as an expert{' '}
      </a>
    </div>
  );
}

export default MainSearch;
