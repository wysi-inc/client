import { Medal } from "../../../resources/types/medals";

interface Props {
    thisMedal: Medal,
    userMedals: any[];
}

const MedalBadge = (props: Props) => {
    
    const size = 48;
    return (
        <div className="tooltip" data-tip={props.thisMedal.Name}>
            <a href={`https://osekai.net/medals/?medal=${props.thisMedal.Name}`}
                target={'_blank'} rel="noreferrer"
                className="medal darkenOnHover">
                {props.userMedals.some((medal) => medal.achievement_id === parseInt(props.thisMedal.MedalID)) ?
                    <img src={props.thisMedal.Link} alt="medal" loading="lazy" style={{ height: size }} /> :
                    <img src={props.thisMedal.Link} alt="medal" loading="lazy" style={{ height: size, filter: "grayscale(40%) brightness(40%)" }} />}
            </a>
        </div>
    );
}
export default MedalBadge;