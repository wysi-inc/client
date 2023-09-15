import React, { useEffect, useState } from "react";
import axios from '../resources/axios-config';
import { BeatmapSet } from "../resources/interfaces";
import BeatmapsetCard from "../components/BeatmapsetCard";
import { GameModeType, SongGenreType, SongLanguageType, BeatmapsetStatusType, SongSortType } from "../resources/types";
import { Slider } from "@mui/material";
import { secondsToTime } from "../resources/functions";
import { colors } from "../resources/store";
import { useDebounce } from "usehooks-ts";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment/moment";

const BeatmapsPage = () => {

    const [results, setResults] = useState<BeatmapSet[]>([])
    const [resultsNum, setResultsNum] = useState<number>(0)
    const [searching, setSearching] = useState<boolean>(false);

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

    const [sort, setSort] = useState<string[]>([]);

    useEffect((): void => {
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
        window.history.pushState({}, '', '/beatmaps');
    }, [])

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

    const songModes: GameModeType[] = ["osu", "taiko", "fruits", "mania"];
    const songStatus: BeatmapsetStatusType[] = ['ranked', 'approved', 'qualified', 'loved', 'pending', 'wip', 'graveyard'];

    const songSort = ['bpm', 'favourite_count', 'last_updated', 'play_count', 'ranked_date', 'submitted_date', 'beatmaps.total_length'];

    const debouncedValue: string = useDebounce<string>(getQuery().f + getQuery().q + sort + modes.toString() + status + sort.toString(), 500);

    useEffect(() => {
        getBeatmaps(true);
    }, [debouncedValue]);

    function getBeatmaps(clear: boolean): void {
        setSearching(true);
        const q = {
            query: getQuery().q,
            filter: getQuery().f,
            mode: modes.length < 1 ? [-1] : modes.map((m: GameModeType) => m === 'osu' ? 0 : m === 'taiko' ? 1 : m === 'fruits' ? 2 : m === "mania" ? 3 : -1),
            status: status.length < 1 ? [-3] : status.map((m: BeatmapsetStatusType) => m === 'ranked' ? 1 : m === 'approved' ? 2 : m === 'qualified' ? 3 : m === "loved" ? 4 : m === "pending" ? 0 : m === "wip" ? -1 : m === "graveyard" ? -2 : -3),
            limit: 50,
            offset: clear ? 0 : results.length,
            sort: sort,
        }
        axios.post('/beatmaps', q).then((r): void => {
            if (r.data.error || r.data.length < 1) {
                console.error(r.data.error)
                setResults([]);
                setResultsNum(0);
            } else {
                if (clear) {
                    setResults(r.data.results)
                } else {
                    setResults([...results, ...r.data.results]);
                }
                setResultsNum(parseInt(r.data.total))
            }
        }).catch((e) => {
            console.error(e);
        }).finally(() => {
            setSearching(false);
        })
    }

    return (
        <div className="p-4">
            <div className="p-4 midColor rounded-lgmb-3 flex flex-col gap-3 ">
                <div className="flex flex-row justify-content-between items-center">
                    <div className="h2">Beatmap Search:</div>
                    <div className="flex flex flex-row gap-2 items-center">
                        <div className="h5">{resultsNum.toLocaleString()} results</div>
                        <button className="btn accentColor darkenOnHover"
                            onClick={clearSearch}
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Clear Search">
                            <i className="bi bi-eraser"></i>
                        </button>
                        <button className="btn btn-success darkenOnHover"
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Copy Search"
                            onClick={() => {
                                setCopied(true);
                                setURL();
                            }} disabled={copied}>
                            <i className={`bi ${!copied ? 'bi-clipboard' : 'bi-check-lg'}`}></i>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-12 darkestColor rounded-lgp-3">
                    <div className="col-8">
                        <div className="mb-2 text-center">Title:</div>
                        <input type="text" className="form-control flex-ggrid grid-cols-12-1 me-2 darkColor border-0 text-center"
                            placeholder="..." autoFocus={true}
                            value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="col-4">
                        <div className="mb-2 text-center">Mapper:</div>
                        <input type="text" className="form-control flex-ggrid grid-cols-12-1 me-2 darkColor border-0 text-center"
                            placeholder="..."
                            value={mapper} onChange={(e) => setMapper(e.target.value)} />
                    </div>
                </div>
                <div className="darkestColor rounded-lgflex flex-col p-3 gap-3">
                    <div className="grid grid-cols-12">
                        <div className="col-12">
                            <div className="text-center">Year:</div>
                            <div className="grid grid-cols-12 items-center">
                                <div
                                    className="col-2 text-end">{year[0] < timeMax ? year[0] : 'now'}</div>
                                <div className="col-8 flex items-center">
                                    <Slider min={timeMin}
                                        max={timeMax}
                                        className="yearSlider"
                                        step={1}
                                        onChange={(event, newValue, activeThumb) => {
                                            if (activeThumb === 0) {
                                                setYear([Math.min((newValue as number[])[0], year[1] - 1), year[1]]);
                                            } else {
                                                setYear([year[0], Math.max((newValue as number[])[1], year[0] + 1)]);
                                            }
                                        }}
                                        value={year} disableSwap />
                                </div>
                                <div className="col-2 text-start">{year[1] < timeMax ? year[1] : 'now'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12">
                        <div className="col-4">
                            <div className="text-center">BPM:</div>
                            <div className="grid grid-cols-12 items-center">
                                <div className="col-2 text-end">{bpm[0] < bpmLimit ? bpm[0] : '∞'}</div>
                                <div className="col-8 flex items-center">
                                    <Slider min={0}
                                        max={bpmLimit}
                                        step={5}
                                        className="bpmSlider"
                                        onChange={(event, newValue, activeThumb) => {
                                            if (activeThumb === 0) {
                                                setBpm([Math.min((newValue as number[])[0], bpm[1] - 5), bpm[1]]);
                                            } else {
                                                setBpm([bpm[0], Math.max((newValue as number[])[1], bpm[0] + 5)]);
                                            }
                                        }}
                                        value={bpm} disableSwap />
                                </div>
                                <div className="col-2 text-start">{bpm[1] < bpmLimit ? bpm[1] : '∞'}</div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="text-center">Stars:</div>
                            <div className="grid grid-cols-12 items-center">
                                <div className="col-2 text-end">{sr[0] < srLimit ? sr[0] : '∞'}</div>
                                <div className="col-8 flex items-center">
                                    <Slider min={0}
                                        max={srLimit}
                                        step={0.5}
                                        className="srSlider"
                                        onChange={(event, newValue, activeThumb) => {
                                            if (activeThumb === 0) {
                                                setSR([Math.min((newValue as number[])[0], sr[1] - 0.5), sr[1]]);
                                            } else {
                                                setSR([sr[0], Math.max((newValue as number[])[1], sr[0] + 0.5)]);
                                            }
                                        }}
                                        value={sr} disableSwap />
                                </div>
                                <div className="col-2 text-start">{sr[1] < srLimit ? sr[1] : '∞'}</div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="text-center">Length:</div>
                            <div className="grid grid-cols-12 items-center">
                                <div
                                    className="col-2 text-end">{length[0] < lengthLimit ? secondsToTime(length[0]) : '∞'}</div>
                                <div className="col-8 flex items-center">
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
                                </div>
                                <div
                                    className="col-2 text-start">{length[1] < lengthLimit ? secondsToTime(length[1]) : '∞'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12">
                        <div className="col-3">
                            <div className="text-center">AR:</div>
                            <div className="grid grid-cols-12 items-center">
                                <div className="col-2 text-end">{ar[0]}</div>
                                <div className="col-8 flex items-center">
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
                                </div>
                                <div className="col-2 text-start">{ar[1]}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-center">CS:</div>
                            <div className="grid grid-cols-12 items-center">
                                <div className="col-2 text-end">{cs[0]}</div>
                                <div className="col-8 flex items-center">
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
                                </div>
                                <div className="col-2 text-start">{cs[1]}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-center">HP:</div>
                            <div className="grid grid-cols-12 items-center">
                                <div className="col-2 text-end">{hp[0]}</div>
                                <div className="col-8 flex items-center">
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
                                </div>
                                <div className="col-2 text-start">{hp[1]}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-center">OD:</div>
                            <div className="grid grid-cols-12 items-center">
                                <div className="col-2 text-end">{od[0]}</div>
                                <div className="col-8 flex items-center">
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
                                </div>
                                <div className="col-2 text-start">{od[1]}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-3">
                    <div className="darkestColor rounded-lgp-3 flex flex-col gap-2 flex-ggrid grid-cols-12-1">
                        <div>Status:</div>
                        <div className="flex flex flex-row flex-wrap gap-2 items-center" role="group">
                            {songStatus.map((thing: BeatmapsetStatusType, index: number) =>
                                <button type="button"
                                    className={`btn text-black fw-bold border-0 darkenOnHover rounded-lg${!status.includes(thing) && 'fakeDisabled'}`}
                                    key={index + 1}
                                    onClick={() => status.includes(thing) ? setStatus([]) : setStatus([...status, thing])}
                                    style={{ backgroundColor: (colors.beatmap as any)[thing] }}>
                                    {thing.toLowerCase()}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="darkestColor rounded-lgp-3 flex flex-col gap-2 flex-ggrid grid-cols-12-1">
                        <div>Mode:</div>
                        <div className="flex flex flex-row flex-wrap gap-2" role="group">
                            {songModes.map((thing: GameModeType, index: number) =>
                                <button type="button"
                                    className={`btn text-black fw-bold border-0 darkenOnHover rounded-lg${!modes.includes(thing) && 'fakeDisabled'}`}
                                    key={index + 1}
                                    onClick={() => modes.includes(thing) ? setModes(modes.filter(v => v != thing)) : setModes([...modes, thing])}
                                    style={{ backgroundColor: (colors.modes as any)[thing] }}>
                                    {thing.toLowerCase()}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-3">
                    <div className="darkestColor rounded-lgp-3 flex flex-col gap-2 flex-ggrid grid-cols-12-1">
                        <div>Sort:</div>
                        <div className="flex flex flex-row flex-wrap gap-2">
                            {songSort.map((sor) =>
                                <button className={`btn flex flex flex-row gap-1 accentColor text-black fw-bold border-0 darkenOnHover rounded-lg${sort[0]?.split(':')[0] !== sor && 'fakeDisabled'}`}
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
            </div>
            <div className="grid grid-cols-12 gap-2 justify-center">
                {results.map((set: BeatmapSet, index: number) =>
                    <div className="col-12 col-md-8 col-xl-5 col-xxl-4 rounded-3 overflow-hidden p-0">
                        <BeatmapsetCard key={index + 1} data={set} index={index} />
                    </div>
                )}
                {results.length < resultsNum &&
                    <button
                        className="btn btn-success flex flex flex-row gap-2 justify-center w-full"
                        onClick={() => getBeatmaps(false)}>
                        <i className="bi bi-caret-down-fill"></i>
                        <div>Load more</div>
                    </button>}
                <Spinner animation="border" role="status" hidden={!searching}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        </div>
    )
}

export default BeatmapsPage;