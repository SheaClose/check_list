import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';

class Home extends Component {
  render() {
    const { checklists = [] } = this.props;

    const checkLists = checklists.map(checkList => (
      <Card
        zDepth={4}
        className="paperStyle"
        onClick={e =>
          e.target.localName !== 'svg' && e.target.localName !== 'path'
            ? this.props.goTo(`/checklist/${checkList.id}`)
            : null
        }
        key={checkList.id}
      >
        <CardHeader
          textStyle={{ paddingRight: 0 }}
          title={checkList.name}
          actAsExpander={true}
        />
        <CardText>{checkList.desc}</CardText>
      </Card>
    ));
    return <div>{checkLists}</div>;
  }
}

Home.propTypes = {
  checklists: PropTypes.array,
  goTo: PropTypes.func
};

export default Home;
