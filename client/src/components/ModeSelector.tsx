import React from "react"
import {GameModeType} from "../resources/types";

interface ModeSelectorProps {
    mode: GameModeType;
    userId: number;
}

const ModeSelector = (props: ModeSelectorProps) => {
    function sendTo(mode: GameModeType): void {
        window.location.replace(`/users/${props.userId}/${mode}`);
    }
    const modes: GameModeType[] = ['osu', 'taiko', 'fruits', 'mania']
    return (
        <div className="d-flex flex-row p-2 justify-content-around">
            {modes.map((mode:GameModeType, index: number) =>
                <button className="btn border-0 darkenOnHover" disabled={props.mode === mode}
                        onClick={() => sendTo(mode)} key={index + 1}>
                    <img src={require(`../assets/mode-icons/${mode}.svg`)} alt={mode} style={{height: 28, width: 28}}/>
                </button>
            )}
        </div>
    )
}

export default ModeSelector;