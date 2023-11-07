import { Beatmapset } from "../../../resources/types/beatmapset";
import Loading from "../../../web/w_comp/Loading";
import BeatmapsetCard from "../BeatmapsetCard";

interface Props {
    status: string,
    isSuccess: boolean,
    data: any,
    limit: number,
}


const BeatmapsList = (p: Props) => {

    if (p.status === 'error') return <div></div>;
    if (!p.isSuccess) return <Loading />;
    if (!p.data) return <Loading />;
    if (!p.data?.pages) return <Loading />;
    if (!p.data?.pages[0]) return <Loading />;

    return (
        <>
            {p.data?.pages?.map((page: Beatmapset[], i: number) =>
                page?.map((beatmapset: Beatmapset, j: number) =>
                    <BeatmapsetCard key={(i * p.limit) + j} index={(i * p.limit) + j} beatmapset={beatmapset} />
                ))
            }
        </>)
}

export default BeatmapsList;