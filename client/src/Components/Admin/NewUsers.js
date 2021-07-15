import React, { useEffect, useState } from 'react';
import { v1 } from 'uuid';
import axios from 'axios';
import Spinner from '../Layouts/Spinner';
import './admin.css';

function NewUsers() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [approving, setApproving] = useState({});
  const [deleting, setDeleting] = useState({});
  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/users/getUnapproved')
      .then((response) => {
        setResults(response.data.users);
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
            <h4 style={{ textAlign: 'center' }}>No new Users</h4>
          ) : (
            results.map((result, index) => {
              // setApproving({ ...approving, [`index${index}`]: false });
              // setDeleting({ ...deleting, [`index${index}`]: false });

              return (
                <div key={v1()} className="single_item">
                  <div className="details">
                    <div className="name">{result.name}</div>
                    <div className="email">{result.email}</div>
                  </div>

                  <div className="actions">
                    <div
                      onClick={() => {
                        setApproving({ ...approving, [`index${index}`]: true });
                        axios
                          .put('/api/users/approve', { id: result._id })
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
                          .put('/api/users/deleteUser', { id: result._id })
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
