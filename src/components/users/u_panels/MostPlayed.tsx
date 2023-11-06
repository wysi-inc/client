import { useInfiniteQuery } from "react-query";
import fina from "../../../helpers/fina";
import TitleBar from "./TitleBar";
import { useTranslation } from "react-i18next";
import { FaFireAlt } from "react-icons/fa";
import Loading from "../../../web/w_comp/Loading";
import { BeatmapPlays } from "../../../resources/types/beatmapset";

interface Props {
    userId: number,
    heigth: number,
    className: string,
}

const MostPlayed = (p: Props) => {

    const LIMIT = 15;

    const { t } = useTranslation();

    const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
        useInfiniteQuery([`mostplayed`, p.userId], ({ pageParam = 0 }) => getMostplayed(pageParam), {
            getNextPageParam: (lastPage, allPages) => {
                const nextPage = lastPage.length === LIMIT ? allPages.length + 1 : undefined;
                return nextPage;
            },
        });

    console.log("mostPlayed", data);

    if (!isSuccess) return <Loading />;
    if (!data?.pages) return <Loading />;

    return (
        <div className={p.className} style={{ height: p.heigth }}>
            <TitleBar title={t('user.sections.mostplayed')} icon={<FaFireAlt />} />
            <div className="flex flex-col overflow-y-scroll">
                {data.pages.map((page) =>
                    page.map((beatmap: BeatmapPlays, j: number) =>
                        <div key={j}>{beatmap.beatmapset.title}</div>
                    ))
                }
                {isFetchingNextPage && <Loading />}
                {hasNextPage && <button className="btn btn-secondary" onClick={() => fetchNextPage()}>More</button>}
            </div>
        </div>)

    function getMostplayed(page: number) {
        return fina.post(`/user/mostplayed`, {
            id: p.userId,
            limit: LIMIT,
            offset: page * LIMIT,
        });
    }
}

export default MostPlayed;