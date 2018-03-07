import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardHeader, CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
// import './Home.css';
const paperStyle = {
  width: '70vw',
  padding: 10,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block'
};
class Home extends Component {
  render() {
    const { checklists = [] } = this.props;
    const checkLists = checklists.map(checkList => (
      <Paper zDepth={4} style={paperStyle} key={checkList.id}>
        <CardHeader
          textStyle={{ paddingRight: 0 }}
          title={checkList.title}
          actAsExpander={true}
        />
        <CardText>{checkList.desc}</CardText>
      </Paper>
    ));
    return (
      <div className="">
        <h1>{checkLists}</h1>
      </div>
    );
  }
}

Home.propTypes = {
  checklists: PropTypes.array
};

export default Home;
