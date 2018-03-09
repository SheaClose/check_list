import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const customContentStyle = {
  width: '90%',
  maxWidth: 'none'
};
// import './ChecklistDisplay.css';

class ChecklistDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checklistItems: [],
      openDialog: false,
      name: ''
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addItemToChecklist = this.addItemToChecklist.bind(this);
  }
  componentDidMount() {
    axios
      .get(`/api/checklist_item/${this.props.match.params.id}`)
      .then(({ data: checklistItems }) => this.setState({ checklistItems }));
  }
  handleOpen() {
    this.setState({ openDialog: true });
  }

  handleClose() {
    this.setState({ openDialog: false });
  }
  addItemToChecklist() {
    const { name } = this.state;
    axios
      .post(`/api/checklist_item/${this.props.match.params.id}`, { name })
      .then(({ data: checklistItems }) => {
        this.setState({ checklistItems, openDialog: false });
      })
      .catch(console.log);
  }
  render() {
    const actions = [
      <RaisedButton
        style={{ margin: '0 5px' }}
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton style={{ margin: '0 5px' }} label="Submit" primary={true} />
    ];
    const listItems = this.state.checklistItems.map(item => (
      <div key={item.id}>
        <ListItem
          primaryText={item.name}
          rightToggle={<Toggle defaultToggled={item.complete} />}
        />
        <Divider />
      </div>
    ));
    return (
      <div>
        <Paper className="paperStyle" zDepth={3}>
          <List>
            <Subheader>
              {listItems.length
                ? 'Checklist Items'
                : 'Please add items to this checklist'}{' '}
            </Subheader>
            {listItems}
          </List>
        </Paper>
        <FloatingActionButton
          onClick={this.handleOpen}
          className="addIcon"
          zDepth={3}
        >
          <ContentAdd />
        </FloatingActionButton>

        <Dialog
          title="New Item"
          actions={actions}
          modal={true}
          contentStyle={customContentStyle}
          open={this.state.openDialog}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              this.addItemToChecklist();
            }}
          >
            <TextField
              autoFocus
              onChange={e => this.setState({ name: e.target.value })}
              floatingLabelText="Add item to checklist"
            />
          </form>
        </Dialog>
      </div>
    );
  }
}

ChecklistDisplay.propTypes = {
  match: PropTypes.object
};

export default ChecklistDisplay;
