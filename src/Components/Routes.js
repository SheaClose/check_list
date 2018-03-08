import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

// import Callback from './Callback';
import Home from './Home';
import NewChecklist from './NewChecklist/NewChecklist';
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
    const { submitNewChecklist, loading, login, checklists, goTo } = this.props;
    return (
      <Switch>
        {/* Protected Routes */}
        {loggedIn && (
          <Switch>
            <Route
              exact
              path="/"
              render={props => <Home {...props} checklists={checklists} />}
            />
            <Route
              path="/newChecklist"
              render={props => (
                <NewChecklist
                  submitNewChecklist={submitNewChecklist}
                  {...props}
                  goTo={goTo}
                />
              )}
            />
            <Route path="/previous" render={() => <div>previous</div>} />
            <Route path="/active" render={() => <div>active</div>} />
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
            return loading ? (
              <div style={style}>Loading...</div>
            ) : (
              <RaisedButton
                onClick={login}
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
  goTo: PropTypes.func,
  submitNewChecklist: PropTypes.func,
  loading: PropTypes.bool,
  checklists: PropTypes.array
};

export default withRouter(Routes);
