import React, { useState } from 'react';
import verified from '../../img/verified.png';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alertAction';
import ContactPopUp from '../Layouts/ContactPopUp';

function Featured({ featured, isAuthenticated, signup, setAlert }) {
  const [popup, setPopup] = useState(false);
  return (
    <div className="featured">
      {popup && (
        <ContactPopUp
          email={
            featured.email ||
            featured.emailMedicoLegalMatters ||
            'No Email For the expert'
          }
          setPopup={setPopup}
        />
      )}

      <div className="title">
        <div className="name__title">
          <p style={{ fontWeight: 500 }} className="name">
            {featured.salutation} {featured.Fname} {featured.LName}
          </p>
          <img src={verified} alt="" />
        </div>
        <div className="area">
          {featured.area !== 'FAILED' ? featured.area : null}
        </div>
      </div>
      <div style={{ marginTop: '0.5rem' }} className="tags">
        {featured.specialInterests}
      </div>
      <div style={{ marginTop: '1rem' }} className="summary">
        <div style={{ fontWeight: 500 }} className="summary__title">
          Medico-legal summary
        </div>
        <p style={{ fontSize: '16px' }} className="summary__content">
          {featured.medicoLegalSummary ||
            '  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel consequatur eligendi similique optio! Eveniet, blanditiis libero. Nostrum optio maxime, nobis veniam facilis in at quam numquam ipsum assumenda reprehenderit laudantium nihil perspiciatis adipisci amet repudiandae consequatur labore quo id quia inventore fuga illo! Tenetur, ratione consectetur. Possimus non commodi omnis ducimus, dolor adipisci ab minus, necessitatibus blanditiis error explicabo numquam quae accusamus iure voluptatibus corporis nostrum placeat ea veniam nam. Dolore, itaque iure minima dolores doloremque ab similique nobis autem odit velit maxime reprehenderit consectetur ut voluptatibus? Ob'}
        </p>
      </div>
      <div style={{ display: 'flex' }} className="buttons">
        <button
          onClick={() => {
            if (!isAuthenticated) signup();
            else setPopup(true);
          }}
          style={{ width: '10rem' }}
          className="contact btn-primary"
        >
          Contact Me
        </button>
        {isAuthenticated && (
          <button
            style={{ width: '10rem', marginLeft: '1rem' }}
            className="download btn-primary"
            onClick={async () => {
              if (featured.cv) {
                const res = await fetch('/api/experts/downloadCv', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('x-auth-token'),
                  },
                  body: JSON.stringify({ id: featured.objectID }),
                });
                const blob = await res.blob();
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', featured.cv);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
              } else {
                setAlert('The expert doesnt have a Cv', 'danger');
              }
            }}
          >
            Download Cv
          </button>
        )}
      </div>
    </div>
  );
}

export default connect(null, { setAlert })(Featured);
