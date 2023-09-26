import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import axios from "../resources/axios-config";
import DiffIcon from "../components/DiffIcon";
import { addDefaultSrc, getModsInt, secondsToTime } from "../resources/functions";
import { Beatmap, BeatmapSet } from "../resources/interfaces/beatmapset";
import moment from "moment";
import ModIcon from "../components/ModIcon";
import { GameModeType } from "../resources/types";
import { Score } from "../resources/interfaces/score";
import BeatmapsetScoreCard from "../cards/BeatmapsetScoreCard";
import { FaHeadphonesAlt, FaDownload, FaFileDownload, FaStar, FaRegClock, FaItunesNote, FaMicrophoneAlt } from "react-icons/fa";
import { PlayerStoreInterface, playerStore } from "../resources/store";
import StatusBadge from "../components/StatusBadge";
import { Prev } from "react-bootstrap/esm/PageItem";

interface BeatmapsetPageProps {
  setId: number;
  diffId: number | undefined;
}
const BeatmapsetPage = (props: BeatmapsetPageProps) => {

  const play = playerStore((state: PlayerStoreInterface) => state.play);

  const [beatmapset, setBeatmapset] = useState<BeatmapSet | undefined>();
  const [diff, setDiff] = useState<Beatmap | undefined>();
  const [scores, setScores] = useState<Score[]>([]);

  const [acc, setAcc] = useState<number>(100);
  const [mods, setMods] = useState<string[]>([]);

  const INITIAL_SET_STATS = {
    pp: 0,
    bpm: diff?.bpm ? diff.bpm : 0,
    len: diff?.total_length ? diff.total_length : 0,
    sr: diff?.difficulty_rating ? diff.difficulty_rating : 0,
    ar: diff?.ar ? diff.ar : 0,
    cs: diff?.cs ? diff.cs : 0,
    od: diff?.accuracy ? diff.accuracy : 0,
    hp: diff?.drain ? diff.drain : 0,
  }

  const [stats, setStats] = useState(INITIAL_SET_STATS);

  useEffect(() => {
    getBeatmap(props.setId);
  }, [props.setId])

  useEffect(() => {
    if (!diff) return;
    getStats();
    getLeaderboards(diff.id, diff.mode)
  }, [diff, mods])

  async function getStats() {
    if (!diff) return;
    try {
      const d = (await axios.post('/proxy', {
        url: `https://catboy.best/api/meta/${diff.id}?misses=0&acc=${acc}&mods=${getModsInt(mods)}`
      })).data;
      setStats(prev => ({ ...prev, pp: Math.round(d.pp[100].pp) }))
      setStats(prev => ({ ...prev, sr: d.difficulty.stars.toFixed(2) }))
      setStats(prev => ({ ...prev, bpm: Math.round(d.map.bpm) }))

      setStats(prev => ({ ...prev, ar: d.map.ar.toFixed(1) }))
      setStats(prev => ({ ...prev, cs: d.map.cs.toFixed(1) }))
      setStats(prev => ({ ...prev, od: d.map.od.toFixed(1) }))
      setStats(prev => ({ ...prev, hp: d.map.hp.toFixed(1) }))

      if (mods.includes('DT')) setStats(prev => ({ ...prev, len: diff.total_length * 0.75 }));
      else if (mods.includes('HT')) setStats(prev => ({ ...prev, len: diff.total_length * 1.5 }));
      else setStats(prev => ({ ...prev, len: diff.total_length }));
    } catch (err) {
      console.error(err);
    }
  }

  async function getLeaderboards(id: number, mode: GameModeType) {
    if (!beatmapset) return;
    try {
      const r = await axios.post('/proxy', {
        url: `https://osu.ppy.sh/beatmaps/${id}/scores?mode=${mode}&type=global`
      })
      const sc: Score[] = r.data.scores;
      for (let i = 0; i < sc.length; i++) {
        sc[i].beatmapset = beatmapset;
      }
      setScores(r.data.scores)
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!beatmapset) return;
    const beat = beatmapset.beatmaps.filter(b => b.id === props.diffId)[0] || beatmapset.beatmaps[0]
    const diffId = beat.id
    setDiff(beat)
    window.history.replaceState({}, '', `/beatmaps/${props.setId}/${diffId}`);
  }, [beatmapset, props.setId, props.diffId])

  async function getBeatmap(id: number) {
    try {
      const res = await axios.post('/beatmapset', { setId: id });
      const data: BeatmapSet = res.data;
      setBeatmapset(data);
      if (!data) return;
      if (data.beatmaps.length < 1) return;
      let diffId;
      if (props.diffId) {
        let i = 0;
        for (const b of data.beatmaps) {
          if (b.id === props.diffId) {
            i = b.id;
            break;
          }
        }
        setDiff(data.beatmaps[i]);
        diffId = data.beatmaps[i]?.id;
      } else {
        setDiff(data.beatmaps[0]);
        diffId = data.beatmaps[0].id;
      }
      window.history.replaceState({}, '', `/beatmaps/${props.setId}/${diffId}`);
    } catch (err) {
      console.error(err);
    }
  }

  if (!beatmapset) return (<div></div>);

  const mn: string[] = ['HR', 'DT', 'HD', 'FL', 'EZ', 'HT']

  function playSong() {
    if (!beatmapset) return;
    play(beatmapset.id, beatmapset.title, beatmapset.artist);
  }

  return (
    <>
      <div style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://assets.ppy.sh/beatmaps/${beatmapset.id}/covers/cover.jpg?${beatmapset.id}) center / cover no-repeat` }}>
        <div style={{ backdropFilter: "blur(2px)" }}
          className="flex flex-col p-8 gap-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-6 col-span-2">
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-1 flex flex-col gap-3">
                  <img src={`https://assets.ppy.sh/beatmaps/${beatmapset.id}/covers/list@2x.jpg?${beatmapset.id}`}
                    onError={addDefaultSrc}
                    alt="cover" className="rounded-lg" loading="lazy"
                    style={{ height: 138, objectFit: 'cover' }} />
                  <div className="flex flex-row gap-3">
                    <div>Submited on {moment(typeof beatmapset.submitted_date === "number" ? beatmapset.submitted_date * 1000 : beatmapset.submitted_date).format('DD MMM YYYY')}</div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <img src={`https://a.ppy.sh/${beatmapset.user_id}`} className="rounded-md w-14 object-cover" alt="img" loading="lazy" />
                    <div className="flex flex-col gap-2">
                      <Link to={`/users/${beatmapset.user_id}`} className="text-xl">{beatmapset.creator}</Link>
                      <div className="me-auto"><StatusBadge status={beatmapset.status} /></div>
                    </div>
                  </div>
                  <div className="join grow">
                    <div className="tooltip tooltip-bottom grow flex" data-tip="listen">
                      <button className="join-item btn btn-secondary grow"
                        onClick={playSong}>
                        <FaHeadphonesAlt />
                      </button>
                    </div>
                    <a href={`https://catboy.best/d/${beatmapset.id}`}
                      className="tooltip tooltip-bottom grow flex" data-tip="download">
                      <button className="join-item btn btn-secondary grow">
                        <FaDownload />
                      </button>
                    </a>
                    <a href={`osu://b/${diff?.id}`}
                      className="tooltip tooltip-bottom grow flex" data-tip="osu!direct">
                      <button className="join-item btn btn-secondary grow">
                        <FaFileDownload />
                      </button>
                    </a>
                  </div>
                </div>
                <div className="col-span-3 flex flex-col gap-3 grow">
                  <div className="text-3xl">
                    {beatmapset.title}
                  </div>
                  <div className="text-xl flex flex-row gap-2 items-center">
                    <div>
                      <FaMicrophoneAlt />
                    </div>
                    <div>
                      {beatmapset.artist}
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap p-2 gap-1 rounded-lg" style={{ backgroundColor: '#ffffff22' }}>
                    {beatmapset.beatmaps.sort((a, b) => a.mode === b.mode ?
                      a.difficulty_rating - b.difficulty_rating : a.mode_int - b.mode_int
                    ).map((b: Beatmap, i: number) =>
                      <div key={i} className='h-8 w-8 flex items-center justify-center rounded-md' style={{ outline: `#ffffff99 ${diff?.id === b.id ? 'solid 2px' : 'none'}` }}>
                        <DiffIcon size={24} mode={b.mode}
                          diff={b.difficulty_rating} name={b.version}
                          setId={b.beatmapset_id} diffId={b.id} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {diff &&
              <div className="rounded-xl p-3 gap-3 bg-accent-700 flex flex-col">
                <div className="p-4 bg-accent-950 rounded-lg drop-shadow-md flex flex-row gap-2">
                  <DiffIcon setId={beatmapset.id} diffId={diff.id}
                    size={24} mode={diff.mode} diff={diff.difficulty_rating} name={diff.version} />
                  <div>{diff.version}</div>
                </div>
                <div className="p-4 bg-accent-950 rounded-lg drop-shadow-md flex flex-col gap-4">
                  <div className="flex flex-row flex-wrap gap-8 items-center justify-center">
                    <div className="flex flex-row gap-1 items-center">
                      <FaStar />
                      <div>{stats.sr}</div>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                      <FaRegClock />
                      <div>{secondsToTime(stats.len)}</div>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                      <FaItunesNote />
                      <div>{stats.bpm}bpm</div>
                    </div>
                    <div>
                      {stats.pp}pp
                    </div>
                  </div>
                  <div className="flex flex-row gap-3 items-center">
                    <div className="text-end">AR:</div>
                    <progress className="progress progress-accent justify-between"
                      value={stats.ar} max="11"></progress>
                    <div className="text-start">{stats.ar}</div>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-between">
                    <div className="text-end">CS:</div>
                    <progress className="progress progress-accent"
                      value={stats.cs} max="11"></progress>
                    <div className="text-start">{stats.cs}</div>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-between">
                    <div className="text-end">OD:</div>
                    <progress className="progress progress-accent"
                      value={stats.od} max="11"></progress>
                    <div className="text-start">{stats.od}</div>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-between">
                    <div className="text-end">HP:</div>
                    <progress className="progress progress-accent"
                      value={stats.hp} max="11"></progress>
                    <div className="text-start">{stats.hp}</div>
                  </div>
                </div>
                <div className="p-4 bg-accent-950 rounded-lg drop-shadow-md flex flex-row flex-wrap gap-2 items-center justify-center">
                  <button className={`${mods.length > 0 && 'fakeDisabled'} darkenOnHover`}
                    onClick={() => setMods([])}><ModIcon size={24} acronym="NM" />
                  </button>
                  {mn.map((t, i) =>
                    <button key={i} className={`${!mods.includes(t) && 'fakeDisabled'} darkenOnHover`}
                      onClick={() => mods.includes(t) ? setMods(mods.filter(m => m !== t)) : setMods([...mods, t])}>
                      <ModIcon size={24} acronym={t} />
                    </button>
                  )}
                </div>
              </div>
            }
          </div>
        </div>
      </div >
      <div className="p-3 flex flex-col gap-2">
        {scores.map((s: Score, i: number) =>
          <BeatmapsetScoreCard key={s.id} score={s} index={i + 1} />
        )}
      </div>
    </>
  )
}

export default BeatmapsetPage; 
