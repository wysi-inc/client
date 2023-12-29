import { Medal } from "../../../resources/types/medals";

interface Props {
    thisMedal: Medal,
    userMedals: any[];
}

const MedalBadge = (props: Props) => {
    
    const size = 48;
    return (
        <div className="tooltip" data-tip={props.thisMedal.name}>
            <a href={`https://osekai.net/medals/?medal=${props.thisMedal.name}`}
                target={'_blank'} rel="noreferrer"
                className="medal darkenOnHover">
                {props.userMedals.some((medal) => medal.achievement_id === props.thisMedal.medal_id) ?
                    <img src={props.thisMedal.link} alt="medal" loading="lazy" style={{ height: size }} /> :
                    <img src={props.thisMedal.link} alt="medal" loading="lazy" style={{ height: size, filter: "grayscale(40%) brightness(40%)" }} />}
            </a>
        </div>
    );
}
export default MedalBadge;