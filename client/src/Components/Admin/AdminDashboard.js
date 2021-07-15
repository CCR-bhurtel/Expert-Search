import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, BrowserRouter, Route, Switch } from 'react-router-dom';
import Spinner from '../Layouts/Spinner';
import AdminNav from './AdminNav';
import CreateExpert from './CreateExpert';
import EditExpert from './EditExpert';
import ExpertWitnesses from './ExpertWitnesses';
import LawProfessionals from './LawProfessionals';
import NewExperts from './NewExperts';
import NewUsers from './NewUsers';

function AdminDashboard(props) {
  useEffect(() => {
    let simplenav = document.getElementById('simplenav');

    setTimeout(() => {
      if (simplenav) simplenav.style.display = 'none';
    });

    return () => {
      simplenav.style.display = 'block';
    };
  }, []);

  if (props.auth.loading) {
    return (
      <div id="admin">
        <Spinner />
      </div>
    );
  } else if (!props.auth.isAuthenticated) {
    return <Redirect to="/" />;
  } else if (!props.auth.user.admin) {
    return <Redirect to="/" />;
  } else {
    return (
      <div id="admin">
        <AdminNav />
        <BrowserRouter>
          <Switch>
            <Route exact path="/admin/" component={NewUsers} />

            <Route exact path="/admin/newExperts" component={NewExperts} />

            <Route
              exact
              path="/admin/lawProfessionals"
              component={LawProfessionals}
            />

            <Route
              exact
              path="/admin/expertWitness"
              component={ExpertWitnesses}
            />
            <Route exact path="/admin/createExpert" component={CreateExpert} />
            <Route exact path="/admin/editExpert/:id" component={EditExpert} />
          </Switch>

          {/* <Route />

          <Route /> */}
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(AdminDashboard);
