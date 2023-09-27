import React from "react"
import { GameModeType } from "../resources/types";
import { Link } from "react-router-dom";
import ModeIcon from "./ModeIcon";

interface ModeSelectorProps {
    mode: GameModeType;
    userId: number;
}

const ModeSelector = (props: ModeSelectorProps) => {

    const modes: GameModeType[] = ['osu', 'taiko', 'fruits', 'mania']
    return (
        <div className="flex flex-row gap-2 justify-content-around">
            {modes.map((mode: GameModeType, index: number) =>
                <Link to={`/users/${props.userId}/${mode}`} key={index}>
                    <ModeIcon size={32} mode={mode} color={props.mode === mode ? '#ffffff66' : '#ffffff'} />
                </Link>
            )}
        </div>
    )
}

export default ModeSelector;