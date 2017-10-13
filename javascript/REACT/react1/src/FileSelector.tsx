/**
 *
 */

import * as React from "react";
import * as ReactDOM from "react-dom";


import * as electron from 'electron';
import {remote} from 'electron';

const dialog = remote.dialog;

interface FileSelectorProps {
    label?: string;
    buttonLabel?: string;
    onChange: any;
}

interface FileSelectorState {
    label: string;
    buttonLabel: string;
    onChange: any;
    fullPath: string;
}

/**
 * Simple hack at a REACT file selector component.
 *
 * @export
 * @class MyFileSelector
 * @extends {React.Component<any, any>}
 */
export class FileSelector extends React.Component<FileSelectorProps,any> {
    public static defaultProps : FileSelectorProps = {
        label: "Select File :",
        buttonLabel: "Press Me",
        onChange: null
    };

    constructor(props:any) {
        super(props);
        this.state = {
            label: this.props.label,
            buttonLabel: this.props.buttonLabel,
            onChange: this.props.onChange,
            fullPath: ""
        };
    }

    handleBrowse() {
        let msgText = "This is a sample message box";
        console.log("handle browse!");
        dialog.showOpenDialog({
            title: "Select File",
            properties: [ "openFile" ]
        }, (filenames : string[]) => {
            console.log(filenames);
            this.setState( { fullPath: filenames[0]} );
            let fileArray = [ filenames[0] ];
            this.state.onChange(fileArray);
        });

        // dialog.showMessageBox(null, {
        //     title: "Super Message",
        //     buttons: [ "OK", "Cancel" ],
        //     message: msgText,
        //     type: "info" });
    }

    render() {
        return <div className="file-selector">
            {this.state.label}&nbsp;
            <input style={{ width: "50%" }} type="text" value={this.state.fullPath} />&nbsp;
            <button onClick={this.handleBrowse.bind(this)}>{ this.state.buttonLabel}</button>
        </div>
    }
}
