import React, { useEffect, useState } from 'react';
import { v1 } from 'uuid';
import Spinner from '../Layouts/Spinner';
import algoliasearch from 'algoliasearch';

import axios from 'axios';

const download = require('js-file-download');

function ExpertWitnesses() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const client = algoliasearch(
    process.env.REACT_APP_APPID,
    process.env.REACT_APP_APIID
  );

  const index = client.initIndex('experts');
  const [value, setValue] = useState('');

  const searchExperts = (query) => {
    index.setSettings({
      searchableAttributes: [
        'Fname',
        'LName',
        'jobTitle',
        'specialInterest',
        'qualification',
        'area',
      ],
    });
    index.search(query, { hitsPerPage: 500 }).then((result) => {
      setExperts(result.hits.splice(0, 50));
      setLoading(false);
    });
  };

  let onChange = (e) => {
    setLoading(true);
    setValue(e.target.value);
    // searchExperts(e.target.value);
  };

  useEffect(() => {
    searchExperts(value);
  }, [value]);

  return (
    <div className="expertWitnesses">
      <div style={{ display: 'flex' }} className="expertActions">
        <form autoComplete="off" className="search">
          <input
            value={value}
            onChange={onChange}
            type="text"
            name="expert"
            id="expert"
            placeholder="Search"
          />
        </form>
        <a href="/admin/createExpert">
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-end',
              width: '8rem',
            }}
            className="button btn-primary"
          >
            Add Expert
          </button>
        </a>
      </div>

      <div className="results">
        <div className="total">{experts.length} results...</div>
        <div className="content_items">
          {loading ? (
            <Spinner />
          ) : !experts.length ? (
            <h4 style={{ textAlign: 'center' }}>No Experts found</h4>
          ) : (
            experts.map((result, index) => {
              return (
                <div key={v1()} className="single_item">
                  <div className="details">
                    <div className="row1">
                      <div className="name">
                        {result.salutation} {result.Fname} {result.LName}
                      </div>
                      <div className="jobTitle">{result.jobTitle}</div>
                      <div
                        style={{ textDecoration: 'underline' }}
                        className="email"
                      >
                        {result.email
                          ? result.email
                          : result.emailMedicoLegalMatters
                          ? result.emailMedicoLegalMatters
                          : null}
                      </div>
                    </div>
                    <div className="row2">
                      <div className="phone">
                        {result.medicoLegalSecrtaryPhone
                          ? result.medicoLegalSecrtaryPhone
                          : null}
                      </div>
                      <div
                        style={{
                          cursor: 'pointer',
                        }}
                        className="cv"
                      >
                        {result.cv ? (
                          // eslint-disable-next-line jsx-a11y/anchor-is-valid
                          <a
                            style={{ color: 'rgba(17, 75, 224, 1)' }}
                            onClick={async () => {
                              const res = await fetch(
                                '/api/experts/downloadCv',
                                {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'x-auth-token':
                                      localStorage.getItem('x-auth-token'),
                                  },
                                  body: JSON.stringify({ id: result.objectID }),
                                }
                              );
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(
                                new Blob([blob])
                              );
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', result.cv);
                              document.body.appendChild(link);
                              link.click();
                              link.parentNode.removeChild(link);
                            }}
                          >
                            {result.cv}
                          </a>
                        ) : (
                          '--'
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="actions">
                    <div className="approve">
                      <a href={`/admin/editExpert/${result.objectID}`}>Edit</a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
export default ExpertWitnesses;
