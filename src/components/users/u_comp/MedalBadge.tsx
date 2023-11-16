import { Medal } from "../../../resources/types/medals";

interface Props {
    medal: Medal,
    achieved: boolean;
}

const MedalBadge = (p: Props) => {
    const size = 48;
    return (
        <div className="tooltip" data-tip={p.medal.name}>
            <a href={`https://osekai.net/medals/?medal=${p.medal.name}`}
                target={'_blank'} rel="noreferrer"
                className="medal darkenOnHover">
                <img src={p.medal.link} alt="medal" loading="lazy" style={{ height: size, filter: `${!p.achieved && 'grayscale(40%) brightness(40%)'}` }} />
            </a>
        </div>
    );
}
export default MedalBadge;