import React, { useEffect, useState } from 'react';
import { v1 } from 'uuid';
import axios from 'axios';
import Spinner from '../Layouts/Spinner';
import './admin.css';
const download = require('js-file-download');

function NewUsers() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [approving, setApproving] = useState({});
  const [deleting, setDeleting] = useState({});
  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/experts/getUnapproved')
      .then((response) => {
        setResults(response.data.experts);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  else
    return (
      <div className="results">
        <div className="total">{results.length} results...</div>
        <div className="content_items">
          {!results.length ? (
            <h4 style={{ textAlign: 'center' }}>No new Experts</h4>
          ) : (
            results.map((result, index) => {
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
                        {result.email}
                      </div>
                    </div>
                    <div className="row2">
                      <div className="phone">
                        {result.medicoLegalSecrtaryPhone}
                      </div>
                      <div
                        style={{
                          textDecoration: 'underline',
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
                                  body: JSON.stringify({ id: result._id }),
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
                    <div
                      onClick={() => {
                        setApproving({ ...approving, [`index${index}`]: true });
                        axios
                          .put('/api/experts/approve', { id: result._id })
                          .then((response) => {
                            const updated = results.filter(
                              (item) => item._id !== result._id
                            );
                            setResults(updated);
                            setApproving({
                              ...approving,
                              [`index${index}`]: false,
                            });
                          });
                      }}
                      className="approve"
                    >
                      {approving[`index${index}`] ? 'Approving...' : 'Approve'}
                    </div>
                    <div
                      onClick={() => {
                        setDeleting({ ...deleting, [`index${index}`]: true });

                        axios
                          .put('/api/experts/deleteExpert', { id: result._id })
                          .then((response) => {
                            const updated = results.filter(
                              (item) => item._id !== result._id
                            );
                            setResults(updated);
                            setDeleting({
                              ...deleting,
                              [`index${index}`]: false,
                            });
                          });
                      }}
                      className="decline"
                    >
                      {deleting[`index${index}`] ? 'Declining...' : 'Decline'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
}

export default NewUsers;
