import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Delete from 'material-ui/svg-icons/content/clear';
import Dialog from 'material-ui/Dialog';

import axios from 'axios';
// import './Home.css';
const deleteButton = { position: 'absolute', top: 0, right: 0 };

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      selectedChecklistToDel: 0
    };
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.deleteChecklistItem = this.deleteChecklistItem.bind(this);
  }
  handleDeleteButtonClick(selectedChecklistToDel) {
    this.setState({ openDialog: true, selectedChecklistToDel });
  }
  handleClose() {
    this.setState({ openDialog: false });
  }
  deleteChecklistItem() {
    axios
      .delete(`/api/checklisttemplate/${this.state.selectedChecklistToDel}`)
      .then(checklists => {
        this.props.updateChecklist(checklists.data);
        this.handleClose();
      })
      .catch(console.log);
  }
  render() {
    const { checklists = [] } = this.props;
    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
      <FlatButton
        label="Confirm Delete"
        primary={true}
        keyboardFocused={true}
        onClick={this.deleteChecklistItem}
      />
    ];
    const checkLists = checklists.map(checkList => (
      <Card
        zDepth={4}
        className="paperStyle"
        onClick={e =>
          (e.target.localName !== 'svg' && e.target.localName !== 'path'
            ? this.props.goTo(`/checklist/${checkList.id}`)
            : null)
        }
        key={checkList.id}
      >
        <CardHeader
          textStyle={{ paddingRight: 0 }}
          title={checkList.title}
          actAsExpander={true}
        >
          <Delete
            style={deleteButton}
            onClick={() => this.handleDeleteButtonClick(checkList.id)}
          />
        </CardHeader>
        <CardText>{checkList.desc}</CardText>
      </Card>
    ));
    return (
      <div className="">
        <h1>{checkLists}</h1>
        <Dialog
          title="Remove Checklist Template"
          actions={actions}
          modal={false}
          open={this.state.openDialog}
          onRequestClose={this.handleClose}
        >
          Removing this checklist will permanently delete it. Are you sure?
        </Dialog>
      </div>
    );
  }
}

Home.propTypes = {
  checklists: PropTypes.array,
  updateChecklist: PropTypes.func,
  goTo: PropTypes.func
};

export default Home;
