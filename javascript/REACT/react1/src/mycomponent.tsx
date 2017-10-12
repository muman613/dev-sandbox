import * as React from "react";
import * as ReactDOM from "react-dom";

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';



export class MyComponent extends React.Component {
    constructor() {
        super();
    }

    handleAppBar() : void {
        console.log("App bar clicked!");
    }

    handleOkButton(event : object) : void {
        console.log("handleOkButton() " + event);
    }

    render() {
        return <div>
                <AppBar
                    title="My AppBar"
                    showMenuIconButton={false}
                    onTitleTouchTap={this.handleAppBar}
                />
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Column 1</TableHeaderColumn>
                            <TableHeaderColumn>Column 1</TableHeaderColumn>
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
                <RaisedButton
                    label="OK"
                    style={ { margin : 12 } }
                    onClick={this.handleOkButton}
                />
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
