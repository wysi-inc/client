import { colors } from "../../resources/global/tools";
import ModIcon from "../c_scores/s_comp/ModIcon";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import CountryFlag from "../c_users/u_comp/CountryFlag";
import { Score } from "../../resources/interfaces/score";
import { addDefaultSrc } from "../../resources/global/functions";

interface ScoreProps {
    index: number;
    score: Score;
}

const BeatmapsetScoreCard = (props: ScoreProps) => {
    return (
        <tr className="bg-custom-800">
            <th className="text-end">#{props.index}</th>
            <td>
                <div className="flex justify-center items-center">
                    <CountryFlag size={24} name={props.score.user.country.name} code={props.score.user.country.code} />
                </div>
            </td>
            <td>
                <Link to={`/users/${props.score.user.id}`} className="flex flex-row gap-2 items-center">
                    <img className="rounded-md" src={props.score.user.avatar_url} style={{ height: 24, width: 24 }} onError={addDefaultSrc} alt="pfp" />
                    {props.score.user.username}
                </Link>
            </td>
            <td>{props.score.score.toLocaleString()}</td>
            <td>{props.score.pp ? Math.round(parseInt(props.score.pp)).toLocaleString() : 0}pp</td>
            <td>{props.score.max_combo}x</td>
            <td>{(props.score.accuracy * 100).toFixed(2)}%</td>
            <td><div className="flex flex-row gap-4">
                {props.score.mode !== 'osu' && props.score.statistics.count_geki !== 0 &&
                    <div style={{ color: colors.judgements.x320 }}>
                        {props.score.statistics.count_geki}
                    </div>}
                {props.score.statistics.count_300 !== 0 &&
                    <div style={{ color: colors.judgements.x300 }}>
                        {props.score.statistics.count_300}
                    </div>}
                {props.score.mode !== 'osu' && props.score.statistics.count_katu !== 0 &&
                    <div style={{ color: colors.judgements.x200 }}>
                        {props.score.statistics.count_katu}
                    </div>}
                {props.score.statistics.count_100 !== 0 &&
                    <div style={{ color: colors.judgements.x100 }}>
                        {props.score.statistics.count_100}
                    </div>}
                {props.score.statistics.count_50 !== 0 &&
                    <div style={{ color: colors.judgements.x50 }}>
                        {props.score.statistics.count_50}
                    </div>}
                {props.score.statistics.count_miss !== 0 &&
                    <div style={{ color: colors.judgements.xMiss }}>
                        {props.score.statistics.count_miss}
                    </div>}
            </div></td>
            <td><div style={{
                color: (colors.ranks as any)[props.score.rank.toLowerCase()]
            }} className="font-semibold">
                {props.score.rank}
            </div></td>
            <td><div className="flex flex-row col-span-3 gap-1">
                {props.score.mods?.map((mod: string, index: number) =>
                    <ModIcon acronym={mod} size={24} key={index} />
                )}
            </div></td>
            <td><div className="col-span-2 tooltip"
                data-tip={moment(props.score.created_at).format('DD/MM/YYYY')}>
                {moment(props.score.created_at).fromNow()}
            </div></td>
        </tr>
    );
}



export default BeatmapsetScoreCard;