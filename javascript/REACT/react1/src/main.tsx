/**
 * main.tsx
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {grey900, grey800, grey100, grey200} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';

import { MyComponent } from "./mycomponent";

console.log("main.tsx");

window.onload = () => {
    debugger;
    console.log("window loaded!");

    let muiTheme = getMuiTheme(darkBaseTheme);
    let mainDiv = document.getElementById('work-div');

    ReactDOM.render(
        <MuiThemeProvider muiTheme={muiTheme}>
            <MyComponent appName="Shit Bricks" />
        </MuiThemeProvider>,
        mainDiv
    );
}