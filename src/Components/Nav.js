import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PropTypes from 'prop-types';
// import './Nav.css';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handlePageRefresh = this.handlePageRefresh.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }
  handlePageRefresh() {
    this.setState({ ...this.state, open: false });
  }
  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { loggedIn, goTo, logout } = this.props;
    return (
      <div className="">
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
              goTo('/newChecklist');
              this.handleToggle();
            }}
            primaryText="New Checklist"
          />
          <MenuItem
            onClick={() => {
              goTo('/edit');
              this.handleToggle();
            }}
            primaryText="Edit Checklists"
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
            onClick={() => {
              this.handleToggle();
              logout();
            }}
            primaryText="Logout"
          />
        </Drawer>
      </div>
    );
  }
}

Nav.propTypes = {
  loggedIn: PropTypes.bool,
  goTo: PropTypes.func,
  logout: PropTypes.func
};

export default Nav;
