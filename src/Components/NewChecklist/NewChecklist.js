import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Card } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
// import axios from 'axios';
// import './NewChecklist.css';
const cardStyle = { minHeight: '40vh' };
class NewChecklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: ''
    };
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(prop, val) {
    this.setState({ [prop]: val });
  }

  render() {
    const { goTo, submitNewChecklist } = this.props;
    const { name, desc } = this.state;
    return (
      <Card zDepth={3} className="paperStyle" style={cardStyle}>
        <form
          onSubmit={e => {
            e.preventDefault();
            submitNewChecklist(name, desc);
          }}
        >
          <TextField
            onChange={e => this.handleInput('name', e.target.value)}
            hintText=""
            floatingLabelText="Checklist Name"
          />
          <br />
          <TextField
            onChange={e => this.handleInput('desc', e.target.value)}
            hintText=""
            floatingLabelText="Description"
          />
          <br />
          <br />
          <br />
          <RaisedButton onClick={() => goTo('/')} style={{ margin: '0 10px' }}>
            Cancel
          </RaisedButton>
          <RaisedButton
            type="submit"
            primary={true}
            style={{ margin: '0 10px' }}
          >
            Forward
          </RaisedButton>
        </form>
      </Card>
    );
  }
}

NewChecklist.propTypes = {
  goTo: PropTypes.func,
  submitNewChecklist: PropTypes.func
};
export default NewChecklist;
