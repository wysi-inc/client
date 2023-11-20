import { useQuery } from "react-query";
import fina from "../../../helpers/fina";
import { Score } from "../../../resources/types/score";
import Loading from "../../../web/w_comp/Loading";
import BeatmapsetScoreCard from "../BeatmapsetScoreCard";

interface Props {
    setId: number,
    diffId: number,
}

const BeatmapLeaderboards = (p: Props) => {
    const { data: leaderboards, status: leaderboardsStatus } = useQuery<Score[]>({
        queryKey: ['leaderboards', p.setId, p.diffId],
        queryFn: () => getLeaderboards(p.diffId),
        initialData: [],
        onSuccess: (data) => console.log(data),
    });

    if (leaderboardsStatus === 'loading') return <Loading />;
    if (leaderboardsStatus === 'error') return <div>There was an error</div>;
    if (!leaderboards) return <></>;
    if (leaderboards.length < 1) return <></>;

    return (<>{
        leaderboards?.map((s: Score, i: number) =>
            <BeatmapsetScoreCard key={s.id} score={s} index={i + 1} />
        )
    }</>)

    async function getLeaderboards(id: number) {
        const mode = 'osu';
        return fina.post('/beatmap/scores', { id, mode, });
    }
}

export default BeatmapLeaderboards;