import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

// import './EditChecklist.css';

class EditChecklist extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    axios
      .get(`/api/checklist_templates/${this.props.match.params.id}`)
      .then(res => {
        console.log('res: ', res);
      })
      .catch(console.log);
  }
  render() {
    const listItems =
      (this.state.checklistItems &&
        this.state.checklistItems.sort((a, b) => a.id > b.id).map(item => (
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
        ))) ||
      [];
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

EditChecklist.propTypes = {
  match: PropTypes.object,
  user: PropTypes.object
};

export default EditChecklist;
