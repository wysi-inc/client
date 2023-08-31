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

    const [title, setTitle] = useState<string>('')
    const [artist, setArtist] = useState<string>('')
    const [mapper, setMapper] = useState<string>('')
    const [diff, setDiff] = useState<string>('')

    const bpmLimit = 300;
    const srLimit = 12;
    const lengthLimit = 600;
    const statLimit = 10;

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

    function getDebounceValue(): string {
        return getQuery() + sort + mode + section + genre + language;
    }

    function getQuery(): string {
        let query = '';
        if (title !== '') query += title;
        if (artist !== '') query += ` artist=${artist}`;
        if (mapper !== '') query += ` mapper=${mapper}`;
        if (diff !== '') query += diff;

        if (bpm[0] < bpmLimit) query += ` bpm>${bpm[0]}`;
        if (bpm[1] < bpmLimit) query += ` bpm<${bpm[1]}`;
        if (sr[0] < srLimit) query += ` stars>${sr[0]}`;
        if (sr[0] < srLimit) query += ` stars<${sr[1]}`;
        if (length[0] < lengthLimit) query += ` length>${length[0]}`;
        if (length[1] < lengthLimit) query += ` length<${length[1]}`;

        if (ar[0] < statLimit) query += ` ar>${ar[0]}`;
        if (ar[1] < statLimit) query += ` ar<${ar[1]}`;
        if (cs[0] < statLimit) query += ` cs>${cs[0]}`;
        if (cs[1] < statLimit) query += ` cs<${cs[1]}`;
        if (hp[0] < statLimit) query += ` hp>${hp[0]}`;
        if (hp[1] < statLimit) query += ` hp<${hp[1]}`;
        if (od[0] < statLimit) query += ` od>${od[0]}`;
        if (od[1] < statLimit) query += ` od<${od[1]}`;

        return query.trim();
    }

    const songModes: GameModeType[] = ["any", "osu", "taiko", "fruits", "mania"];
    const songGenres: SongGenreType[] = ["any", "video game", "anime", "rock", "pop", "novelty", "hip hop", "electronic", "metal", "classical", "folk", "jazz", "unspecified", "other"];
    const songSections: BeatmapsetStatusType[] = ["any", 'ranked', 'qualified', 'loved', 'pending', 'wip', 'graveyard'];
    const songLanguages: SongLanguageType[] = ["any", "english", "chinese", "french", "german", "italian", "japanese", "korean", "spanish", "swedish", "russian", "polish", "instrumental", "unspecified", "other"];

    const debouncedValue: string = useDebounce<string>(getDebounceValue(), 500)

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
            mode: mode,
            section: section,
            genre: genre,
            language: language,
        }).then((r): void => {
            setResults(r.data.beatmapsets);
            setResultsNum(r.data.total);
            console.log(r.data)
        }).catch((e) => {
            console.error(e)
        }).finally(() => {
            setSearching(false)
        })
    }

    return (
        <div style={{width: 1600}} className="shadow backgroundColor align-self-center d-flex">
            <div className="flex-grow-1 p-4">
                <div className="p-4 midColor rounded mb-3 d-flex flex-column gap-3">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="h2">Beatmap Search:</div>
                        <div className="h5">{resultsNum.toLocaleString()} results</div>
                    </div>
                    <div className="row darkestColor rounded p-3">
                        <div className="col-3">
                            <div className="mb-2 text-center">Title:</div>
                            <input type="text" className="form-control flex-grow-1 me-2 darkColor border-0 text-center"
                                   placeholder="..." autoFocus={true}
                                   onChange={(e) => setTitle(e.target.value)}/>
                        </div>
                        <div className="col-3">
                            <div className="mb-2 text-center">Artist:</div>
                            <input type="text" className="form-control flex-grow-1 me-2 darkColor border-0 text-center"
                                   placeholder="..."
                                   onChange={(e) => setArtist(e.target.value)}/>
                        </div>
                        <div className="col-3">
                            <div className="mb-2 text-center">Mapper:</div>
                            <input type="text" className="form-control flex-grow-1 me-2 darkColor border-0 text-center"
                                   placeholder="..."
                                   onChange={(e) => setMapper(e.target.value)}/>
                        </div>
                        <div className="col-3">
                            <div className="mb-2 text-center">Difficulty Name:</div>
                            <input type="text" className="form-control flex-grow-1 me-2 darkColor border-0 text-center"
                                   placeholder="..."
                                   onChange={(e) => setDiff(e.target.value)}/>
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
                                                step={1}
                                                onChange={(e, v) => setBpm(v as number[])}
                                                value={bpm}/>
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
                                                step={0.01}
                                                onChange={(e, v) => setSR(v as number[])}
                                                value={sr}/>
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
                                                step={1}
                                                onChange={(e, v) => setLength(v as number[])}
                                                value={length}/>
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
                                                step={0.01}
                                                onChange={(e, v) => setAR(v as number[])}
                                                value={ar}/>
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
                                                step={0.01}
                                                onChange={(e, v) => setCS(v as number[])}
                                                value={cs}/>
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
                                                step={0.01}
                                                onChange={(e, v) => setHP(v as number[])}
                                                value={hp}/>
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
                                            step={0.01}
                                            onChange={(e, v) => setOD(v as number[])}
                                            value={od}
                                        />
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
                                    <button type="button" className="btn text-black fw-bold border-0 darkenOnHover"
                                            disabled={section === thing} key={index + 1}
                                            onClick={() => setSection(thing)}
                                            style={{backgroundColor: (colors.beatmap as any)[thing]}}>
                                        {thing}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="darkestColor rounded p-3 d-flex flex-column gap-2 flex-grow-1">
                            <div>Mode:</div>
                            <div className="d-flex flex-row flex-wrap gap-2" role="group">
                                {songModes.map((thing: GameModeType, index: number) =>
                                    <button type="button" className="btn accentColor border-0 darkenOnHover"
                                            disabled={mode === thing} key={index + 1}
                                            onClick={() => setMode(thing)}>
                                        {thing}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="darkestColor rounded p-3 d-flex flex-column gap-2">
                        <div>Genre:</div>
                        <div className="d-flex flex-row flex-wrap gap-2" role="group">
                            {songGenres.map((thing: SongGenreType, index: number) =>
                                <button type="button" className="btn accentColor border-0 darkenOnHover"
                                        disabled={genre === thing} key={index + 1}
                                        onClick={() => setGenre(thing)}>
                                    {thing}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="darkestColor rounded p-3 d-flex flex-column gap-2">
                        <div>Language:</div>
                        <div className="d-flex flex-row flex-wrap gap-2" role="group">
                            {songLanguages.map((thing: SongLanguageType, index: number) =>
                                <button type="button" className="btn accentColor border-0 darkenOnHover"
                                        disabled={language === thing} key={index + 1}
                                        onClick={() => setLanguage(thing)}>
                                    {thing}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row p-0 gap-2 justify-content-center">
                    <Spinner animation="border" role="status" hidden={!searching} className="mx-auto">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    {results.map((set: BeatmapSet, index: number) =>
                        <BeatmapsetCard key={index + 1} data={set} index={index}/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BeatmapsPage;