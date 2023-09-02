import React, {useEffect, useState} from "react";
import axios from '../resources/axios-config';
import {BeatmapSet} from "../resources/interfaces";
import BeatmapsetCard from "../components/BeatmapsetCard";
import {GameModeType, SongGenreType, SongLanguageType, BeatmapsetStatusType, SongSortType} from "../resources/types";
import {Slider} from "@mui/material";
import {secondsToTime} from "../resources/functions";
import {colors} from "../resources/store";
import {useDebounce} from "usehooks-ts";
import Spinner from "react-bootstrap/Spinner";

const BeatmapsPage = () => {

    const [results, setResults] = useState<BeatmapSet[]>([])
    const [resultsNum, setResultsNum] = useState<number>(0)
    const [searching, setSearching] = useState<boolean>(false);

    const bpmLimit = 300;
    const srLimit = 10;
    const lengthLimit = 600;
    const statLimit = 10;

    const [title, setTitle] = useState<string>('');
    const [artist, setArtist] = useState<string>('');
    const [mapper, setMapper] = useState<string>('');
    const [diff, setDiff] = useState<string>('');

    const [bpm, setBpm] = useState<number[]>([0, bpmLimit]);
    const [sr, setSR] = useState<number[]>([0, srLimit]);
    const [length, setLength] = useState<number[]>([0, lengthLimit]);

    const [ar, setAR] = useState<number[]>([0, statLimit]);
    const [cs, setCS] = useState<number[]>([0, statLimit]);
    const [hp, setHP] = useState<number[]>([0, statLimit]);
    const [od, setOD] = useState<number[]>([0, statLimit]);

    const [sort, setSort] = useState<SongSortType>('title_asc');
    const [mode, setMode] = useState<GameModeType>('any');
    const [section, setSection] = useState<BeatmapsetStatusType>('ranked');
    const [genre, setGenre] = useState<SongGenreType>('any');
    const [language, setLanguage] = useState<SongLanguageType>('any');


    useEffect((): void => {
        const queryParameters = new URLSearchParams(window.location.search)

        const urlTitle = queryParameters.get('title');
        const urlArtist = queryParameters.get('artist');
        const urlMapper = queryParameters.get('mapper');
        const urlDiff = queryParameters.get('diff');

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

        const urlMode = queryParameters.get('mode');
        const urlSort = queryParameters.get('sort');
        const urlSection = queryParameters.get('section');
        const urlGenre = queryParameters.get('genre');
        const urlLang = queryParameters.get('lang');

        if (urlTitle) {
            setTitle(urlTitle);
        }
        if (urlArtist) {
            setArtist(urlArtist)
        }
        if (urlMapper) {
            setMapper(urlMapper)
        }
        if (urlDiff) {
            setDiff(urlDiff)
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
        if (urlMode) {
            setMode(urlMode as GameModeType)
        }
        if (urlSort) {
            setSort(urlSort as SongSortType)
        }
        if (urlSection) {
            setSection(urlSection as BeatmapsetStatusType)
        }
        if (urlGenre) {
            setGenre(urlGenre as SongGenreType)
        }
        if (urlLang) {
            setLanguage(urlLang as SongLanguageType)
        }
    }, [])

    function clearSearch(): void {
        setTitle('');
        setArtist('');
        setMapper('');
        setDiff('');
        setBpm([0, bpmLimit]);
        setSR([0, srLimit]);
        setLength([0, lengthLimit]);
        setAR([0, statLimit]);
        setCS([0, statLimit]);
        setHP([0, statLimit]);
        setOD([0, statLimit]);
        setSort('title_asc');
        setMode('any');
        setSection('ranked');
        setGenre('any');
        setLanguage('any');
    }

    function getDebounceValue(): string {
        return getQuery() + sort + mode + section + genre + language;
    }

    function setURL(): void {
        let url = '';
        if (title !== '') url += `title=${title}&`;
        if (artist !== '') url += `artist=${artist}&`;
        if (mapper !== '') url += `mapper=${mapper}&`;
        if (diff !== '') url += `diff=${diff}&`;

        url += `bpm0=${bpm[0]}&bpm1=${bpm[1]}&`;
        url += `sr0=${sr[0]}&sr1=${sr[1]}&`;
        url += `len0=${length[0]}&len1=${length[1]}&`;

        url += `ar0=${ar[0]}&ar1=${ar[1]}&`;
        url += `cs0=${cs[0]}&cs1=${cs[1]}&`;
        url += `hp0=${hp[0]}&hp1=${hp[1]}&`;
        url += `od0=${od[0]}&od1=${od[1]}&`;

        url += `sort=${sort}&`;
        url += `mode=${mode}&`;
        url += `section=${section}&`;
        url += `genre=${genre}&`;
        url += `lang=${language}`;
        window.history.pushState({}, '', `/beatmaps?${url}`);
    }

    function getQuery(): string {
        let query: string = '';
        if (title !== '') query += title;
        if (artist !== '') query += ` artist=${artist}`;
        if (mapper !== '') query += ` mapper=${mapper}`;
        if (diff !== '') query += diff;

        if (bpm[0] < bpmLimit) query += ` bpm>=${bpm[0]}`;
        if (bpm[1] < bpmLimit) query += ` bpm<=${bpm[1]}`;
        if (sr[0] < srLimit) query += ` stars>=${sr[0]}`;
        if (sr[0] < srLimit) query += ` stars<=${sr[1]}`;
        if (length[0] < lengthLimit) query += ` length>=${length[0]}`;
        if (length[1] < lengthLimit) query += ` length<=${length[1]}`;

        if (ar[0] < statLimit) query += ` ar>=${ar[0]}`;
        if (ar[1] < statLimit) query += ` ar<=${ar[1]}`;
        if (cs[0] < statLimit) query += ` cs>=${cs[0]}`;
        if (cs[1] < statLimit) query += ` cs<=${cs[1]}`;
        if (hp[0] < statLimit) query += ` hp>=${hp[0]}`;
        if (hp[1] < statLimit) query += ` hp<=${hp[1]}`;
        if (od[0] < statLimit) query += ` od>=${od[0]}`;
        if (od[1] < statLimit) query += ` od<=${od[1]}`;
        return query.trim();
    }

    const songModes: GameModeType[] = ["any", "osu", "taiko", "fruits", "mania"];
    const songGenres: SongGenreType[] = ["any", "Video Game", "Anime", "Rock", "Pop", "Novelty", "Hip Hop", "Electronic", "Metal", "Classical", "Folk", "Jazz", "Unspecified", "Other"];
    const songSections: BeatmapsetStatusType[] = ["any", 'ranked', 'qualified', 'loved', 'pending', 'wip', 'graveyard'];
    const songLanguages: SongLanguageType[] = ["any", "English", "Chinese", "French", "German", "Italian", "Japanese", "Korean", "Spanish", "Swedish", "Russian", "Polish", "Instrumental", "Unspecified", "Other"];

    const debouncedValue: string = useDebounce<string>(getDebounceValue(), 500);

    useEffect(() => {
        getBeatmaps();
    }, [debouncedValue]);

    function getBeatmaps(): void {
        setResults([]);
        setResultsNum(0);
        setSearching(true);
        axios.post('/beatmaps', {
            query: getQuery(),
            sort: sort,
            mode: mode.toString(),
            section: section.toString(),
            genre: genre.toString(),
            language: language.toString(),
        }).then((r): void => {
            setResults(r.data.beatmapsets);
            setResultsNum(r.data.total);
            console.log(r.data)
        }).catch((e) => {
            console.error(e)
        }).finally(() => {
            setSearching(false);
            setURL();
        })
    }

    return (
        <div className="p-4">
            <div className="p-4 midColor rounded mb-3 d-flex flex-column gap-3 ">
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <div className="h2">Beatmap Search:</div>
                    <div className="d-flex flex-row gap-4 align-items-center">
                        <div className="h5">{resultsNum.toLocaleString()} results</div>
                        <button className="btn accentColor darkenOnHover d-flex flex-row gap-2"
                                onClick={clearSearch}>
                            <i className="bi bi-eraser"></i>
                            <div>Clear</div>
                        </button>
                    </div>
                </div>
                <div className="row darkestColor rounded p-3">
                    <div className="col-3">
                        <div className="mb-2 text-center">Title:</div>
                        <input type="text" className="form-control flex-grow-1 me-2 darkColor border-0 text-center"
                               placeholder="..." autoFocus={true}
                               value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div className="col-3">
                        <div className="mb-2 text-center">Artist:</div>
                        <input type="text" className="form-control flex-grow-1 me-2 darkColor border-0 text-center"
                               placeholder="..."
                               value={artist} onChange={(e) => setArtist(e.target.value)}/>
                    </div>
                    <div className="col-3">
                        <div className="mb-2 text-center">Mapper:</div>
                        <input type="text" className="form-control flex-grow-1 me-2 darkColor border-0 text-center"
                               placeholder="..."
                               value={mapper} onChange={(e) => setMapper(e.target.value)}/>
                    </div>
                    <div className="col-3">
                        <div className="mb-2 text-center">Difficulty Name:</div>
                        <input type="text" className="form-control flex-grow-1 me-2 darkColor border-0 text-center"
                               placeholder="..."
                               value={diff} onChange={(e) => setDiff(e.target.value)}/>
                    </div>
                </div>
                <div className="darkestColor rounded p-3">
                    <div className="row mb-3">
                        <div className="col-4">
                            <div className="text-center">BPM:</div>
                            <div className="row align-items-center">
                                <div className="col-2 text-end">{bpm[0] < bpmLimit ? bpm[0] : '∞'}</div>
                                <div className="col-8 d-flex align-items-center">
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
                                            value={bpm} disableSwap/>
                                </div>
                                <div className="col-2 text-start">{bpm[1] < bpmLimit ? bpm[1] : '∞'}</div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="text-center">Stars:</div>
                            <div className="row align-items-center">
                                <div className="col-2 text-end">{sr[0] < srLimit ? sr[0] : '∞'}</div>
                                <div className="col-8 d-flex align-items-center">
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
                                            value={sr} disableSwap/>
                                </div>
                                <div className="col-2 text-start">{sr[1] < srLimit ? sr[1] : '∞'}</div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="text-center">Length:</div>
                            <div className="row align-items-center">
                                <div
                                    className="col-2 text-end">{length[0] < lengthLimit ? secondsToTime(length[0]) : '∞'}</div>
                                <div className="col-8 d-flex align-items-center">
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
                                            value={length} disableSwap/>
                                </div>
                                <div
                                    className="col-2 text-start">{length[1] < lengthLimit ? secondsToTime(length[1]) : '∞'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <div className="text-center">AR:</div>
                            <div className="row align-items-center">
                                <div className="col-2 text-end">{ar[0]}</div>
                                <div className="col-8 d-flex align-items-center">
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
                                            value={ar} disableSwap/>
                                </div>
                                <div className="col-2 text-start">{ar[1]}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-center">CS:</div>
                            <div className="row align-items-center">
                                <div className="col-2 text-end">{cs[0]}</div>
                                <div className="col-8 d-flex align-items-center">
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
                                            value={cs} disableSwap/>
                                </div>
                                <div className="col-2 text-start">{cs[1]}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-center">HP:</div>
                            <div className="row align-items-center">
                                <div className="col-2 text-end">{hp[0]}</div>
                                <div className="col-8 d-flex align-items-center">
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
                                            value={hp} disableSwap/>
                                </div>
                                <div className="col-2 text-start">{hp[1]}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-center">OD:</div>
                            <div className="row align-items-center">
                                <div className="col-2 text-end">{od[0]}</div>
                                <div className="col-8 d-flex align-items-center">
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
                                        value={od} disableSwap/>
                                </div>
                                <div className="col-2 text-start">{od[1]}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row gap-3">
                    <div className="darkestColor rounded p-3 d-flex flex-column gap-2 flex-grow-1">
                        <div>Status:</div>
                        <div className="d-flex flex-row flex-wrap gap-2" role="group">
                            {songSections.map((thing: BeatmapsetStatusType, index: number) =>
                                <button type="button"
                                        className="btn text-black fw-bold border-0 darkenOnHover rounded-pill"
                                        disabled={section === thing} key={index + 1}
                                        onClick={() => setSection(thing)}
                                        style={{backgroundColor: (colors.beatmap as any)[thing]}}>
                                    {thing.toLowerCase()}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="darkestColor rounded p-3 d-flex flex-column gap-2 flex-grow-1">
                        <div>Mode:</div>
                        <div className="d-flex flex-row flex-wrap gap-2" role="group">
                            {songModes.map((thing: GameModeType, index: number) =>
                                <button type="button"
                                        className="btn text-black fw-bold border-0 darkenOnHover rounded-pill"
                                        disabled={mode === thing} key={index + 1}
                                        onClick={() => setMode(thing)}
                                        style={{backgroundColor: (colors.modes as any)[thing]}}>
                                    {thing.toLowerCase()}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="darkestColor rounded p-3 d-flex flex-column gap-2">
                    <div>Genre:</div>
                    <div className="d-flex flex-row flex-wrap gap-2" role="group">
                        {songGenres.map((thing: SongGenreType, index: number) =>
                            <button type="button"
                                    className="btn accentColor border-0 darkenOnHover rounded-pill disabled"
                                    disabled={genre === thing} key={index + 1}
                                    onClick={() => setGenre(thing)}>
                                {thing.toLowerCase()}
                            </button>
                        )}
                    </div>
                </div>
                <div className="darkestColor rounded p-3 d-flex flex-column gap-2">
                    <div>Language:</div>
                    <div className="d-flex flex-row flex-wrap gap-2" role="group">
                        {songLanguages.map((thing: SongLanguageType, index: number) =>
                            <button type="button"
                                    className="btn accentColor border-0 darkenOnHover rounded-pill disabled"
                                    disabled={language === thing} key={index + 1}
                                    onClick={() => setLanguage(thing)}>
                                {thing.toLowerCase()}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="row gap-2 justify-content-center">
                <Spinner animation="border" role="status" hidden={!searching}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                {results.map((set: BeatmapSet, index: number) =>
                    <BeatmapsetCard key={index + 1} data={set} index={index}/>
                )}
            </div>
        </div>
    )
}

export default BeatmapsPage;