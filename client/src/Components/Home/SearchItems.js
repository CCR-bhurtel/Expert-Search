import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import Featured from './Featured';
import { showSignup } from '../../actions/authActions';
import verified from '../../img/verified.png';
import { v1 } from 'uuid';
import Pagination from './Pagination';
// import './home.css';

function SearchItems({
  incomingExperts,
  auth: { isAuthenticated },
  showSignup,
}) {
  const [loaded, setLoaded] = useState(false);
  const [featured, setFeatured] = useState({ ...incomingExperts[0] });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);
  let totalPage = Math.ceil(incomingExperts.length / perPage);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) setPage(1);
  }, [isAuthenticated]);
  const signup = () => {
    showSignup(true);
  };

  const element = document.querySelector('.pagination ul');

  let experts = incomingExperts.slice((page - 1) * perPage, page * perPage);
  // useEffect(() => {
  //   const pages = document.querySelectorAll('.page');
  //   pages.forEach((page) => {
  //     page.style.color = '';
  //     page.style.fontWeight = '';
  //   });
  //   let styledPage = document.querySelector(`.page.page-${page}`);
  //   if (styledPage) {
  //     styledPage.style.color = '#114be0';
  //     styledPage.style.fontWeight = '500';
  //   }
  // }, [page]);

  return (
    <div className="searchContainer__found">
      <p className="total">{incomingExperts.length} Results...</p>

      <div className="container__inner">
        <div className="experts">
          {experts.map((expert, index) => (
            <div
              key={v1()}
              onClick={() => setFeatured(expert)}
              className="expert"
            >
              <div className="title">
                <div className="name__title">
                  <p style={{ fontWeight: 500 }} className="name">
                    {expert.salutation} {expert.Fname}
                  </p>
                  <img src={verified} alt="" />
                </div>
                <div className="area">
                  {expert.area !== 'FAILED' ? expert.area : null}
                </div>
              </div>
              <div className="tags">{expert.specialInterests}</div>
            </div>
          ))}
          {incomingExperts.length > perPage && !isAuthenticated ? (
            <div onClick={signup} id="notAuthClick" className="notAuthClick">
              <p style={{ fontWeight: '500' }}>Register to see more experts</p>
            </div>
          ) : incomingExperts.length > perPage && loaded ? (
            <Pagination totalPage={totalPage} page={page} setPage={setPage} />
          ) : null}
        </div>

        <Featured
          signup={signup}
          isAuthenticated={isAuthenticated}
          featured={featured}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { showSignup })(SearchItems);
