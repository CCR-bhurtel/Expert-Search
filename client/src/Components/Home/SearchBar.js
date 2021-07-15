import React, { useEffect, useState } from 'react';
import prof from '../../img/prof-icon.png';
import loc from '../../img/loc-icon.png';
import algoliasearch from 'algoliasearch';
import { v1 } from 'uuid';

function SearchBar(props) {
  const { profession, location } = props;
  const [formData, setformData] = useState({ profession, location });

  const [area, setArea] = useState([]);
  const [job, setJob] = useState([]);

  const client = algoliasearch(
    process.env.REACT_APP_APPID,
    process.env.REACT_APP_APIID
  );

  const index = client.initIndex('experts');

  useEffect(() => {
    setformData({ ...formData, profession, location });
  }, []);

  const search = (param, value) => {
    if (param === 'profession') {
      index.setSettings({
        searchableAttributes: [
          'jobTitle',
          'qualifications',
          'specialInterest',
          'unordered(area)',
        ],

        // customRanking: ['desc(views)'],
      });

      index.search(value).then((result) => {
        let titles = result.hits.map((hit) => hit.jobTitle);
        const uniqueList = [];
        titles.forEach((title) => {
          if (!uniqueList.includes(title)) {
            uniqueList.push(title);
          }
        });
        const jobList = uniqueList.splice(0, 20);

        setJob([]);
        setJob([...jobList]);
      });
    } else if (param === 'location') {
      index.setSettings({
        searchableAttributes: ['area'],

        // customRanking: ['desc(views)'],
      });

      index.search(value).then((result) => {
        let locations = result.hits.map((hit) => hit.area);

        const uniqueList = [];
        locations.forEach((location) => {
          if (!uniqueList.includes(location)) {
            uniqueList.push(location);
          }
        });

        let finalLocations = uniqueList.splice(0, 20);

        setArea([...finalLocations]);
      });
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await props.getExperts(formData);

    props.setSearched(true);
  };

  const onChange = (e) => {
    e.target.style.borderRadius = '16px !important';

    setformData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.value === '') {
      if (e.target.name === 'profession') {
        setJob([]);
      } else {
        setArea([]);
      }
    } else {
      search(e.target.name, e.target.value);
    }
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off" className="searchForm">
      <div className="searchbar profession">
        <div className="inputElements">
          <input
            onFocus={(e) => {
              if (job.length === 0) {
                e.target.style.borderRadius = '16px';
              }
            }}
            type="text"
            name="profession"
            id="profession"
            placeholder="Profession"
            required
            value={formData.profession}
            onChange={onChange}
          />
          <div className="icon prof-icon">
            <img src={prof} alt="" />
          </div>
        </div>
        <div className="resultElements job">
          {job.map((thisJob) => (
            <div
              key={v1()}
              onClick={(e) => {
                setformData({ ...formData, profession: thisJob });

                setJob([]);
              }}
              className="resultElement job"
            >
              {thisJob}
            </div>
          ))}
        </div>
      </div>
      <div className="searchbar location">
        <div className="inputElements">
          <input
            onFocus={(e) => {
              if (area.length === 0) {
                e.target.style.borderRadius = '16px';
              }
            }}
            type="text"
            name="location"
            id="location"
            placeholder="Location"
            value={formData.location}
            onChange={onChange}
          />
          <div className="icon loc-icon">
            <img src={loc} alt="" />
          </div>
        </div>
        <div style={{ minWidth: '100%' }} className="resultElements area">
          {area.map((thisArea) => (
            <div
              onClick={(e) => {
                setformData({ ...formData, location: thisArea });

                setArea([]);
              }}
              key={v1()}
              className="resultElement"
            >
              {thisArea}
            </div>
          ))}
        </div>
      </div>
      <button style={{ display: 'none' }} type="submit">
        Submit
      </button>
    </form>
  );
}

export default React.memo(SearchBar);
