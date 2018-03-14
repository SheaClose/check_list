import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Snackbar from 'material-ui/Snackbar';

import 'material-design-icons';

import Routes from './Components/Routes';
import Nav from './Components/Nav';
import BottomNav from './Components/BottomNav';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loading: true,
      openSnackBar: false,
      snackBarMessage: '',
      checklists: []
    };
    this.goTo = this.goTo.bind(this);
    this.select = this.select.bind(this);
    this.logout = this.logout.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
    this.submitNewChecklist = this.submitNewChecklist.bind(this);
    this.updateChecklist = this.updateChecklist.bind(this);
  }

  componentDidMount() {
    axios.get('/api/user').then(res => {
      if (res.data) {
        this.setState({ loggedIn: true, user: res.data });
      }
      this.setState({ loading: false });
    });
    axios
      .get('/api/checklists')
      .then(({ data: checklists }) => {
        this.setState({ checklists });
      })
      .catch(console.log);
  }
  submitNewChecklist(name, desc) {
    axios
      .post('/api/newChecklist', { name, desc })
      .then(({ data }) => {
        this.setState({ checklists: [...this.state.checklists, data] });
        this.goTo('/');
      })
      .catch(console.log);
  }

  select(index, path) {
    this.setState({ selectedIndex: index });
    this.goTo(path);
  }

  goTo(path) {
    this.props.history.push(path);
  }
  logout() {
    this.setState({ loggedIn: false, user: null });
    axios.get('/api/logout').then(() => {
      this.handleSnackBarOpen('Thank you, come again!');
    });
  }
  handleSnackBarClose() {
    this.setState({
      openSnackBar: false,
      snackBarMessage: ''
    });
  }
  handleSnackBarOpen(snackBarMessage) {
    this.setState({
      openSnackBar: true,
      snackBarMessage
    });
  }
  updateChecklist(checklists) {
    this.setState({ checklists });
  }
  render() {
    const { loggedIn, loading, checklists, selectedIndex } = this.state;
    return (
      <div className="App">
        <Nav goTo={this.goTo} loggedIn={loggedIn} logout={this.logout} />
        <Routes
          login={login}
          loggedIn={loggedIn}
          checklists={checklists}
          loading={loading}
          goTo={this.goTo}
          submitNewChecklist={this.submitNewChecklist}
          updateChecklist={this.updateChecklist}
        />
        <BottomNav selectedIndex={selectedIndex} select={this.select} />

        <Snackbar
          open={this.state.openSnackBar}
          message={this.state.snackBarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackBarClose}
        />
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.object
};

export default withRouter(App);

function login() {
  const { REACT_APP_HOST } = process.env;
  window.location.href = `${REACT_APP_HOST || ''}/login`;
}
