import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const Callback = props => {
  props.auth.auth0.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      axios
        .post('/api/postUser', { user: authResult.idTokenPayload })
        .then(({ data }) => {
          props.updateUser(data);
        });
    }
  });
  return <Redirect to="/" />;
};

Callback.propTypes = {
  auth: PropTypes.object
};

export default Callback;
