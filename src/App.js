import React, { Component } from 'react';
// import axios from 'axios';

import { withRouter, Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import Avatar from 'material-ui/Avatar';
import {
  BottomNavigation,
  BottomNavigationItem
} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import Home from 'material-ui/svg-icons/action/home';
import Previous from 'material-ui/svg-icons/av/library-books';
import Active from 'material-ui/svg-icons/action/assignment';
import axios from 'axios';
import 'material-design-icons';

import Auth from './Auth';
import Routes from './Components/Routes';

import './App.css';

const auth = new Auth();

const bottomNav = {
  position: 'absolute',
  bottom: 0,
  fontSize: '90%'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      open: false
    };
    this.updateUser = this.updateUser.bind(this);
    this.handlePageRefresh = this.handlePageRefresh.bind(this);
    this.select = this.select.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }
  componentDidMount() {
    if (!this.state.user) {
      axios.get('/api/user').then(response => {
        this.setState({ user: response.data });
      });
    }
  }
  handlePageRefresh() {
    this.setState({ ...this.state });
  }

  updateUser(user) {
    this.setState({ user, loggedIn: true });
  }
  select(index) {
    this.setState({ selectedIndex: index });
  }
  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { loggedIn } = this.state;
    return (
      <div className="App">
        <AppBar
          title={<span>Protocol 5</span>}
          showMenuIconButton={false}
          iconElementRight={
            <div onClick={() => this.setState({ open: true })}>
              {this.state.user && (
                <Avatar src={this.state.user.img_url} size={50} />
              )}
            </div>
          }
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <Link to="/newChecklist">
            <MenuItem primaryText="New Checklist" />
          </Link>
          <MenuItem primaryText="Refresh" onClick={this.handlePageRefresh} />
          <MenuItem
            style={{
              position: 'absolute',
              bottom: '10px',
              margin: 'auto',
              width: '100%',
              borderTop: '1px solid white'
            }}
            onClick={logout}
            primaryText="Logout"
          />
        </Drawer>
        <Routes
          updateUser={this.updateUser}
          login={login}
          loggedIn={loggedIn}
          auth={auth}
        />
        <Paper style={{ overflow: 'hidden' }} zDepth={1}>
          <BottomNavigation
            style={bottomNav}
            selectedIndex={this.state.selectedIndex}
          >
            <BottomNavigationItem
              label="Home"
              icon={<Home />}
              onClick={() => this.select(0)}
            />
            <BottomNavigationItem
              label="Active"
              icon={<Active />}
              onClick={() => this.select(1)}
            />
            <BottomNavigationItem
              label="Previous"
              icon={<Previous />}
              onClick={() => this.select(2)}
            />
          </BottomNavigation>
        </Paper>
      </div>
    );
  }
}

export default withRouter(App);

function logout() {}
function login() {
  auth.login();
}
