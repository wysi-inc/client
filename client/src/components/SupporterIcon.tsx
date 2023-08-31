import React from "react";

interface SupporterIconProps {
    size: number;
}

const SupporterIcon = (props: SupporterIconProps) => {
    return (
        <img src={require('../assets/supporter-heart.svg').default} alt="supporter" height={props.size}
             data-tooltip-id="tooltip"
             data-tooltip-content="supporter"/>
    )
}

export default SupporterIcon;