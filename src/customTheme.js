import {
  grey500,
  grey700,
  blueGrey100,
  blueGrey300,
  blueGrey400,
  blueGrey500,
  white,
  darkBlack,
  fullBlack
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
  spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: grey500,
    primary2Color: grey700,
    primary3Color: blueGrey400,
    accent1Color: blueGrey500,
    accent2Color: blueGrey100,
    accent3Color: blueGrey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: blueGrey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: grey500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  }
};
