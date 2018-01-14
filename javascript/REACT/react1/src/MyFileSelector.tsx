import * as React from "react";
import * as ReactDOM from "react-dom";

interface FileSelectorProps {
    label: string;
    onChange: any;
}

/**
 * Simple hack at a REACT file selector component.
 *
 * @export
 * @class MyFileSelector
 * @extends {React.Component<any, any>}
 */
export class MyFileSelector extends React.Component<any,any> {
    constructor(props:any) {
        super(props);
        this.state = {
            onChange: this.props.onChange
        };
//        this.handleChange = this.handleChange.bind(this);
    }

    // handleChange(selectorFiles:FileList) {
    //     console.log(selectorFiles);
    // }

    render() {
        return <div>
            <input  className="fileSelector" type="file" onChange={ (e) => this.state.onChange(e.target.files)} />
        </div>
    }
}
