import React, { useEffect, useState } from 'react';
import './getListed.css';
import axios from 'axios';
import { setAlert } from '../../actions/alertAction';

import { connect } from 'react-redux';
function GetListed(props) {
  const [formData, setFormData] = useState({
    salutation: 'Dr',
    Fname: '',
    LName: '',
    jobTitle: '',
    medicoLegalSecrtaryPhone: '',
    email: '',
    GMC: '',
    qualifications: '',
    specialInterests: '',
    area: '',
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const input = document.querySelector('#cv');
    input.addEventListener('change', (e) => {
      var fileName = '';
      if (e.target.files && e.target.files.length > 1) {
        fileName = (
          e.target.getAttribute('data-multiple-caption') || ''
        ).replace('{count}', this.files.length);
      } else {
        fileName = e.target.value.split(/\\/).pop();
      }
      document.querySelector('#fileno').innerHTML = fileName;
    });
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData1 = new FormData();

    formData1.append(
      `${formData.Fname}-${formData.medicoLegalSecrtaryPhone}`,
      document.querySelector('#cv').files[0]
    );

    axios
      .post('/api/experts', { ...formData })
      .then(async (response) => {
        console.log(response);
        const response2 = axios({
          method: 'POST',
          url: '/api/experts/postCv',
          headers: {
            id: response.data.expert._id,
            filename: `${formData.Fname}-${formData.medicoLegalSecrtaryPhone}`,
          },

          data: formData1,
        })
          .then((response) => {
            props.setAlert('Request submitted successfully', 'success');

            setFormData({
              salutation: 'Dr',
              Fname: '',
              LName: '',
              jobTitle: '',
              medicoLegalSecrtaryPhone: '',

              email: '',
              GMC: '',
              qualifications: '',
              specialInterests: '',
              area: '',
            });
          })
          .catch((err) => {
            console.log(err);
            // props.setAlert(err.response.data.message, 'danger');
          });
      })
      .catch((err) => {
        props.setAlert(err.response.data.message, 'danger');
      });
  };

  return (
    <div className="getListed">
      <div className="form-container">
        <h3>Get listed as an expert</h3>
        <form onSubmit={onSubmit}>
          <div className="firstRow">
            <select
              onChange={onChange}
              value={formData.salutation}
              className="salutaion"
              name="salutation"
              id="salutaion"
            >
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
              <option value="Ms">Ms</option>
              <option value="Mr">Mr</option>
            </select>
            <input
              required
              className="firstname"
              type="text"
              name="Fname"
              onChange={onChange}
              value={formData.Fname}
              placeholder="First Name"
            />
            <input
              required
              className="lastname"
              type="text"
              name="LName"
              onChange={onChange}
              value={formData.LName}
              placeholder="Last Name"
            />
          </div>
          <div className="secondRow">
            <input
              required
              className="jobtitle"
              type="text"
              name="jobTitle"
              onChange={onChange}
              value={formData.jobTitle}
              placeholder="Job title"
            />
            <input
              required
              type="email"
              name="email"
              className="email"
              onChange={onChange}
              value={formData.email}
              placeholder="Email"
            />
          </div>
          <div className="thirdRow">
            <input
              required
              className="area"
              type="text"
              name="area"
              vaue={formData.area}
              onChange={onChange}
              placeholder="Area"
            />
            <input
              required
              className="phone"
              type="text"
              onChange={onChange}
              name="medicoLegalSecrtaryPhone"
              value={formData.medicoLegalSecrtaryPhone}
              placeholder="Contact number"
            />

            <div className="cv">
              <input
                required
                id="cv"
                className="cv"
                type="file"
                data-multiple-caption="{count} files selected"
                multiple
              />

              <label htmlFor="cv">Upload Cv</label>
              <label htmlFor="cv" id="fileno"></label>
            </div>
          </div>
          <div className="fourthRow">
            <input
              required
              className="specialinterest"
              type="text"
              name="specialInterests"
              placeholder="Special Interests"
              value={formData.specialInterests}
              onChange={onChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, { setAlert })(GetListed);
