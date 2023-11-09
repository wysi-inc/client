import { useInfiniteQuery } from "react-query";
import fina from "../../../helpers/fina";
import TitleBar from "./TitleBar";
import { useTranslation } from "react-i18next";
import { FaFireAlt } from "react-icons/fa";
import Loading from "../../../web/w_comp/Loading";
import BeatmapCard from "../../beatmaps/BeatmapCard";
import { BeatmapPlays } from "../../../resources/types/beatmapset";
import { MdExpandMore } from "react-icons/md";

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
        <div className={p.className}>
            <TitleBar title={t('user.sections.mostplayed')} icon={<FaFireAlt />} />
            <div className="flex flex-col gap-3 p-3">
                {data.pages.map((page : BeatmapPlays[], i: number) =>
                    page.map((beatmap: BeatmapPlays, j: number) =>
                        <BeatmapCard key={(i * LIMIT) + j} index={(i * LIMIT) + j} beatmap={beatmap}/>
                    ))
                }
                {hasNextPage &&
                <button onClick={() => fetchNextPage()} className="flex flex-row gap-2 mx-auto btn btn-success btn-sm">
                    <MdExpandMore/>
                    {isFetchingNextPage ? <Loading /> : 'Load More' }
                    <MdExpandMore/>
                </button>
            }
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