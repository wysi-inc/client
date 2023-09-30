import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "../resources/axios-config";
import moment from "moment";
import { PlayerStoreInterface, playerStore } from "../resources/store/tools";
import { addDefaultSrc, getModsInt, secondsToTime } from "../resources/functions";
import { Beatmap, BeatmapSet } from "../resources/interfaces/beatmapset";
import { Score } from "../resources/interfaces/score";

import BeatmapsetScoreCard from "./BeatmapsetScoreCard";
import DiffIcon from "./b_comp/DiffIcon";
import StatusBadge from "./b_comp/StatusBadge";
import ModIcon from "../c_scores/s_comp/ModIcon";
import { FaHeadphonesAlt, FaDownload, FaFileDownload, FaStar, FaRegClock, FaItunesNote, FaMicrophoneAlt } from "react-icons/fa";

interface BeatmapsetPageProps {
  setId: number;
  diffId: number | undefined;
}

const BeatmapsetPage = (props: BeatmapsetPageProps) => {

  const play = playerStore((state: PlayerStoreInterface) => state.play);

  const beatmapset = useSet(props.setId, props.diffId);
  const [diff, setDiff] = useState<Beatmap | undefined>();
  const scores: Score[] = useScore(diff);

  const [acc, setAcc] = useState<number>(100);
  const [mods, setMods] = useState<string[]>([]);

  const stats = useStats(diff, mods, acc);

  useEffect(() => {
    if (!beatmapset) return;
    const beat = beatmapset.beatmaps.filter(b => b.id === props.diffId)[0] || beatmapset.beatmaps[0]
    const diffId = beat.id
    setDiff(beat)
    window.history.replaceState({}, '', `/beatmaps/${props.setId}/${diffId}`);
  }, [beatmapset, props.setId, props.diffId])


  if (!beatmapset) return (<></>);

  const mn: string[] = ['HR', 'DT', 'HD', 'FL', 'EZ', 'HT']

  return (
    <>
      <div style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://assets.ppy.sh/beatmaps/${beatmapset.id}/covers/cover.jpg?${beatmapset.id}) center / cover no-repeat` }}>
        <div style={{ backdropFilter: "blur(2px)" }}
          className="flex flex-col gap-6 p-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col col-span-2 gap-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="flex flex-col col-span-1 gap-3">
                  <img src={`https://assets.ppy.sh/beatmaps/${beatmapset.id}/covers/list@2x.jpg?${beatmapset.id}`}
                    onError={addDefaultSrc}
                    alt="cover" className="rounded-lg" loading="lazy"
                    style={{ height: 138, objectFit: 'cover' }} />
                  <div className="flex flex-row gap-3">
                    <div>Submited on {moment(typeof beatmapset.submitted_date === "number" ? beatmapset.submitted_date * 1000 : beatmapset.submitted_date).format('DD MMM YYYY')}</div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <img src={`https://a.ppy.sh/${beatmapset.user_id}`} className="object-cover w-14 rounded-md" alt="img" loading="lazy" />
                    <div className="flex flex-col gap-2">
                      <Link to={`/users/${beatmapset.user_id}`} className="text-xl">{beatmapset.creator}</Link>
                      <div className="me-auto"><StatusBadge status={beatmapset.status} /></div>
                    </div>
                  </div>
                  <div className="join grow">
                    <div className="flex tooltip tooltip-bottom grow" data-tip="listen">
                      <button className="join-item btn btn-secondary grow"
                        onClick={() => play(beatmapset.id, beatmapset.title, beatmapset.artist)}>
                        <FaHeadphonesAlt />
                      </button>
                    </div>
                    <a href={`https://catboy.best/d/${beatmapset.id}`}
                      className="flex tooltip tooltip-bottom grow" data-tip="download">
                      <button className="join-item btn btn-secondary grow">
                        <FaDownload />
                      </button>
                    </a>
                    <a href={`osu://b/${diff?.id}`}
                      className="flex tooltip tooltip-bottom grow" data-tip="osu!direct">
                      <button className="join-item btn btn-secondary grow">
                        <FaFileDownload />
                      </button>
                    </a>
                  </div>
                </div>
                <div className="flex flex-col col-span-3 gap-3 grow">
                  <div className="text-3xl">
                    {beatmapset.title}
                  </div>
                  <div className="flex flex-row gap-2 items-center text-xl">
                    <div>
                      <FaMicrophoneAlt />
                    </div>
                    <div>
                      {beatmapset.artist}
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap gap-1 p-2 rounded-lg" style={{ backgroundColor: '#ffffff22' }}>
                    {beatmapset.beatmaps.sort((a, b) => a.mode === b.mode ?
                      a.difficulty_rating - b.difficulty_rating : a.mode_int - b.mode_int
                    ).map((b: Beatmap, i: number) =>
                      <div key={i} className='flex justify-center items-center w-8 h-8 rounded-md' style={{ outline: `#ffffff99 ${diff?.id === b.id ? 'solid 2px' : 'none'}` }}>
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
              <div className="flex flex-col gap-3 p-3 rounded-xl bg-accent-700">
                <div className="flex flex-row gap-2 p-4 rounded-lg drop-shadow-md bg-accent-950">
                  <DiffIcon setId={beatmapset.id} diffId={diff.id}
                    size={24} mode={diff.mode} diff={diff.difficulty_rating} name={diff.version} />
                  <div>{diff.version}</div>
                </div>
                <div className="flex flex-col gap-4 p-4 rounded-lg drop-shadow-md bg-accent-950">
                  <div className="flex flex-row flex-wrap gap-8 justify-center items-center">
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
                    <progress className="justify-between progress progress-accent"
                      value={stats.ar} max="11"></progress>
                    <div className="text-start">{stats.ar}</div>
                  </div>
                  <div className="flex flex-row gap-3 justify-between items-center">
                    <div className="text-end">CS:</div>
                    <progress className="progress progress-accent"
                      value={stats.cs} max="11"></progress>
                    <div className="text-start">{stats.cs}</div>
                  </div>
                  <div className="flex flex-row gap-3 justify-between items-center">
                    <div className="text-end">OD:</div>
                    <progress className="progress progress-accent"
                      value={stats.od} max="11"></progress>
                    <div className="text-start">{stats.od}</div>
                  </div>
                  <div className="flex flex-row gap-3 justify-between items-center">
                    <div className="text-end">HP:</div>
                    <progress className="progress progress-accent"
                      value={stats.hp} max="11"></progress>
                    <div className="text-start">{stats.hp}</div>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap gap-2 justify-center items-center p-4 rounded-lg drop-shadow-md bg-accent-950">
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
      </div>
      <div className="flex flex-col gap-2 p-3">
        <table className="border-separate border-spacing-y-1">
          <thead>
            <tr>
              <th className="text-start"></th>
              <th className="text-start"></th>
              <th className="text-start"></th>
              <th className="text-start">Score</th>
              <th className="text-start">PP</th>
              <th className="text-start">Combo</th>
              <th className="text-start">Acc</th>
              <th className="text-start">Hits</th>
              <th className="text-start">Grade</th>
              <th className="text-start">Mods</th>
              <th className="text-start">Date</th>
            </tr>
          </thead>
          <tbody className="mt-3">
            {scores.map((s: Score, i: number) =>
              <BeatmapsetScoreCard key={s.id} score={s} index={i + 1} />
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default BeatmapsetPage;

function useSet(setId: number, diffId: number | undefined) {
  const [beatmapset, setBeatmapset] = useState<BeatmapSet | undefined>();

  useEffect(() => {
    getBeatmap();
  }, [setId])

  async function getBeatmap() {
    try {
      const res = await axios.post('/beatmapset', { setId: setId });
      const data: BeatmapSet = res.data;
      setBeatmapset(data);
      if (!data) return;
      if (data.beatmaps.length < 1) return;
      let diffId;
      if (diffId) {
        let i = 0;
        for (const b of data.beatmaps) {
          if (b.id === diffId) {
            i = b.id;
            break;
          }
        }
        diffId = data.beatmaps[i]?.id;
      } else {
        diffId = data.beatmaps[0].id;
      }
      window.history.replaceState({}, '', `/beatmaps/${setId}/${diffId}`);
    } catch (err) {
      console.error(err);
    }
  }
  return beatmapset;
}

function useScore(diff: Beatmap | undefined) {

  const [leaderboards, setLeaderboards] = useState<Score[]>([]);

  useEffect(() => {
    getLeaderboards()
  }, [diff])

  async function getLeaderboards() {
    if (!diff) return;
    try {
      const r = await axios.post('/beatmapscores', {
        id: diff.id,
        mode: diff.mode,
      })
      const sc: Score[] = r.data;
      setLeaderboards(r.data)
    } catch (err) {
      console.error(err);
    }
  }
  return leaderboards;
}

function useStats(diff: Beatmap | undefined, mods: string[], acc: number) {
  const INITIAL_SET_STATS = {
    pp: 0,
    bpm: 0,
    len: 0,
    sr: 0,
    ar: 0,
    cs: 0,
    od: 0,
    hp: 0,
  }

  const [stats, setStats] = useState(INITIAL_SET_STATS);

  useEffect(() => {
    getStats();
  }, [diff, mods])

  async function getStats() {
    if (!diff) return;
    try {
      const d = await (await fetch(`https://catboy.best/api/meta/${diff.id}?misses=0&acc=${acc}&mods=${getModsInt(mods)}`)).json();
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

  return stats;
}