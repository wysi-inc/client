import React from "react";
interface ModIconProps {
    acronym: string;
    size: number;
}
const ModIcon = (props: ModIconProps) => {
    return (
        <img height={props.size}
             src={require(`../assets/mod-icons/${props.acronym.toLowerCase()}.png`)}
             alt={props.acronym}
             data-tooltip-id="tooltip"
             data-tooltip-content={props.acronym}/>
    )
}
export default ModIcon;