import { ImHeart } from "react-icons/im"

interface Props {
    size: number;
    level: number;
}

const SupporterIcon = (props: Props) => {
    return (
        <div className="flex flex-row badge badge-primary tooltip" data-tip="osu!supporter">{
            [...Array(props.level)].map((_, i) => <ImHeart key={i} />)
        }</div>
    )
}

export default SupporterIcon;