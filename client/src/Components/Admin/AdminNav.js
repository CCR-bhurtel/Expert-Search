import React from 'react';
import { connect } from 'react-redux';
import './adminNav.css';

function AdminNav({ auth: { user } }) {
  return (
    <div className="admin-nav-container">
      <div
        onClick={() => {
          document.querySelector('.adminNav').classList.add('active');
        }}
        className="bars"
      >
        <div className="bar"></div>
      </div>

      <nav className="adminNav">
        <div
          onClick={() => {
            document.querySelector('.adminNav').classList.remove('active');
          }}
          className="times"
        >
          <div className="time"></div>
        </div>
        <ul className="admin-links">
          <li className="nav-item">
            <a href="/admin" className="nav-link newusers">
              New Users
            </a>
          </li>
          <li className="nav-item">
            <a href="/admin/newExperts" className="nav-link newexperts">
              New Experts
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/admin/lawProfessionals"
              className="nav-link lawprofessionals"
            >
              Law Professionals
            </a>
          </li>

          <li className="nav-item admin-nav-item">
            <p className="nav-item">
              <a href="/admin/expertWitness" className="nav-link expertwitness">
                Expert witness
              </a>
            </p>
          </li>
        </ul>
      </nav>
      <ul style={{ listStyle: 'none' }} className="admin-nav-collection">
        <li className="nav-item">
          <p
            style={{ color: 'rgba(50, 99, 131, 1)', marginRight: '30px' }}
            id="username"
          >
            {user.name}
          </p>
        </li>
      </ul>
    </div>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(AdminNav);
