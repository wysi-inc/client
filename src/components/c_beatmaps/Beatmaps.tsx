import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useDebounce } from "usehooks-ts";

import { BsCheckLg } from "react-icons/bs";
import { BiCopy, BiSolidEraser } from "react-icons/bi";

import { colors } from "../../resources/global/tools";
import { secondsToTime } from "../../resources/global/functions";
import BeatmapsetPage from "./BeatmapsetPage";
import { BeatmapSet, BeatmapsetStatusType } from "../../resources/interfaces/beatmapset";
import BeatmapsetCard from "./BeatmapsetCard";
import InfiniteScroll from "react-infinite-scroller";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

import MultiRangeSlider from "multi-range-slider-react";

import './b_comp/Beatmaps.css';
import fina from "../../helpers/fina";
import { GameModeType } from "../../resources/interfaces/user";

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
    modes: GameModeType[],
    status: BeatmapsetStatusType[],
}

const BeatmapsPage = () => {
    const { urlSetId } = useParams();
    const { urlDiffId } = useParams();

    const bpmLimit = 300;
    const srLimit = 10;
    const lengthLimit = 600;
    const statLimit = 10;

    const timeMin: number = 2007;
    const timeMax: number = new Date().getFullYear();

    const songModes: GameModeType[] = ["osu", "taiko", "fruits", "mania"];
    const songStatus: BeatmapsetStatusType[] = ['ranked', 'approved', 'qualified', 'loved', 'pending', 'wip', 'graveyard'];

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

    const [results, setResults] = useState<BeatmapSet[]>([])
    const [resultsNum, setResultsNum] = useState<number>(0)

    const [copied, setCopied] = useState<boolean>(false);
    const [cleared, setCleared] = useState<boolean>(false);

    const debouncedValue = useDebounce<Query>(query, 1000);

    useEffect(() => {
        console.log(query)
    }, [query]);

    useEffect((): void => {
        if (urlSetId === undefined) {
            getUrlParams();
            getBeatmaps();
        }
    }, [])

    useEffect(() => {
        if (urlSetId === undefined) {
            getBeatmaps();
        }
    }, [debouncedValue]);


    function clearSearch(): void {
        setQuery(INITIAL_QUERY);
        setTimeout(() => setCleared(false), 400)
    }

    function setURL(): void {
        let url = '';
        if (query.title !== '') url += `title=${query.title}&`;
        if (query.mapper !== '') url += `mapper=${query.mapper}&`;

        url += `bpm0=${query.bpm[0]}&bpm1=${query.bpm[1]}&`;
        url += `sr0=${query.sr[0]}&sr1=${query.sr[1]}&`;
        url += `len0=${query.len[0]}&len1=${query.len[1]}&`;
        url += `year0=${query.year[0]}&year1=${query.year[1]}&`;

        url += `ar0=${query.ar[0]}&ar1=${query.ar[1]}&`;
        url += `cs0=${query.cs[0]}&cs1=${query.cs[1]}&`;
        url += `hp0=${query.hp[0]}&hp1=${query.hp[1]}&`;
        url += `od0=${query.od[0]}&od1=${query.od[1]}&`;

        url += `sort=${query.sort}&`;
        for (let i = 0; i < query.status.length; i++) {
            url += `status=${query.status[i]}&`
        }
        for (let i = 0; i < query.modes.length; i++) {
            url += `modes=${query.modes[i]}&`
        }
        navigator.clipboard.writeText(`${window.location.host}/beatmaps?${url}`);
        setTimeout(() => setCopied(false), 400)
    }

    function getQuery(): { q: string, f: string } {
        let f: string[] = [];

        if (query.mapper !== '') f.push(`creator=${query.mapper}`);

        if (query.bpm[0] < bpmLimit) f.push(`bpm>=${query.bpm[0]}`);
        if (query.bpm[1] < bpmLimit) f.push(`bpm<=${query.bpm[1]}`);
        if (query.sr[0] < srLimit) f.push(`beatmaps.difficulty_rating>=${query.sr[0]}`);
        if (query.sr[0] < srLimit) f.push(`beatmaps.difficulty_rating<=${query.sr[1]}`);
        if (query.len[0] < lengthLimit) f.push(`beatmaps.total_length>=${query.len[0]}`);
        if (query.len[1] < lengthLimit) f.push(`beatmaps.total_length<=${query.len[1]}`);

        if (query.ar[0] < statLimit) f.push(`beatmaps.ar>=${query.ar[0]}`);
        if (query.ar[1] < statLimit) f.push(`beatmaps.ar<=${query.ar[1]}`);
        if (query.cs[0] < statLimit) f.push(`beatmaps.cs>=${query.cs[0]}`);
        if (query.cs[1] < statLimit) f.push(`beatmaps.cs<=${query.cs[1]}`);
        if (query.hp[0] < statLimit) f.push(`beatmaps.drain>=${query.hp[0]}`);
        if (query.hp[1] < statLimit) f.push(`beatmaps.drain<=${query.hp[1]}`);
        if (query.od[0] < statLimit) f.push(`beatmaps.accuracy>=${query.od[0]}`);
        if (query.od[1] < statLimit) f.push(`beatmaps.accuracy<=${query.od[1]}`);

        if (query.year[0] > timeMin && query.year[0] < timeMax) f.push(`submitted_date>=${new Date(`${query.year[0]}-01-01`).getTime() / 1000}`)
        if (query.year[1] > timeMin && query.year[1] < timeMax) f.push(`submitted_date<${new Date(`${query.year[1]}-01-01`).getTime() / 1000}`)

        const filters: string = f.join(' AND ')
        return { q: query.title, f: filters };
    }

    function getUrlParams() {
        // const queryParameters = new URLSearchParams(window.location.search)
        // const urlTitle = queryParameters.get('title');
        // const urlMapper = queryParameters.get('mapper');
        // const urlBPM0 = queryParameters.get('bpm0');
        // const urlBPM1 = queryParameters.get('bpm1');
        // const urlSR0 = queryParameters.get('sr0');
        // const urlSR1 = queryParameters.get('sr1');
        // const urlLen0 = queryParameters.get('len0');
        // const urlLen1 = queryParameters.get('len1');
        // const urlAR0 = queryParameters.get('ar0');
        // const urlAR1 = queryParameters.get('ar1');
        // const urlCS0 = queryParameters.get('cs0');
        // const urlCS1 = queryParameters.get('cs1');
        // const urlHP0 = queryParameters.get('hp0');
        // const urlHP1 = queryParameters.get('hp1');
        // const urlOD0 = queryParameters.get('od0');
        // const urlOD1 = queryParameters.get('od1');
        // const urlYear0 = queryParameters.get('year0');
        // const urlYear1 = queryParameters.get('year1');
        // const urlModes = queryParameters.getAll('modes');
    }

    async function getBeatmaps() {
        setResultsNum(0);
        setResults([])
        try {
            const d = await fina.post('/beatmapsets', {
                query: getQuery().q,
                filter: getQuery().f,
                mode: query.modes.length < 1 ? [-1] : query.modes.map((m: GameModeType) => m === 'osu' ? 0 : m === 'taiko' ? 1 : m === 'fruits' ? 2 : m === "mania" ? 3 : -1),
                status: query.status.length < 1 ? [-3] : query.status.map((m: BeatmapsetStatusType) => m === 'ranked' ? 1 : m === 'approved' ? 2 : m === 'qualified' ? 3 : m === "loved" ? 4 : m === "pending" ? 0 : m === "wip" ? -1 : m === "graveyard" ? -2 : -3),
                limit: 50,
                offset: 0,
                sort: query.sort,
            });
            setResultsNum(parseInt(d.total))
            setResults(d.results)
        } catch (err) {
            console.error(err);
        }
    }

    async function getMoreBeatmaps(limit: number, offset: number) {
        try {
            const d = await fina.post('/beatmapsets', {
                query: getQuery().q,
                filter: getQuery().f,
                mode: query.modes.length < 1 ? [-1] : query.modes.map((m: GameModeType) => m === 'osu' ? 0 : m === 'taiko' ? 1 : m === 'fruits' ? 2 : m === "mania" ? 3 : -1),
                status: query.status.length < 1 ? [-3] : query.status.map((m: BeatmapsetStatusType) => m === 'ranked' ? 1 : m === 'approved' ? 2 : m === 'qualified' ? 3 : m === "loved" ? 4 : m === "pending" ? 0 : m === "wip" ? -1 : m === "graveyard" ? -2 : -3),
                limit: limit,
                offset: offset,
                sort: query.sort,
            });
            setResultsNum(parseInt(d.total))
            setResults([...results, ...d.results])
        } catch (err) {
            console.error(err);
        }
    }

    if (urlSetId) return (<BeatmapsetPage setId={parseInt(urlSetId)} diffId={parseInt(urlDiffId ? urlDiffId : "")} />);

    return (
        <div className="p-4">
            <div className="flex flex-col gap-3 p-4 mb-3 rounded-lg drop-shadow-lg bg-custom-900">
                <div className="flex flex-row justify-between items-center p-4 text-xl rounded-lg bg-custom-950">
                    <div>Beatmap Search:</div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="h5">{resultsNum.toLocaleString()} results</div>
                        <div className="tooltip" data-tip="Clear">
                            <button className="text-lg btn btn-error"
                                onClick={() => {
                                    setCleared(true);
                                    clearSearch();
                                }}>
                                {!cleared ? <BiSolidEraser /> : <BsCheckLg />}
                            </button>
                        </div>
                        <div className="tooltip" data-tip="Copy">
                            <button className="text-lg btn btn-success"
                                onClick={() => {
                                    setCopied(true);
                                    setURL();
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
                            placeholder="..." autoFocus={true}
                            value={query.title} onChange={(e) => setQuery((p) => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div className="col-span-4 md:col-span-2 lg:col-span-1">
                        <div className="mb-2 text-center">Mapper:</div>
                        <input type="text" className="w-full text-center input input-bordered"
                            placeholder="..."
                            value={query.mapper} onChange={(e) => setQuery((p) => ({ ...p, mapper: e.target.value }))} />
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-4 rounded-lg drop-shadow-lg bg-custom-950">
                    <div className="grid grid-cols-7">
                        <div className="col-span-7 md:col-start-3 md:col-span-3">
                            <div className="text-center">Year:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{query.year[0] < timeMax ? query.year[0] : 'now'}</div>
                                <MultiRangeSlider
                                    className="grow yearSlider"
                                    min={timeMin}
                                    max={timeMax}
                                    step={1}
                                    stepOnly={true}
                                    ruler={false}
                                    label={false}
                                    minValue={query.year[0]}
                                    maxValue={query.year[1]}
                                    onChange={(e) => {
                                        setQuery((p) => ({ ...p, year: [e.minValue, e.maxValue] }));
                                    }}
                                />
                                <div className="w-20 text-start">{query.year[1] < timeMax ? query.year[1] : 'now'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-4">
                            <div className="text-center">BPM:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{query.bpm[0] < bpmLimit ? query.bpm[0] : '∞'}</div>
                                <MultiRangeSlider
                                    className="grow bpmSlider"
                                    min={0}
                                    max={bpmLimit}
                                    step={5}
                                    stepOnly={true}
                                    ruler={false}
                                    label={false}
                                    minValue={query.bpm[0]}
                                    maxValue={query.bpm[1]}
                                    onChange={(e) => {
                                        setQuery((p) => ({ ...p, bpm: [e.minValue, e.maxValue] }));
                                    }}
                                />
                                <div className="w-20 text-start">{query.bpm[1] < bpmLimit ? query.bpm[1] : '∞'}</div>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <div className="text-center">Stars:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{query.sr[0] < srLimit ? query.sr[0] : '∞'}</div>
                                <MultiRangeSlider
                                    className="grow srSlider"
                                    min={0}
                                    max={srLimit}
                                    step={0.5}
                                    stepOnly={true}
                                    ruler={false}
                                    label={false}
                                    minValue={query.sr[0]}
                                    maxValue={query.sr[1]}
                                    onChange={(e) => {
                                        setQuery((p) => ({ ...p, sr: [e.minValue, e.maxValue] }));
                                    }}
                                />
                                <div className="w-20 text-start">{query.sr[1] < srLimit ? query.sr[1] : '∞'}</div>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <div className="text-center">Length:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{query.len[0] < lengthLimit ? secondsToTime(query.len[0]) : '∞'}</div>
                                <MultiRangeSlider
                                    className="grow lenSlider"
                                    min={0}
                                    max={lengthLimit}
                                    step={15}
                                    stepOnly={true}
                                    ruler={false}
                                    label={false}
                                    minValue={query.len[0]}
                                    maxValue={query.len[1]}
                                    onChange={(e) => {
                                        setQuery((p) => ({ ...p, len: [e.minValue, e.maxValue] }));
                                    }}
                                />
                                <div className="w-20 text-start">{query.len[1] < lengthLimit ? secondsToTime(query.len[1]) : '∞'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-3">
                            <div className="text-center">AR:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{query.ar[0]}</div>
                                <MultiRangeSlider
                                    className="grow statSlider"
                                    min={0}
                                    max={statLimit}
                                    step={0.5}
                                    stepOnly={true}
                                    ruler={false}
                                    label={false}
                                    minValue={query.ar[0]}
                                    maxValue={query.ar[1]}
                                    onChange={(e) => {
                                        setQuery((p) => ({ ...p, ar: [e.minValue, e.maxValue] }));
                                    }}
                                />
                                <div className="w-20 text-start">{query.ar[1]}</div>
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                            <div className="text-center">CS:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{query.cs[0]}</div>
                                <MultiRangeSlider
                                    className="grow statSlider"
                                    min={0}
                                    max={statLimit}
                                    step={0.5}
                                    stepOnly={true}
                                    ruler={false}
                                    label={false}
                                    minValue={query.cs[0]}
                                    maxValue={query.cs[1]}
                                    onChange={(e) => {
                                        setQuery((p) => ({ ...p, cs: [e.minValue, e.maxValue] }));
                                    }}
                                />
                                <div className="w-20 text-start">{query.cs[1]}</div>
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                            <div className="text-center">OD:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{query.od[0]}</div>
                                <MultiRangeSlider
                                    className="grow statSlider"
                                    min={0}
                                    max={statLimit}
                                    step={0.5}
                                    stepOnly={true}
                                    ruler={false}
                                    label={false}
                                    minValue={query.od[0]}
                                    maxValue={query.od[1]}
                                    onChange={(e) => {
                                        setQuery((p) => ({ ...p, od: [e.minValue, e.maxValue] }));
                                    }}
                                />
                                <div className="w-20 text-start">{query.od[1]}</div>
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                            <div className="text-center">HP:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{query.hp[0]}</div>
                                <MultiRangeSlider
                                    className="grow statSlider"
                                    min={0}
                                    max={statLimit}
                                    step={0.5}
                                    stepOnly={true}
                                    ruler={false}
                                    label={false}
                                    minValue={query.hp[0]}
                                    maxValue={query.hp[1]}
                                    onChange={(e) => {
                                        setQuery((p) => ({ ...p, hp: [e.minValue, e.maxValue] }));
                                    }}
                                />
                                <div className="w-20 text-start">{query.hp[1]}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col col-span-3 gap-4 p-4 rounded-lg drop-shadow-lg md:col-span-1 bg-custom-950">
                        <div>Mode:</div>
                        <div className="flex flex-row flex-wrap gap-3" role="group">
                            {songModes.map((m: GameModeType, i: number) =>
                                <button type="button" key={i}
                                    className={`btn text-black fw-bold  darkenOnHover rounded-lg ${!query.modes.includes(m) && 'fakeDisabled'}`}
                                    onClick={() =>
                                        setQuery((p) => ({ ...p, modes: p.modes.includes(m) ? p.modes.filter(v => v !== m) : [...p.modes, m] }))
                                    }
                                    style={{ backgroundColor: (colors.modes as any)[m] }}>
                                    {m.toLowerCase()}
                                </button>)}
                        </div>
                    </div>
                    <div className="flex flex-col col-span-3 gap-4 p-4 rounded-lg drop-shadow-lg md:col-span-2 bg-custom-950">
                        <div>Status:</div>
                        <div className="flex flex-row flex-wrap gap-3 items-center" role="group">
                            {songStatus.map((s: BeatmapsetStatusType, i: number) =>
                                <button type="button" key={i}
                                    className={`btn text-black fw-bold  darkenOnHover rounded-lg ${!query.status.includes(s) && 'fakeDisabled'}`}
                                    onClick={() =>
                                        setQuery((p) => ({ ...p, status: p.status.includes(s) ? p.status.filter(v => v !== s) : [...p.status, s] }))
                                    }
                                    style={{ backgroundColor: (colors.beatmap as any)[s] }}>
                                    {s.toLowerCase()}
                                </button>)}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 p-4 rounded-lg drop-shadow-lg bg-custom-950">
                    <div>Sort:</div>
                    <div className="flex flex-row flex-wrap gap-3">
                        {songSort.map((sor, i: number) =>
                            <button key={i}
                                className={`btn flex flex-row gap-1 accentColor text-black fw-bold darkenOnHover rounded-lg ${query.sort[0]?.split(':')[0] !== sor && 'fakeDisabled'}`}
                                onClick={() => {
                                    const s: any = query.sort[0]?.split(':')[0];
                                    const o: any = query.sort[0]?.split(':')[1];
                                    if (s && o) {
                                        if (s === sor) {
                                            if (o === 'asc') setQuery((p) => ({ ...p, sort: [] }));
                                            else setQuery((p) => ({ ...p, sort: [`${sor}:asc`] }));
                                            return;
                                        }
                                    }
                                    setQuery((p) => ({ ...p, sort: [`${sor}:desc`] }));
                                }}>
                                <div className="text-black">{sor.replace('beatmaps.', '').replace('_', ' ')}</div>
                                {query.sort[0]?.split(':')[0] === sor && query.sort[0]?.split(':')[1] === 'desc' && <FaAngleDown />}
                                {query.sort[0]?.split(':')[0] === sor && query.sort[0]?.split(':')[1] === 'asc' && <FaAngleUp />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ height: 1000 }} className="overflow-x-hidden overflow-y-scroll">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => getMoreBeatmaps(15, results.length)}
                    hasMore={results.length < resultsNum}
                    loader={<div key={0} className="loading loading-dots loading-md"></div>}
                    useWindow={false}
                >
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {results.map((b: BeatmapSet, i: number) =>
                            <BeatmapsetCard key={i} index={i} beatmapset={b} />
                        )}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    )

}

export default BeatmapsPage;
