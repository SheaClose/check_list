import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <MuiThemeProvider
    muiTheme={getMuiTheme(baseTheme, {
      palette: {
        primary1Color: '#4db6ac',
        primary2Color: '#009688',
        accent1Color: '#18ffff',
        accent2Color: '#607d8b',
        accent3Color: '#b0bec5',
        borderColor: 'rgba(255, 255, 255, 0.54)',
        canvasColor: '#37474f'
      }
    })}
  >
    <Router>
      <App />
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
