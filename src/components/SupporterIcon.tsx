import React from "react";
import {ImHeart} from "react-icons/im"

interface SupporterIconProps {
    size: number;
    level: number;
}

const SupporterIcon = (props: SupporterIconProps) => {
    return (
        <div className="badge badge-primary">{
            [...Array(props.level)].map((_, i) => <ImHeart key={i}/>)
        }</div>
    )
}

export default SupporterIcon;