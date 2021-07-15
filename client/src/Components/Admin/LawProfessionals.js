import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v1 } from 'uuid';
import algoliasearch from 'algoliasearch';

function LawProfessionals() {
  const client = algoliasearch(
    process.env.REACT_APP_APPID,
    process.env.REACT_APP_APIID
  );

  const index = client.initIndex('lawProfessionals');
  const [professionals, setProfessionals] = useState([]);
  const [value, setValue] = useState('');
  const [deleting, setDeleting] = useState({});

  const searchLawProfessionals = (query) => {
    index.search(query, { hitsPerPage: 100 }).then((result) => {
      setProfessionals(result.hits.splice(0, 50));
    });
  };

  let onChange = (e) => {
    setValue(e.target.value);
    searchLawProfessionals(e.target.value);
  };
  useEffect(() => {
    searchLawProfessionals('');
  }, []);

  return (
    <div className="lawProfessionals">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        autoComplete="off"
        className="search"
      >
        <input
          type="text"
          name="professionals"
          id="professionals"
          placeholder="Search"
          value={value}
          onChange={onChange}
        />
      </form>
      <div className="results">
        <div className="total">{professionals.length} results...</div>
        <div className="content_items">
          {!professionals.length ? (
            <h4 style={{ textAlign: 'center' }}>No professionals found</h4>
          ) : (
            professionals.map((result, index) => {
              return (
                <div key={v1()} className="single_item">
                  <div className="details">
                    <div className="name">{result.name}</div>
                    <div
                      style={{ textDecoration: 'underline' }}
                      className="email"
                    >
                      {result.email}
                    </div>
                    <div className="phone">
                      {result.medicoLegalSecrtaryPhone}
                    </div>
                  </div>

                  <div className="actions">
                    <div className="approve">Edit</div>
                    <p
                      style={{
                        marginLeft: '-20px',
                        color: 'rgba(17, 75, 224, 1)',
                      }}
                    >
                      {' '}
                      /
                    </p>
                    <div
                      onClick={() => {
                        setDeleting({ ...deleting, [`index${index}`]: true });

                        axios
                          .put('/api/users/deleteUser', { id: result.objectID })
                          .then((response) => {
                            const updated = professionals.filter(
                              (item) => item.objectID !== result.objectID
                            );
                            setProfessionals(updated);
                            setDeleting({
                              ...deleting,
                              [`index${index}`]: false,
                            });
                          });
                      }}
                      className="decline"
                    >
                      {deleting[`index${index}`] ? 'Removing...' : 'Remove'}
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

export default LawProfessionals;
