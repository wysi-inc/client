import { useInfiniteQuery } from "react-query";

import fina from "../../../../helpers/fina";
import ScoreCard from "../../../scores/ScoreCard";
import Loading from "../../../../web/w_comp/Loading";
import BeatmapsetCard from "../../../beatmaps/BeatmapsetCard";
import { GameMode } from "../../../../resources/types/general";
import { Score, ScoreCategory } from "../../../../resources/types/score";
import { Beatmapset, BeatmapsetCategory } from "../../../../resources/types/beatmapset";
import { MdExpandMore } from "react-icons/md";

interface Props {
    category: ScoreCategory | BeatmapsetCategory,
    limit: number,
    userId: number,
    section: "scores" | "beatmapsets",
    mode: GameMode,
}

const UserMapsList = (p: Props) => {
    const LIMIT = 15;

    const { data, isSuccess, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
        useInfiniteQuery([`${p.category}Data`, p.userId, p.mode], ({ pageParam = 0 }) => getMaps(pageParam), {
            getNextPageParam: (lastPage, allPages) => {
                const nextPage = lastPage.length === LIMIT ? allPages.length : undefined;
                return nextPage;
            }
        });

    if (status === 'error') return <div></div>;
    if (!isSuccess) return <Loading />;
    if (!data) return <Loading/>;
    if (!data?.pages) return <Loading />;
    if (data?.pages[0].length < 1) return <Loading/>;

    return (
        <div className="flex flex-col gap-4 p-3">
            {data?.pages?.map((page, i) =>
                p.section === "scores" ?
                    page?.map((score: Score, j: number) =>
                        <ScoreCard key={(i * LIMIT) + j} index={(i * LIMIT) + j} score={score} />
                    ) :
                    page?.map((beatmapset: Beatmapset, j: number) =>
                        <BeatmapsetCard key={(i * LIMIT) + j} index={(i * LIMIT) + j} beatmapset={beatmapset} />
                    ))
            }
            {hasNextPage &&
                <button onClick={() => fetchNextPage()} className="btn btn-success mx-auto btn-sm flex flex-row gap-2">
                    <MdExpandMore/>
                    {isFetchingNextPage ? <Loading /> : 'Load More' }
                    <MdExpandMore/>
                </button>
            }
            
        </div>
    );

    function getMaps(page: number) {
        return fina.post(`/user/${p.section}`, {
            id: p.userId,
            mode: p.mode,
            limit: LIMIT,
            offset: page * LIMIT,
            type: p.category,
        });
    }

}

export default UserMapsList;