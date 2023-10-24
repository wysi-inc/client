import { useUpdateEffect } from "usehooks-ts";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";

import fina from "../../../../helpers/fina";
import ScoreCard from "../../../scores/ScoreCard";
import Loading from "../../../../web/w_comp/Loading";
import BeatmapsetCard from "../../../beatmaps/BeatmapsetCard";
import { GameMode } from "../../../../resources/types/general";
import { Score, ScoreCategory } from "../../../../resources/types/score";
import { Beatmapset, BeatmapsetCategory } from "../../../../resources/types/beatmapset";

interface Props {
    category: ScoreCategory | BeatmapsetCategory,
    limit: number,
    userId: number,
    section: "scores" | "beatmapsets",
    mode: GameMode,
}

const UserMapsList = (p: Props) => {
    const LIMIT = 15;

    const { ref, inView } = useInView();

    const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
        useInfiniteQuery([p.category, p.mode], ({ pageParam = 0 }) => getMaps(pageParam), {
            getNextPageParam: (lastPage, allPages) => {
                const nextPage = lastPage.length === LIMIT ? allPages.length + 1 : undefined;
                return nextPage;
            },
        });

    useUpdateEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    if (!isSuccess) return <Loading/>;
    if (!data?.pages) return <Loading/>;

    return (<>
        {data.pages.map((page, i) =>
            p.section === "scores" ?
                page.map((score: Score, j: number) =>
                    <ScoreCard key={`${i}${j}`} index={j} score={score} ref={page.length === j + 1 && data.pages.length === i + 1 ? ref : undefined} />
                ) :
                page.map((beatmapset: Beatmapset, j: number) =>
                    <BeatmapsetCard key={`${i}${j}`} index={j} beatmapset={beatmapset} ref={page.length === j + 1 && data.pages.length === i + 1 ? ref : undefined} />
                ))
        }
        {isFetchingNextPage && <Loading />}
    </>);

    function getMaps(page: number) {
        if (p.section === "beatmapsets") {
            return fina.post('/userbeatmaps', {
                id: p.userId,
                limit: LIMIT,
                offset: page * LIMIT,
                type: p.category,
            });
        }
        return fina.post('/userscores', {
            id: p.userId,
            mode: p.mode,
            limit: LIMIT,
            offset: page * LIMIT,
            type: p.category
        });
    }

}

export default UserMapsList;