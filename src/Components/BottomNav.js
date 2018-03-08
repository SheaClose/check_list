import React, { Component } from 'react';
import {
  BottomNavigation,
  BottomNavigationItem
} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import Home from 'material-ui/svg-icons/action/home';
import Previous from 'material-ui/svg-icons/av/library-books';
import Active from 'material-ui/svg-icons/action/assignment';
import PropTypes from 'prop-types';
// import './BottomNav.css';
const bottomNav = {
  position: 'fixed',
  bottom: 0,
  fontSize: '90%'
};

class BottomNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { select, selectedIndex } = this.props;
    return (
      <Paper style={{ overflow: 'hidden' }} zDepth={1}>
        <BottomNavigation style={bottomNav} selectedIndex={selectedIndex}>
          <BottomNavigationItem
            label="Home"
            icon={<Home />}
            onClick={() => select(0, '/')}
          />
          <BottomNavigationItem
            label="Active"
            icon={<Active />}
            onClick={() => select(1, '/Active')}
          />
          <BottomNavigationItem
            label="Previous"
            icon={<Previous />}
            onClick={() => select(2, '/Previous')}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

BottomNav.propTypes = {
  select: PropTypes.func,
  selectedIndex: PropTypes.number
};
export default BottomNav;
