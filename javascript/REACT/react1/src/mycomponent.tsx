import * as React from "react";
import * as ReactDOM from "react-dom";

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import Files from 'react-files';
import { MyFileSelector } from "./MyFileSelector";
import { FileSelector } from "./FileSelector";

interface MyComponentProps {
    appName: string;
}

interface MyComponentState {
    appName: string;
    srcFile: string;
}
export class MyComponent extends React.Component<MyComponentProps,MyComponentState> {
//    srcFile: string;

    constructor(props: MyComponentProps) {
        super(props);

        this.state = {
             appName: this.props.appName,
             srcFile: ''
        };
    }

    handleAppBar() : void {
        console.log("App bar clicked!");
    }

    handleOkButton(event : object) : void {
        console.log("handleOkButton()");
        alert("User hit OK button");
    }

    fileChanged(selectedFiles: any) {
        if (selectedFiles.length > 0) {
            let filePath = selectedFiles[0];

            console.log(filePath);
            alert("File changed " + filePath);

            this.setState( { srcFile: filePath });
        }
    }

    render() {
        return <div>
                <AppBar
                    title={this.state.appName}
                    showMenuIconButton={false}
                    onTitleTouchTap={this.handleAppBar}
                />
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Abbreviation</TableHeaderColumn>
                            <TableHeaderColumn>Description</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow>
                            <TableRowColumn>AV1</TableRowColumn>
                            <TableRowColumn>Uses AV1 Codec for decoding</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>AVS2</TableRowColumn>
                            <TableRowColumn>Uses AVS2 Codec for decoding</TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
                <Divider />
                <MyFileSelector
                    onChange={this.fileChanged.bind(this)}
                />
                <Divider />
                <FileSelector
                    label="Select Microcode file :"
                    buttonLabel="OK"
                    onChange={this.fileChanged.bind(this)}
                />
                <Divider />
                <Files
                    multiple={false}
                    accepts={ [ 'text/plain' ] }
                    className="fileSelector"
                    onChange={this.fileChanged.bind(this)}
                    clickable={true}>
                    Drop or select file
                </Files>
        </div>
    }
}

// <AppBar
// title="My AppBar"
// showMenuIconButton={false}
// onTitleTouchTap={handleAppBar}
// />
// <RaisedButton
// label="OK"
// style={ { margin : 12 } }
// onClick={handleOkButton}
// /> );
