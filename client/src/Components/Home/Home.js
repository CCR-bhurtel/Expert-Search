import React, { useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch';
import Spinner from '../Layouts/Spinner';

import './home.css';
import MainSearch from './MainSearch';
import SearchBar from './SearchBar';
import SearchItems from './SearchItems';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alertAction';

function Home(props) {
  const [data, setData] = useState({ job: '', area: '' });
  const client = algoliasearch(
    process.env.REACT_APP_APPID,
    process.env.REACT_APP_APIID
  );

  const index = client.initIndex('experts');
  const [experts, setExperts] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  index.setSettings({
    searchableAttributes: ['jobTitle', 'specialInterest', 'qualification'],
    paginationLimitedTo: 5000,
  });

  const onSubmitSearch = ({ newJob, newArea }) => {
    (async () => {
      let iterations = 5;
      let finalResults = [];
      let objectIds = [];
      let first = true;

      const loadExperts = () => {
        return new Promise(async (resolve, reject) => {
          if (!newJob && !newArea) {
            setLoading(false);
            props.setAlert('Please include Job Title and Area', 'danger');
            return;
          }
          setLoading(true);
          document.getElementById('simplenav').style.display = 'block';

          let test_results = await index.search(data.job, {
            hitsPerPage: 1000,
          });

          console.log(test_results);

          let pages = test_results.nbPages;
          // if (!pages) {
          //   iterations--;
          //   await loadExperts();
          // }

          const waitForLoop = () => {
            return new Promise((resolve, reject) => {
              for (let i = 0; i <= pages; i++) {
                index
                  .search(newJob, {
                    hitsPerPage: 1000,
                    page: i,
                  })
                  // eslint-disable-next-line no-loop-func
                  .then(async (results) => {
                    console.log(results);
                    results.hits.forEach((result) => {
                      if (!result.area || objectIds.includes(result.objectID)) {
                        return null;
                      } else {
                        if (!newArea) {
                          objectIds.push(result.objectID);
                          finalResults.push(result);
                        } else if (
                          result.area
                            .toLowerCase()
                            .includes(newArea.toLowerCase()) ||
                          newArea
                            .toLowerCase()
                            .includes(result.area.toLowerCase())
                        ) {
                          objectIds.push(result.objectID);

                          finalResults.push(result);
                        }
                      }
                    });

                    if (i == pages) {
                      console.log(finalResults);

                      setTimeout(() => {
                        resolve(true);
                      }, 2000);
                    }
                  });
              }
            });
          };
          waitForLoop().then(async () => {
            if (iterations > 0 && !finalResults.length) {
              iterations--;
              await loadExperts();
            } else if (first && !finalResults.length) {
              first = false;

              let newJobList = newJob.split(' ');
              newJob = newJobList[newJobList.length - 1];

              await loadExperts();
            } else {
              await setExperts([...finalResults]);

              await setLoading(false);
              resolve(true);
            }
          });
        });
      };

      await loadExperts();
    })();
  };

  const getExperts = async (params) => {
    setData({ job: params.profession, area: params.location });
    setLoading(true);

    await onSubmitSearch({
      newJob: params.profession,
      newArea: params.location,
    });
  };

  return (
    <div className="home">
      {loading ? (
        // <Spinner />
        <p
          style={{
            fontWeight: '600',
            fontSize: '3rem',
            color: '#18384c',
            textAlign: 'center',
          }}
        >
          Loading...
        </p>
      ) : searched ? (
        <div className="searchContainer__full">
          <SearchBar
            setSearched={setSearched}
            getExperts={getExperts}
            profession={data.job}
            location={data.area}
          />
          {experts.length ? (
            <SearchItems incomingExperts={experts} />
          ) : (
            <div className="searchContainer__notfound">
              No Experts found
              <button
                onClick={() => {
                  onSubmitSearch({ newJob: data.job, newArea: data.area });
                }}
                style={{ width: '10rem' }}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      ) : (
        <MainSearch getExperts={getExperts} setSearched={setSearched} />
      )}
    </div>
  );
}

export default connect(null, { setAlert })(Home);
