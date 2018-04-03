import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

// import './ChecklistDisplay.css';

class ChecklistDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checklistItems: []
    };
    this.listItemToggle = this.listItemToggle.bind(this);
  }
  componentDidMount() {
    axios
      .get(`/api/checklist_item/${this.props.match.params.id}`)
      .then(({ data: checklistItems }) => {
        this.setState({ checklistItems });
      });
  }
  listItemToggle(checklist) {
    const { complete, id } = checklist;
    axios
      .put(`/api/toggle_checklist_item/${id}`, {
        checklist: {
          complete: !complete,
          completed_by: complete ? null : this.props.user.id,
          completion_date: complete ? null : Date.now()
        },
        checklistId: this.props.match.params.id
      })
      .then(res => {
        this.setState({ checklistItems: res.data });
      })
      .catch(console.log);
  }
  render() {
    const listItems = this.state.checklistItems
      .sort((a, b) => a.id > b.id)
      .map(item => (
        <div key={item.id}>
          <ListItem
            primaryText={item.name}
            rightToggle={
              <Toggle
                onClick={() => this.listItemToggle(item)}
                defaultToggled={item.complete}
              />
            }
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
      </div>
    );
  }
}

ChecklistDisplay.propTypes = {
  match: PropTypes.object,
  user: PropTypes.object
};

export default ChecklistDisplay;
