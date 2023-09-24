import React, { useEffect, useState, useRef, useMemo } from "react";

import { useParams } from "react-router-dom";

import { useDebounce } from "usehooks-ts";

import { Slider } from "@mui/material";
import { BsCheckLg } from "react-icons/bs";
import { BiCopy, BiSolidEraser } from "react-icons/bi";

import { colors } from "../resources/store";
import axios from '../resources/axios-config';
import { secondsToTime } from "../resources/functions";
import { BeatmapsetStatusType, GameModeType } from "../resources/types";
import BeatmapsetPage from "../pages/BeatmapsetPage";
import { BeatmapSet } from "../resources/interfaces/beatmapset";
import BeatmapsetCard from "../cards/BeatmapsetCard";

import List from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

const BeatmapsPage = () => {
    const { urlSetId } = useParams();
    const { urlDiffId } = useParams();

    const [results, setResults] = useState<BeatmapSet[]>([])
    const [resultsNum, setResultsNum] = useState<number>(0)

    const bpmLimit = 300;
    const srLimit = 10;
    const lengthLimit = 600;
    const statLimit = 10;

    const timeMin: number = 2007;
    const timeMax: number = new Date().getFullYear();

    const [title, setTitle] = useState<string>('');
    const [mapper, setMapper] = useState<string>('');

    const [bpm, setBpm] = useState<number[]>([0, bpmLimit]);
    const [sr, setSR] = useState<number[]>([0, srLimit]);
    const [length, setLength] = useState<number[]>([0, lengthLimit]);

    const [ar, setAR] = useState<number[]>([0, statLimit]);
    const [cs, setCS] = useState<number[]>([0, statLimit]);
    const [hp, setHP] = useState<number[]>([0, statLimit]);
    const [od, setOD] = useState<number[]>([0, statLimit]);

    const [year, setYear] = useState<number[]>([timeMin, timeMax]);

    const [modes, setModes] = useState<GameModeType[]>([]);
    const [status, setStatus] = useState<BeatmapsetStatusType[]>([]);

    const [copied, setCopied] = useState<boolean>(false);
    const [cleared, setCleared] = useState<boolean>(false);

    const [sort, setSort] = useState<string[]>([]);

    const widthRef = useRef<HTMLDivElement | null>(null);

    const debouncedValue: string = useDebounce<string>(getQuery().f + getQuery().q + sort + modes.toString() + status + sort.toString(), 500);

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
        setTitle('');
        setMapper('');
        setBpm([0, bpmLimit]);
        setSR([0, srLimit]);
        setLength([0, lengthLimit]);
        setAR([0, statLimit]);
        setCS([0, statLimit]);
        setHP([0, statLimit]);
        setOD([0, statLimit]);
        setYear([timeMin, timeMax]);
        setModes([]);
        setStatus([]);
        setSort([]);
        setTimeout(() => setCleared(false), 400)
    }

    function setURL(): void {
        let url = '';
        if (title !== '') url += `title=${title}&`;
        if (mapper !== '') url += `mapper=${mapper}&`;

        url += `bpm0=${bpm[0]}&bpm1=${bpm[1]}&`;
        url += `sr0=${sr[0]}&sr1=${sr[1]}&`;
        url += `len0=${length[0]}&len1=${length[1]}&`;
        url += `year0=${year[0]}&year1=${year[1]}&`;

        url += `ar0=${ar[0]}&ar1=${ar[1]}&`;
        url += `cs0=${cs[0]}&cs1=${cs[1]}&`;
        url += `hp0=${hp[0]}&hp1=${hp[1]}&`;
        url += `od0=${od[0]}&od1=${od[1]}&`;

        url += `sort=${sort}&`;
        for (let i = 0; i < status.length; i++) {
            url += `status=${status[i]}&`
        }
        for (let i = 0; i < modes.length; i++) {
            url += `modes=${modes[i]}&`
        }
        navigator.clipboard.writeText(`${window.location.host}/beatmaps?${url}`);
        setTimeout(() => setCopied(false), 400)
    }

    function getQuery(): { q: string, f: string } {
        let q: string[] = [];
        if (title !== '') q.push(title);
        const query: string = q.join(' - ');

        let f: string[] = [];

        if (mapper !== '') f.push(`creator=${mapper}`);

        if (bpm[0] < bpmLimit) f.push(`bpm>=${bpm[0]}`);
        if (bpm[1] < bpmLimit) f.push(`bpm<=${bpm[1]}`);
        if (sr[0] < srLimit) f.push(`beatmaps.difficulty_rating>=${sr[0]}`);
        if (sr[0] < srLimit) f.push(`beatmaps.difficulty_rating<=${sr[1]}`);
        if (length[0] < lengthLimit) f.push(`beatmaps.total_length>=${length[0]}`);
        if (length[1] < lengthLimit) f.push(`beatmaps.total_length<=${length[1]}`);

        if (ar[0] < statLimit) f.push(`beatmaps.ar>=${ar[0]}`);
        if (ar[1] < statLimit) f.push(`beatmaps.ar<=${ar[1]}`);
        if (cs[0] < statLimit) f.push(`beatmaps.cs>=${cs[0]}`);
        if (cs[1] < statLimit) f.push(`beatmaps.cs<=${cs[1]}`);
        if (hp[0] < statLimit) f.push(`beatmaps.drain>=${hp[0]}`);
        if (hp[1] < statLimit) f.push(`beatmaps.drain<=${hp[1]}`);
        if (od[0] < statLimit) f.push(`beatmaps.accuracy>=${od[0]}`);
        if (od[1] < statLimit) f.push(`beatmaps.accuracy<=${od[1]}`);

        if (year[0] > timeMin && year[0] < timeMax) f.push(`submitted_date>=${new Date(`${year[0]}-01-01`).getTime() / 1000}`)
        if (year[1] > timeMin && year[1] < timeMax) f.push(`submitted_date<${new Date(`${year[1]}-01-01`).getTime() / 1000}`)

        const filters: string = f.join(' AND ')
        return { q: query, f: filters };
    }

    function getUrlParams() {
        const queryParameters = new URLSearchParams(window.location.search)
        const urlTitle = queryParameters.get('title');
        const urlMapper = queryParameters.get('mapper');

        const urlBPM0 = queryParameters.get('bpm0');
        const urlBPM1 = queryParameters.get('bpm1');
        const urlSR0 = queryParameters.get('sr0');
        const urlSR1 = queryParameters.get('sr1');
        const urlLen0 = queryParameters.get('len0');
        const urlLen1 = queryParameters.get('len1');
        const urlAR0 = queryParameters.get('ar0');
        const urlAR1 = queryParameters.get('ar1');
        const urlCS0 = queryParameters.get('cs0');
        const urlCS1 = queryParameters.get('cs1');
        const urlHP0 = queryParameters.get('hp0');
        const urlHP1 = queryParameters.get('hp1');
        const urlOD0 = queryParameters.get('od0');
        const urlOD1 = queryParameters.get('od1');
        const urlYear0 = queryParameters.get('year0');
        const urlYear1 = queryParameters.get('year1');

        const urlModes = queryParameters.getAll('modes');
        if (urlModes) {
            if (urlModes.length > 0) setModes(urlModes as GameModeType[])
        }
        const urlStatus = queryParameters.getAll('status');
        if (urlStatus) {
            if (urlStatus.length > 0) setStatus(urlStatus as BeatmapsetStatusType[])
        }
        const urlSort = queryParameters.getAll('sort');
        if (urlSort) {
            if (urlSort.length > 0) setSort(urlSort);
        }
        if (urlTitle) {
            setTitle(urlTitle);
        }
        if (urlMapper) {
            setMapper(urlMapper);
        }
        if (urlBPM0 && urlBPM1) {
            setBpm([parseInt(urlBPM0), parseInt(urlBPM1)])
        }
        if (urlSR0 && urlSR1) {
            setSR([parseInt(urlSR0), parseInt(urlSR1)])
        }
        if (urlLen0 && urlLen1) {
            setLength([parseInt(urlLen0), parseInt(urlLen1)])
        }
        if (urlAR0 && urlAR1) {
            setAR([parseInt(urlAR0), parseInt(urlAR1)])
        }
        if (urlCS0 && urlCS1) {
            setCS([parseInt(urlCS0), parseInt(urlCS1)])
        }
        if (urlOD0 && urlOD1) {
            setOD([parseInt(urlOD0), parseInt(urlOD1)])
        }
        if (urlHP0 && urlHP1) {
            setHP([parseInt(urlHP0), parseInt(urlHP1)])
        }
        if (urlYear0 && urlYear1) {
            setYear([parseInt(urlYear0), parseInt(urlYear1)])
        }
    }

    const songModes: GameModeType[] = ["osu", "taiko", "fruits", "mania"];
    const songStatus: BeatmapsetStatusType[] = ['ranked', 'approved', 'qualified', 'loved', 'pending', 'wip', 'graveyard'];

    const songSort = ['bpm', 'favourite_count', 'last_updated', 'play_count', 'ranked_date', 'submitted_date', 'beatmaps.total_length'];

    async function getBeatmaps() {
        const q = {
            query: getQuery().q,
            filter: getQuery().f,
            mode: modes.length < 1 ? [-1] : modes.map((m: GameModeType) => m === 'osu' ? 0 : m === 'taiko' ? 1 : m === 'fruits' ? 2 : m === "mania" ? 3 : -1),
            status: status.length < 1 ? [-3] : status.map((m: BeatmapsetStatusType) => m === 'ranked' ? 1 : m === 'approved' ? 2 : m === 'qualified' ? 3 : m === "loved" ? 4 : m === "pending" ? 0 : m === "wip" ? -1 : m === "graveyard" ? -2 : -3),
            limit: 50,
            offset: 0,
            sort: sort,
        }
        try {
            const res = await axios.post('/beatmapsets', q);
            const data = res.data;
            setResultsNum(parseInt(data.total))
            setResults(data.results)
        } catch (err) {
            console.error(err);
        }
    }

    async function getMoreBeatmaps({ startIndex, stopIndex }: any) {
        const q = {
            query: getQuery().q,
            filter: getQuery().f,
            mode: modes.length < 1 ? [-1] : modes.map((m: GameModeType) => m === 'osu' ? 0 : m === 'taiko' ? 1 : m === 'fruits' ? 2 : m === "mania" ? 3 : -1),
            status: status.length < 1 ? [-3] : status.map((m: BeatmapsetStatusType) => m === 'ranked' ? 1 : m === 'approved' ? 2 : m === 'qualified' ? 3 : m === "loved" ? 4 : m === "pending" ? 0 : m === "wip" ? -1 : m === "graveyard" ? -2 : -3),
            limit: stopIndex * 3,
            offset: startIndex * 3,
            sort: sort,
        }
        try {
            const res = await axios.post('/beatmapsets', q);
            const data = res.data;
            setResultsNum(parseInt(data.total))
            setResults([...results, ...data.results])
        } catch (err) {
            console.error(err);
        }
    }

    if (urlSetId) return (<BeatmapsetPage setId={parseInt(urlSetId)} diffId={parseInt(urlDiffId ? urlDiffId : "")} />);

    return (
        <div className="p-4" ref={widthRef}>
            <div className="p-4 rounded-lg mb-3 flex flex-col gap-3 bg-accent-900 drop-shadow-lg">
                <div className="bg-accent-950 rounded-lg p-4 text-xl flex flex-row justify-between items-center">
                    <div>Beatmap Search:</div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="h5">{resultsNum.toLocaleString()} results</div>
                        <div className="tooltip" data-tip="Clear">
                            <button className="btn btn-error text-lg"
                                onClick={() => {
                                    setCleared(true);
                                    clearSearch();
                                }}>
                                {!cleared ? <BiSolidEraser /> : <BsCheckLg />}

                            </button>
                        </div>
                        <div className="tooltip" data-tip="Copy">
                            <button className="btn btn-success text-lg"
                                onClick={() => {
                                    setCopied(true);
                                    setURL();
                                }}>
                                {!copied ? <BiCopy /> : <BsCheckLg />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 bg-accent-950 rounded-lg p-4 drop-shadow-lg">
                    <div className="col-span-4 md:col-span-2 lg:col-span-3">
                        <div className="mb-2 text-center">Title:</div>
                        <input type="text" className="input input-bordered w-full text-center"
                            placeholder="..." autoFocus={true}
                            value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="col-span-4 md:col-span-2 lg:col-span-1">
                        <div className="mb-2 text-center">Mapper:</div>
                        <input type="text" className="input input-bordered w-full text-center"
                            placeholder="..."
                            value={mapper} onChange={(e) => setMapper(e.target.value)} />
                    </div>
                </div>
                <div className="rounded-lg flex flex-col p-4 gap-3 bg-accent-950 drop-shadow-lg">
                    <div className="grid grid-cols-7">
                        <div className="col-span-7 md:col-start-3 md:col-span-3">
                            <div className="text-center">Year:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{year[0] < timeMax ? year[0] : 'now'}</div>
                                <Slider className="yearSlider grow"
                                    min={timeMin} max={timeMax} step={1}
                                    onChange={(event, newValue, activeThumb) => {
                                        if (activeThumb === 0) {
                                            setYear([Math.min((newValue as number[])[0], year[1] - 1), year[1]]);
                                        } else {
                                            setYear([year[0], Math.max((newValue as number[])[1], year[0] + 1)]);
                                        }
                                    }}
                                    value={year} disableSwap />
                                <div className="w-20 text-start">{year[1] < timeMax ? year[1] : 'now'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-4">
                            <div className="text-center">BPM:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{bpm[0] < bpmLimit ? bpm[0] : '∞'}</div>
                                <Slider min={0}
                                    max={bpmLimit}
                                    step={5}
                                    className="bpmSlider grow"
                                    onChange={(event, newValue, activeThumb) => {
                                        if (activeThumb === 0) {
                                            setBpm([Math.min((newValue as number[])[0], bpm[1] - 5), bpm[1]]);
                                        } else {
                                            setBpm([bpm[0], Math.max((newValue as number[])[1], bpm[0] + 5)]);
                                        }
                                    }}
                                    value={bpm} disableSwap />
                                <div className="w-20 text-start">{bpm[1] < bpmLimit ? bpm[1] : '∞'}</div>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <div className="text-center">Stars:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{sr[0] < srLimit ? sr[0] : '∞'}</div>
                                <Slider min={0}
                                    max={srLimit}
                                    step={0.5}
                                    className="srSlider grow"
                                    onChange={(event, newValue, activeThumb) => {
                                        if (activeThumb === 0) {
                                            setSR([Math.min((newValue as number[])[0], sr[1] - 0.5), sr[1]]);
                                        } else {
                                            setSR([sr[0], Math.max((newValue as number[])[1], sr[0] + 0.5)]);
                                        }
                                    }}
                                    value={sr} disableSwap />
                                <div className="w-20 text-start">{sr[1] < srLimit ? sr[1] : '∞'}</div>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <div className="text-center">Length:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{length[0] < lengthLimit ? secondsToTime(length[0]) : '∞'}</div>
                                <Slider min={0}
                                    max={lengthLimit}
                                    step={15}
                                    className="lengthSlider"
                                    onChange={(event, newValue, activeThumb) => {
                                        if (activeThumb === 0) {
                                            setLength([Math.min((newValue as number[])[0], length[1] - 30), length[1]]);
                                        } else {
                                            setLength([length[0], Math.max((newValue as number[])[1], length[0] + 30)]);
                                        }
                                    }}
                                    value={length} disableSwap />
                                <div className="w-20 text-start">{length[1] < lengthLimit ? secondsToTime(length[1]) : '∞'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-3">
                            <div className="text-center">AR:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{ar[0]}</div>
                                <Slider min={0}
                                    max={statLimit}
                                    step={0.5}
                                    className="arSlider"
                                    onChange={(event, newValue, activeThumb) => {
                                        if (activeThumb === 0) {
                                            setAR([Math.min((newValue as number[])[0], ar[1] - 1), ar[1]]);
                                        } else {
                                            setAR([ar[0], Math.max((newValue as number[])[1], ar[0] + 1)]);
                                        }
                                    }}
                                    value={ar} disableSwap />
                                <div className="w-20 text-start">{ar[1]}</div>
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                            <div className="text-center">CS:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{cs[0]}</div>
                                <Slider min={0}
                                    max={statLimit}
                                    step={0.5}
                                    className="csSlider"
                                    onChange={(event, newValue, activeThumb) => {
                                        if (activeThumb === 0) {
                                            setCS([Math.min((newValue as number[])[0], cs[1] - 1), cs[1]]);
                                        } else {
                                            setCS([cs[0], Math.max((newValue as number[])[1], cs[0] + 1)]);
                                        }
                                    }}
                                    value={cs} disableSwap />
                                <div className="w-20 text-start">{cs[1]}</div>
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                            <div className="text-center">HP:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{hp[0]}</div>
                                <Slider min={0}
                                    max={statLimit}
                                    step={0.5}
                                    className="hpSlider"
                                    onChange={(event, newValue, activeThumb) => {
                                        if (activeThumb === 0) {
                                            setHP([Math.min((newValue as number[])[0], hp[1] - 1), hp[1]]);
                                        } else {
                                            setHP([hp[0], Math.max((newValue as number[])[1], hp[0] + 1)]);
                                        }
                                    }}
                                    value={hp} disableSwap />
                                <div className="w-20 text-start">{hp[1]}</div>
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                            <div className="text-center">OD:</div>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <div className="w-20 text-end">{od[0]}</div>
                                <Slider
                                    min={0}
                                    max={statLimit}
                                    step={0.5}
                                    className="odSlider"
                                    onChange={(event, newValue, activeThumb) => {
                                        if (activeThumb === 0) {
                                            setOD([Math.min((newValue as number[])[0], od[1] - 1), od[1]]);
                                        } else {
                                            setOD([od[0], Math.max((newValue as number[])[1], od[0] + 1)]);
                                        }
                                    }}
                                    value={od} disableSwap />
                                <div className="w-20 text-start">{od[1]}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-3 md:col-span-1 bg-accent-950 rounded-lg p-4 flex flex-col gap-4 drop-shadow-lg">
                        <div>Mode:</div>
                        <div className="flex flex-row flex-wrap gap-3" role="group">
                            {songModes.map((thing: GameModeType, index: number) =>
                                <button type="button"
                                    className={`btn text-black fw-bold  darkenOnHover rounded-lg ${!modes.includes(thing) && 'fakeDisabled'}`}
                                    key={index + 1}
                                    onClick={() => modes.includes(thing) ? setModes(modes.filter(v => v != thing)) : setModes([...modes, thing])}
                                    style={{ backgroundColor: (colors.modes as any)[thing] }}>
                                    {thing.toLowerCase()}
                                </button>)}
                        </div>
                    </div>
                    <div className="col-span-3 md:col-span-2 bg-accent-950 rounded-lg p-4 flex flex-col gap-4 drop-shadow-lg">
                        <div>Status:</div>
                        <div className="flex flex-row flex-wrap gap-3 items-center" role="group">
                            {songStatus.map((thing: BeatmapsetStatusType, index: number) =>
                                <button type="button"
                                    className={`btn text-black fw-bold  darkenOnHover rounded-lg ${!status.includes(thing) && 'fakeDisabled'}`}
                                    key={index + 1}
                                    onClick={() => status.includes(thing) ? setStatus(status.filter(v => v != thing)) : setStatus([...status, thing])}
                                    style={{ backgroundColor: (colors.beatmap as any)[thing] }}>
                                    {thing.toLowerCase()}
                                </button>)}
                        </div>
                    </div>
                </div>
                <div className="bg-accent-950 rounded-lg p-4 flex flex-col gap-4 drop-shadow-lg">
                    <div>Sort:</div>
                    <div className="flex flex-row flex-wrap gap-3">
                        {songSort.map((sor) =>
                            <button className={`btn flex flex-row gap-1 accentColor text-black fw-bold darkenOnHover rounded-lg ${sort[0]?.split(':')[0] !== sor && 'fakeDisabled'}`}
                                onClick={() => {
                                    const s: any = sort[0]?.split(':')[0];
                                    const o: any = sort[0]?.split(':')[1];
                                    if (s && o) {
                                        if (s === sor) {
                                            if (o === 'asc') setSort([]);
                                            else setSort([`${sor}:asc`])
                                        } else {
                                            setSort([`${sor}:desc`])
                                        }
                                    } else {
                                        setSort([`${sor}:desc`])
                                    }
                                }}>
                                <div className="text-black">{sor.replace('beatmaps.', '').replace('_', ' ')}</div>
                                {sort[0]?.split(':')[0] === sor && sort[0]?.split(':')[1] === 'desc' && <i className="bi bi-caret-down-fill text-black"></i>}
                                {sort[0]?.split(':')[0] === sor && sort[0]?.split(':')[1] === 'asc' && <i className="bi bi-caret-up-fill text-black"></i>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="gap-4" style={{ height: 1000 }}>
                <InfiniteLoader
                    isRowLoaded={isRowLoaded}
                    loadMoreRows={getMoreBeatmaps}
                    rowCount={Math.floor(resultsNum / 3)}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List height={height}
                                    width={width}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowCount={Math.floor(results.length / 3)}
                                    rowHeight={196}
                                    rowRenderer={rowRenderer}
                                />)}
                        </AutoSizer>
                    )}
                </InfiniteLoader>
            </div>
        </div>
    )

    function rowRenderer({ key, index, style }: any) {
        let k = (index + 1) * 3;
        return (
            <div style={style} key={key}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {k - 3 < resultsNum && <BeatmapsetCard index={k - 3} data={results[k - 3]} />}
                    {k - 2 < resultsNum && <BeatmapsetCard index={k - 2} data={results[k - 2]} />}
                    {k - 1 < resultsNum && <BeatmapsetCard index={k - 1} data={results[k - 1]} />}
                </div>
            </div>
        )
    }

    function isRowLoaded({ index }: any) {
        return !!results[(index + 1) * 3];
    }

}

export default BeatmapsPage;
