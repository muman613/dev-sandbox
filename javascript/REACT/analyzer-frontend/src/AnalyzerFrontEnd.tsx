import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {grey900, grey800, grey100, grey200} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import { FileSelector } from './FileSelector';
//import { Select } from 'react-select';
//import 'react-select/dist/react-select.css';

const Select = require('react-select');

export class AnalyzerFrontEnd extends React.Component {
    private options = [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ];
    state = {
        value: 1,
      };

    logChange(val : any) {
        console.log("Selected: " + JSON.stringify(val));
    }

    fileChanged(fileArray: Array<string>) {
        console.log("File changed")
        console.log(fileArray[0]);
    }

    onOkClick(event: object) {
        console.log('Ok clicked');
        console.log(event);
    }

    onNotOkClick(event: object) {
        console.log('Not Ok clicked');
        console.log(event);
    }

    onTextChange(event: object, newValue : string) {
        console.log("text = " + newValue);
    }

    handleChange = (event, index, value) => this.setState({value});

    constructor(props: any) {
        super();
        console.log('AnalyzerFrontEnd constructed!');
    }

    render() {
        const style = {
            margin: 12,
        }
        console.log('AnalyzerFrontEnd Render()')

        return(
            <div className='analyzerFrontEnd'>
                <AppBar
                    title='Sigma AVS2 Analyzer V1.0'
                    showMenuIconButton={false}
                    /* onTitleTouchTap={this.handleAppBar} */
                />
                <div style={style}>
                    <RaisedButton style={style} label="OK" onClick={ this.onOkClick.bind(this) }/>
                    <RaisedButton style={style} label="Not OK" onClick={ this.onNotOkClick.bind(this) }/>
                    <br />
                    <br />
                    <RaisedButton label="Full Width" fullWidth={true} />
                </div>
                <Divider />
                <TextField
                    hintText="Enter your name"
                    onChange={ this.onTextChange.bind(this) }
                />
                <Divider />
                <SelectField
                    floatingLabelText="Frequency"
                    value={this.state.value}
                    onChange={this.handleChange}
                    >
                    <MenuItem value={1} primaryText="Never" />
                    <MenuItem value={2} primaryText="Every Night" />
                    <MenuItem value={3} primaryText="Weeknights" />
                    <MenuItem value={4} primaryText="Weekends" />
                    <MenuItem value={5} primaryText="Weekly" />
                </SelectField>
            </div>
        )
    }
}

// <div>
// <Select
//     name="form-field-name"
//     value="one"
//     options={this.options}
//     />
// </div>
                //  <AppBar
                //     title='Sigma AVS2 Analyzer V1.0'
                //     showMenuIconButton={true}
                //     /* onTitleTouchTap={this.handleAppBar} */
                //     />
                //     <FileSelector
                //         label="Media Stream :"
                //         buttonLabel="Browse"
                //         onChange={this.fileChanged.bind(this)}
                //     />

