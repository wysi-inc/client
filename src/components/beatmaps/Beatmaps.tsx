import { ChangeEvent, useEffect, useState } from "react";

import { useDebounce } from "usehooks-ts";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";

import { BsCheckLg } from "react-icons/bs";
import { BiCopy, BiSolidEraser } from "react-icons/bi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import MultiSlider from "./b_comp/MultiSlider";
import fina from "../../helpers/fina";
import BeatmapsetPage from "./BeatmapsetPage";
import BeatmapsetCard from "./BeatmapsetCard";
import { colors } from "../../resources/global/tools";
import { GameMode, GameModes } from "../../resources/types/general";
import { Beatmapset, BeatmapsetStatus, BeatmapsetStatuses } from "../../resources/types/beatmapset";

import './b_comp/Beatmaps.css';

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

const BeatmapsPage = () => {
    const { urlSetId } = useParams();
    const { urlDiffId } = useParams();

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

    const debouncedValue = useDebounce<Query>(query, 1000);

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
                mode: query.modes.length < 1 ? [-1] : query.modes.map((m: GameMode) => m === 'osu' ? 0 : m === 'taiko' ? 1 : m === 'fruits' ? 2 : m === "mania" ? 3 : -1),
                status: query.status.length < 1 ? [-3] : query.status.map((m: BeatmapsetStatus) => m === 'ranked' ? 1 : m === 'approved' ? 2 : m === 'qualified' ? 3 : m === "loved" ? 4 : m === "pending" ? 0 : m === "wip" ? -1 : m === "graveyard" ? -2 : -3),
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
                mode: query.modes.length < 1 ? [-1] : query.modes.map((m: GameMode) => m === 'osu' ? 0 : m === 'taiko' ? 1 : m === 'fruits' ? 2 : m === "mania" ? 3 : -1),
                status: query.status.length < 1 ? [-3] : query.status.map((m: BeatmapsetStatus) => m === 'ranked' ? 1 : m === 'approved' ? 2 : m === 'qualified' ? 3 : m === "loved" ? 4 : m === "pending" ? 0 : m === "wip" ? -1 : m === "graveyard" ? -2 : -3),
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
        setQuery((prev) => ({ ...prev, [name]: ((prev as any)[name] as any).includes(val) ? ((prev as any)[name] as any).filter((v: any) => v !== val) : [...((prev as any)[name] as any), val] }));
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
                <div className="flex flex-col gap-3 p-4 rounded-lg drop-shadow-lg bg-custom-950">
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-4">
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
                        </div>
                        <div className="col-span-12 md:col-span-4">
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
                        </div>
                        <div className="col-span-12 md:col-span-4">
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
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-3">
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
                        </div>
                        <div className="col-span-6 md:col-span-3">
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
                        </div>
                        <div className="col-span-6 md:col-span-3">
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
                        </div>
                        <div className="col-span-6 md:col-span-3">
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
                    <div className="grid grid-cols-7">
                        <div className="col-span-7 md:col-start-3 md:col-span-3">
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
            <div style={{ height: 1000 }} className="overflow-x-hidden overflow-y-scroll">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => getMoreBeatmaps(15, results.length)}
                    hasMore={results.length < resultsNum}
                    loader={<div key={0} className="loading loading-dots loading-md"></div>}
                    useWindow={false}
                >
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {results?.map((b: Beatmapset, i: number) =>
                            <BeatmapsetCard key={i} index={i} beatmapset={b} />
                        )}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    )

}

export default BeatmapsPage;
