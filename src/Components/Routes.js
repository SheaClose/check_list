import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
// import Callback from './Callback';
import Home from './Home';
// import './Routes.css';

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: props.loggedIn
    };
  }
  componentWillReceiveProps(newProps) {
    const { loggedIn } = newProps;
    if (loggedIn !== this.state.loggedIn) {
      this.setState({ loggedIn });
    }
  }
  render() {
    const { loggedIn } = this.state;
    return (
      <Switch>
        {/* Protected Routes */}
        {loggedIn && (
          <Switch>
            <Route path="/" component={Home} />
            <Route
              path="/newChecklist"
              render={() => <div>newChecklist</div>}
            />
          </Switch>
        )}

        {/* If not logged in */}
        <Route
          path="/"
          render={() => {
            const style = {
              position: 'absolute',
              bottom: '50%',
              left: '50%',
              transform: 'translate(-50%)'
            };
            return this.props.loading ? (
              <div style={style}>Loading...</div>
            ) : (
              <RaisedButton
                onClick={this.props.login}
                style={style}
                label="Log In"
                secondary={true}
              />
            );
          }}
        />
      </Switch>
    );
  }
}

Routes.propTypes = {
  loggedIn: PropTypes.bool,
  login: PropTypes.func,
  loading: PropTypes.bool
};

export default withRouter(Routes);
