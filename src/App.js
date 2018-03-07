import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import {
  BottomNavigation,
  BottomNavigationItem
} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import Home from 'material-ui/svg-icons/action/home';
import Previous from 'material-ui/svg-icons/av/library-books';
import Active from 'material-ui/svg-icons/action/assignment';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import 'material-design-icons';

import Routes from './Components/Routes';

import './App.css';

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
      open: false,
      loading: true
    };
    this.handlePageRefresh = this.handlePageRefresh.bind(this);
    this.select = this.select.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
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

  handlePageRefresh() {
    this.setState({ ...this.state, open: false });
  }

  select(index, path) {
    this.setState({ selectedIndex: index });
    this.goTo(path);
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  logOut() {
    this.setState({ loggedIn: false, user: null, open: false });
    axios.get('/api/logout').then(res => {
      console.log(res);
    });
  }

  goTo(path) {
    this.props.history.push(path);
  }
  render() {
    const { loggedIn, loading, checklists } = this.state;
    return (
      <div className="App">
        <AppBar
          title={<span style={{ color: 'white' }}>Protocol 5</span>}
          showMenuIconButton={false}
          iconElementRight={
            <div onClick={() => this.setState({ open: true })}>
              {loggedIn && (
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
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
          <MenuItem
            onClick={() => {
              this.goTo('/newChecklist');
              this.handleToggle();
            }}
            primaryText="New Checklist"
          />
          <MenuItem primaryText="Refresh" onClick={this.handlePageRefresh} />
          <MenuItem
            style={{
              position: 'absolute',
              bottom: '10px',
              margin: 'auto',
              width: '100%',
              borderTop: '1px solid white'
            }}
            onClick={() => this.logOut()}
            primaryText="Logout"
          />
        </Drawer>
        <Routes
          login={login}
          loggedIn={loggedIn}
          checklists={checklists}
          loading={loading}
        />
        <Paper style={{ overflow: 'hidden' }} zDepth={1}>
          <BottomNavigation
            style={bottomNav}
            selectedIndex={this.state.selectedIndex}
          >
            <BottomNavigationItem
              label="Home"
              icon={<Home />}
              onClick={() => this.select(0, '/')}
            />
            <BottomNavigationItem
              label="Active"
              icon={<Active />}
              onClick={() => this.select(1, '/Active')}
            />
            <BottomNavigationItem
              label="Previous"
              icon={<Previous />}
              onClick={() => this.select(2, '/Previous')}
            />
          </BottomNavigation>
        </Paper>
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.object
};

export default withRouter(App);

function login() {
  window.location.href = `${process.env.REACT_APP_HOST}/login`;
}
