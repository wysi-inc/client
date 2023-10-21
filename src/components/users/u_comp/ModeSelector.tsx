import { Link } from "react-router-dom";
import ModeIcon from "../../scores/s_comp/ModeIcon";
import { GameMode, GameModes } from "../../../resources/types/general";

interface Props {
    mode: GameMode;
    userId: number;
}

const ModeSelector = (props: Props) => {

    return (
        <div className="flex flex-row gap-2 justify-content-around">
            {GameModes.map((mode: GameMode, index: number) =>
                <Link to={`/users/${props.userId}/${mode}`} key={index}>
                    <ModeIcon size={32} mode={mode} color={props.mode === mode ? '#ffffff66' : '#ffffff'} />
                </Link>
            )}
        </div>
    )
}

export default ModeSelector;