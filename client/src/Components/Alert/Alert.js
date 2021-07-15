import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './alert.css';

const Alert = ({ alerts }) =>
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div
      style={{ top: `${window.scrollY + 10}px` }}
      key={alert.id}
      className={`alert alert-${alert.alertType}`}
    >
      {alert.msg || 'Internal Server Error'}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});
export default connect(mapStateToProps)(Alert);
