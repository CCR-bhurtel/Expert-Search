import React, { useEffect, useState } from 'react';
import { setAlert } from '../../actions/alertAction';
import axios from 'axios';
import './admin.css';
import { connect } from 'react-redux';

function CreateExpert(props) {
  const [formData, setFormData] = useState({
    salutation: 'Dr',
    Fname: '',
    LName: '',
    jobTitle: '',
    area: '',

    medicoLegalSecrtaryPhone: '',
    medicoLegalPostcode1: '',
    emailMedicoLegalMatters: '',
    GMC: '',
    email: '',
    qualifications: '',
    specialInterests: '',
    website: '',
    company: '',
    cv: '',
    medicoLegalSummary: '',
    approved: false,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    let api = formData.approved
      ? '/api/experts/adminCreateExpert'
      : '/api/experts';

    let cv1 = document.querySelector('#cv1');
    axios
      .post(api, { ...formData })
      .then((response) => {
        if (cv1.files.length) {
          const formData1 = new FormData();

          formData1.append(
            `${formData.Fname}-${formData.medicoLegalSecrtaryPhone}`,
            cv1.files[0]
          );

          axios({
            method: 'POST',
            url: '/api/experts/postCv',
            headers: {
              id: response.data.expert._id,
              filename: `${formData.Fname}-${formData.medicoLegalSecrtaryPhone}`,
            },

            data: formData1,
          }).then((response) => {
            props.setAlert('New Expert created', 'success');
            setFormData({
              Fname: '',
              LName: '',
              jobTitle: '',
              area: '',
              jobTitle: '',

              medicoLegalSecrtaryPhone: '',
              medicoLegalPostcode1: '',
              emailMedicoLegalMatters: '',
              GMC: '',
              email: '',
              qualifications: '',
              specialInterests: '',
              website: '',
              company: '',
              cv: '',
              medicoLegalSummary: '',
              approved: false,
            });
          });
        } else {
          setFormData({
            Fname: '',
            LName: '',
            jobTitle: '',
            area: '',
            jobTitle: '',

            medicoLegalSecrtaryPhone: '',
            medicoLegalPostcode1: '',
            emailMedicoLegalMatters: '',
            GMC: '',
            email: '',
            qualifications: '',
            specialInterests: '',
            website: '',
            company: '',
            cv: '',
            medicoLegalSummary: '',
            approved: false,
          });
          props.setAlert('New Expert created', 'success');
        }
      })
      .catch((err) => {
        props.setAlert(err.response.data.message, 'danger');
      });
  };
  const onChange = (e) => {
    if (e.target.id == 'approved') {
      setFormData({ ...formData, approved: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    const input = document.querySelector('#cv1');
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
  return (
    <div className="modifyExpert">
      <div className="modifyTitle">Create Expert</div>
      <form onSubmit={onSubmit} className="modify__form">
        <div className="firstRow row">
          <select
            onChange={onChange}
            value={formData.salutation}
            name="salutation"
            id="salutation"
            className="salutation"
          >
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
            <option value="Ms">Ms</option>
            <option value="Mr">Mr</option>
          </select>
          <input
            onChange={onChange}
            value={formData.Fname}
            placeholder="First Name"
            type="text"
            name="Fname"
            id="Fname"
            className="Fname"
            required
          />
          <input
            onChange={onChange}
            value={formData.LName}
            placeholder="Last Name"
            type="text"
            name="LName"
            id="LName"
            className="Lname"
            required
          />
          <input
            onChange={onChange}
            value={formData.approved}
            type="checkbox"
            name="approved"
            id="approved"
            checked={formData.approved ? true : false}
          />
          <label htmlFor="approved">Verified</label>
        </div>

        <div className="secondRow row">
          <input
            onChange={onChange}
            value={formData.GMC}
            placeholder="GMC/ HCPC#"
            type="text"
            id="GMC"
            name="GMC"
            required
          />
          <input
            id="cv1"
            className="cv"
            type="file"
            data-multiple-caption="{count} files selected"
            multiple
          />

          <label htmlFor="cv1">Upload Cv</label>
          <label htmlFor="cv1" id="fileno"></label>
        </div>
        <div className="row inserted">
          <input
            type="text"
            placeholder="Job Title"
            name="jobTitle"
            id="jobTitle"
            required
            onChange={onChange}
            value={formData.jobTitle}
          />
          <input
            type="text"
            placeholder="Area"
            name="area"
            id="area"
            required
            onChange={onChange}
            value={formData.area}
          />
        </div>
        <div className="thirdRow row">
          <input
            onChange={onChange}
            value={formData.medicoLegalPostcode1}
            placeholder="Postcode"
            type="text"
            name="medicoLegalPostcode1"
            id="medicoLegalPostcode1"
            className="medicoLegalPostcode1"
            required
          />
          <input
            onChange={onChange}
            value={formData.email}
            placeholder="Email"
            type="email"
            name="email"
            id="email"
            className="email"
            required
          />
          <input
            onChange={onChange}
            value={formData.medicoLegalSecrtaryPhone}
            placeholder="Contact No."
            type="text"
            name="medicoLegalSecrtaryPhone"
            id="medicoLegalSecrtaryPhone"
            className="medicoLegalSecrtaryPhone"
            required
          />
        </div>
        <div className="fourthRow row">
          <input
            onChange={onChange}
            value={formData.specialInterests}
            placeholder="Special Interests"
            type="text"
            className="specialInterests"
            name="specialInterests"
            id="specialInterests"
            required
          />
        </div>
        <div className="fifthRow row">
          <textarea
            onChange={onChange}
            value={formData.medicoLegalSummary}
            placeholder="Medico-legal Summary"
            className="medicoLegalSummary"
            name="medicoLegalSummary"
            id="medicoLegalSummary"
            required
          />
        </div>
        <button className="btn-primary">Save</button>
      </form>
    </div>
  );
}

export default connect(null, { setAlert })(CreateExpert);
