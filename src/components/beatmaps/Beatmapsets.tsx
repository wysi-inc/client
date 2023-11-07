import { ChangeEvent, useState } from "react";

import { useDebounce } from "usehooks-ts";

import { BsCheckLg } from "react-icons/bs";
import { BiCopy, BiSolidEraser } from "react-icons/bi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import MultiSlider from "./b_comp/MultiSlider";
import fina from "../../helpers/fina";
import BeatmapsetCard from "./BeatmapsetCard";
import { colors } from "../../resources/global/tools";
import { GameMode, GameModes } from "../../resources/types/general";
import { Beatmapset, BeatmapsetStatus, BeatmapsetStatuses } from "../../resources/types/beatmapset";

import './b_comp/Beatmaps.css';
import { MdExpandMore } from "react-icons/md";
import { useInfiniteQuery } from "react-query";
import Loading from "../../web/w_comp/Loading";
import BeatmapsList from "./b_comp/BeatmapsList";

interface Query {
    title: string,
    mapper: string,
    year: number[],
    bpm: number[],
    sr: number[],
    len: number[],
    ar: number[],
    cs: number[],
    od: number[],
    hp: number[],
    sort: string[],
    modes: GameMode[],
    status: BeatmapsetStatus[],
}

const Beatmapsets = () => {

    const LIMIT = 50;

    const bpmLimit = 300;
    const srLimit = 10;
    const lengthLimit = 600;
    const statLimit = 10;

    const timeMin: number = 2007;
    const timeMax: number = new Date().getFullYear();

    const songSort = ['bpm', 'favourite_count', 'last_updated', 'play_count', 'ranked_date', 'submitted_date', 'beatmaps.total_length'];

    const INITIAL_QUERY: Query = {
        title: '',
        mapper: '',
        year: [timeMin, timeMax],
        bpm: [0, bpmLimit],
        sr: [0, srLimit],
        len: [0, lengthLimit],
        ar: [0, statLimit],
        cs: [0, statLimit],
        od: [0, statLimit],
        hp: [0, statLimit],
        sort: [],
        modes: [],
        status: [],
    }

    const [query, setQuery] = useState(INITIAL_QUERY);

    const [results, setResults] = useState<Beatmapset[]>([])
    const [resultsNum, setResultsNum] = useState<number>(0)

    const [copied, setCopied] = useState<boolean>(false);
    const [cleared, setCleared] = useState<boolean>(false);

    const debounce = useDebounce<Query>(query, 1000);

    const { data, isSuccess, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
        useInfiniteQuery(['beatmaps', debounce], ({ pageParam = 0 }) => getBeatmaps(pageParam), {
            getNextPageParam: (lastPage, allPages) => {
                const nextPage = lastPage.length === LIMIT ? allPages.length : undefined;
                return nextPage;
            }
        });

    return (
        <div className="p-4">
            <div className="flex flex-col gap-3 p-4 mb-3 rounded-lg drop-shadow-lg bg-custom-900">
                <div className="flex flex-row items-center justify-between p-4 text-xl rounded-lg bg-custom-950">
                    <div>Beatmap Search:</div>
                    <div className="flex flex-row items-center gap-2">
                        <div className="h5">{resultsNum.toLocaleString()} results</div>
                        <div className="tooltip" data-tip="Clear">
                            <button className="text-lg btn btn-error"
                                onClick={() => {
                                    setCleared(true);
                                    clearSearch();
                                    setTimeout(() => setCleared(false), 400)
                                }}>
                                {!cleared ? <BiSolidEraser /> : <BsCheckLg />}
                            </button>
                        </div>
                        <div className="tooltip" data-tip="Copy">
                            <button className="text-lg btn btn-success"
                                onClick={() => {
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 400)
                                }}>
                                {!copied ? <BiCopy /> : <BsCheckLg />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4 rounded-lg drop-shadow-lg bg-custom-950">
                    <div className="col-span-4 md:col-span-2 lg:col-span-3">
                        <div className="mb-2 text-center">Title:</div>
                        <input type="text" className="w-full text-center input input-bordered"
                            placeholder="..." autoFocus={true} name="title"
                            value={query.title} onChange={handleChange} />
                    </div>
                    <div className="col-span-4 md:col-span-2 lg:col-span-1">
                        <div className="mb-2 text-center">Mapper:</div>
                        <input type="text" className="w-full text-center input input-bordered"
                            placeholder="..." name="mapper"
                            value={query.mapper} onChange={handleChange} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg bg-custom-950 p-4 pb-6">
                    <div className="flex flex-col gap-2">
                        <MultiSlider
                            min={0}
                            max={srLimit}
                            step={0.5}
                            minValue={query.sr[0]}
                            maxValue={query.sr[1]}
                            onChange={handleSliderChange}
                            title={"Stars"}
                            name={"sr"}
                            CSS_CLASS={"srSlider"}
                            maxTxt={"∞"}
                        />
                        <MultiSlider
                            min={0}
                            max={bpmLimit}
                            step={5}
                            minValue={query.bpm[0]}
                            maxValue={query.bpm[1]}
                            onChange={handleSliderChange}
                            title={"BPM"}
                            name={"bpm"}
                            CSS_CLASS={"bpmSlider"}
                            maxTxt={"∞"}
                        />
                        <MultiSlider
                            min={0}
                            max={lengthLimit}
                            step={15}
                            minValue={query.len[0]}
                            maxValue={query.len[1]}
                            onChange={handleSliderChange}
                            title={"Length"}
                            name={"len"}
                            CSS_CLASS={"lenSlider"}
                            maxTxt={"∞"}
                        />
                        <MultiSlider
                            min={timeMin}
                            max={timeMax}
                            step={1}
                            minValue={query.year[0]}
                            maxValue={query.year[1]}
                            onChange={handleSliderChange}
                            title={"Year"}
                            name={"year"}
                            CSS_CLASS={"yearSlider"}
                            maxTxt={"now"}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <MultiSlider
                            min={0}
                            max={statLimit}
                            step={0.5}
                            minValue={query.ar[0]}
                            maxValue={query.ar[1]}
                            onChange={handleSliderChange}
                            title={"AR"}
                            name={"ar"}
                            CSS_CLASS={"statSlider"}
                        />
                        <MultiSlider
                            min={0}
                            max={statLimit}
                            step={0.5}
                            minValue={query.cs[0]}
                            maxValue={query.cs[1]}
                            onChange={handleSliderChange}
                            title={"CS"}
                            name={"cs"}
                            CSS_CLASS={"statSlider"}
                        />
                        <MultiSlider
                            min={0}
                            max={statLimit}
                            step={0.5}
                            minValue={query.od[0]}
                            maxValue={query.od[1]}
                            onChange={handleSliderChange}
                            title={"OD"}
                            name={"od"}
                            CSS_CLASS={"statSlider"}
                        />
                        <MultiSlider
                            min={0}
                            max={statLimit}
                            step={0.5}
                            minValue={query.hp[0]}
                            maxValue={query.hp[1]}
                            onChange={handleSliderChange}
                            title={"HP"}
                            name={"hp"}
                            CSS_CLASS={"statSlider"}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col col-span-3 gap-4 p-4 rounded-lg drop-shadow-lg md:col-span-1 bg-custom-950">
                        <div>Mode:</div>
                        <div className="flex flex-row flex-wrap gap-3" role="group">
                            {GameModes.map((m: GameMode, i: number) =>
                                <button type="button" key={i}
                                    className={`btn text-black fw-bold  darkenOnHover rounded-lg ${!query.modes.includes(m) && 'fakeDisabled'}`}
                                    onClick={() => handleToggleChange(m, "modes")}
                                    style={{ backgroundColor: (colors.modes as any)[m] }}>
                                    {m.toLowerCase()}
                                </button>)}
                        </div>
                    </div>
                    <div className="flex flex-col col-span-3 gap-4 p-4 rounded-lg drop-shadow-lg md:col-span-2 bg-custom-950">
                        <div>Status:</div>
                        <div className="flex flex-row flex-wrap items-center gap-3" role="group">
                            {BeatmapsetStatuses.map((s: BeatmapsetStatus, i: number) =>
                                <button type="button" key={i}
                                    className={`btn text-black fw-bold  darkenOnHover rounded-lg ${!query.status.includes(s) && 'fakeDisabled'}`}
                                    onClick={() => handleToggleChange(s, "status")}
                                    style={{ backgroundColor: (colors.beatmap as any)[s] }}>
                                    {s.toLowerCase()}
                                </button>)}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 p-4 rounded-lg drop-shadow-lg bg-custom-950">
                    <div>Sort:</div>
                    <div className="flex flex-row flex-wrap gap-3">
                        {songSort.map((sor: string, i: number) =>
                            <button key={i}
                                className={`btn flex flex-row gap-1 accentColor text-black fw-bold darkenOnHover rounded-lg ${query.sort[0]?.split(':')[0] !== sor && 'fakeDisabled'}`}
                                onClick={() => handleToggleSort(sor)}>
                                <div className="text-black">{sor.replace('beatmaps.', '').replace('_', ' ')}</div>
                                {query.sort[0]?.split(':')[0] === sor && query.sort[0]?.split(':')[1] === 'desc' && <FaAngleDown />}
                                {query.sort[0]?.split(':')[0] === sor && query.sort[0]?.split(':')[1] === 'asc' && <FaAngleUp />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <BeatmapsList data={data} isSuccess limit={LIMIT} status={status} />
                <button onClick={() => fetchNextPage()} className="btn btn-success mx-auto btn-sm flex flex-row gap-2">
                    <MdExpandMore />
                    {isFetchingNextPage ? <Loading /> : 'Load More'}
                    <MdExpandMore />
                </button>
            </div>
        </div>
    )

    function clearSearch(): void {
        setQuery(INITIAL_QUERY);
    }

    function getBeatmaps(page: number) {
        const { title, filter, mode, status, sort } = getQuery();
        const offset = page * LIMIT;
        const limit = LIMIT;
        const url = `https://catboy.best/api/v2/search?q=${title}${filter.length > 0 ? `[${filter}]` : ""}${sort.length > 0 ? `&sort=${sort.join("&sort=")}` : ""}&m=${mode.join("&m=")}&status=${status.join("&status=")}&limit=${limit}&offset=${offset}`;
        return fina.nget(url);
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSliderChange(min: number, max: number, name: string) {
        setQuery((prev) => ({ ...prev, [name]: [min, max] }));
    }

    function handleToggleChange(value: string, name: "modes" | "status") {
        let val = '';
        if (name === "modes") val = value as GameMode;
        if (name === "status") val = value as BeatmapsetStatus;
        setQuery((prev) => {
            const currentArray = (prev as any)[name] as any;
            const isValueInArray = currentArray.includes(val);
            let updatedArray;

            if (isValueInArray) {
                updatedArray = currentArray.filter((v: any) => v !== val);
            } else {
                updatedArray = [...currentArray, val];
            }

            return { ...prev, [name]: updatedArray };
        });
    }

    function handleToggleSort(sor: string) {
        const s: any = query.sort[0]?.split(':')[0];
        const o: any = query.sort[0]?.split(':')[1];
        if (s && o) {
            if (s === sor) {
                if (o === 'asc') setQuery((p) => ({ ...p, sort: [] }));
                else setQuery((p) => ({ ...p, sort: [`${sor}:asc`] }));
                return;
            }
        }
        setQuery((p) => ({ ...p, sort: [`${sor}:desc`] }))
    }

    function getQuery(): { title: string, filter: string, mode: number[], status: number[], sort: string[] } {
        let filters: string[] = [];

        if (query.mapper !== '') filters.push(`creator=${query.mapper}`);

        if (query.bpm[0] < bpmLimit) filters.push(`bpm>=${query.bpm[0]}`);
        if (query.bpm[1] < bpmLimit) filters.push(`bpm<=${query.bpm[1]}`);
        if (query.sr[0] < srLimit) filters.push(`beatmaps.difficulty_rating>=${query.sr[0]}`);
        if (query.sr[0] < srLimit) filters.push(`beatmaps.difficulty_rating<=${query.sr[1]}`);
        if (query.len[0] < lengthLimit) filters.push(`beatmaps.total_length>=${query.len[0]}`);
        if (query.len[1] < lengthLimit) filters.push(`beatmaps.total_length<=${query.len[1]}`);

        if (query.ar[0] < statLimit) filters.push(`beatmaps.ar>=${query.ar[0]}`);
        if (query.ar[1] < statLimit) filters.push(`beatmaps.ar<=${query.ar[1]}`);
        if (query.cs[0] < statLimit) filters.push(`beatmaps.cs>=${query.cs[0]}`);
        if (query.cs[1] < statLimit) filters.push(`beatmaps.cs<=${query.cs[1]}`);
        if (query.hp[0] < statLimit) filters.push(`beatmaps.drain>=${query.hp[0]}`);
        if (query.hp[1] < statLimit) filters.push(`beatmaps.drain<=${query.hp[1]}`);
        if (query.od[0] < statLimit) filters.push(`beatmaps.accuracy>=${query.od[0]}`);
        if (query.od[1] < statLimit) filters.push(`beatmaps.accuracy<=${query.od[1]}`);

        if (query.year[0] > timeMin && query.year[0] < timeMax) filters.push(`submitted_date>=${new Date(`${query.year[0]}-01-01`).getTime() / 1000}`)
        if (query.year[1] > timeMin && query.year[1] < timeMax) filters.push(`submitted_date<${new Date(`${query.year[1]}-01-01`).getTime() / 1000}`)


        let mode = [];
        if (query.modes.length > 1) mode = [-1];
        else mode = query.modes.map((m: GameMode) => {
            switch (m) {
                case "osu":
                    return 0;
                case "taiko":
                    return 1
                case "fruits":
                    return 2
                case "mania":
                    return 3
                default:
                    return -1;
            }
        });

        let status = [];

        if (query.status.length < 1) status = [-3];
        else status = query.status.map((s: BeatmapsetStatus) => {
            switch (s) {
                case "ranked":
                    return 1;
                case "approved":
                    return 2
                case "qualified":
                    return 3
                case "loved":
                    return 4
                case "pending":
                    return 0;
                case "wip":
                    return -1;
                case "graveyard":
                    return -2;
                default:
                    return -1;
            }
        });


        return { title: query.title, filter: filters.join(' AND '), mode, status, sort: query.sort };
    }

}

export default Beatmapsets;
