import React from "react";

interface OnlineDotInterface {
    isOnline: boolean;
    size: number;
}

const OnlineDot = (props: OnlineDotInterface) => {
    return (
        <div style=
                 {{
                     height: props.size,
                     width: props.size,
                     borderRadius: props.size,
                     borderColor: props.isOnline ? '#45d845' : '#d84545',
                     borderWidth: props.size / 7,
                     borderStyle: "solid"
                 }}
             data-tooltip-id="tooltip"
             data-tooltip-content={props.isOnline ? 'Online' : 'Offline'}></div>
    )
}

export default OnlineDot;