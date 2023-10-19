import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { PlayerStoreInterface, playerStore } from "../../resources/global/tools";
import { addDefaultSrc, secondsToTime } from "../../resources/global/functions";
import { Beatmap, BeatmapSet } from "../../resources/interfaces/beatmapset";
import { Score } from "../../resources/interfaces/score";

import BeatmapsetScoreCard from "./BeatmapsetScoreCard";
import DiffIcon from "./b_comp/DiffIcon";
import StatusBadge from "./b_comp/StatusBadge";
import ModIcon from "../c_scores/s_comp/ModIcon";
import { FaHeadphonesAlt, FaDownload, FaFileDownload, FaStar, FaRegClock, FaItunesNote, FaMicrophoneAlt } from "react-icons/fa";
import fina from "../../helpers/fina";
import { useStats } from "../../resources/hooks/scoreHooks";

interface BeatmapsetPageProps {
  setId: number;
  diffId: number | undefined;
}

interface accInt {
  acc: number,
  geki: number,
  x300: number,
  katu: number,
  x100: number,
  x50: number,
  xMiss: number,
}

const BeatmapsetPage = (props: BeatmapsetPageProps) => {
  const play = playerStore((state: PlayerStoreInterface) => state.play);

  const beatmapset = useSet(props.setId, props.diffId);
  const [diff, setDiff] = useState<Beatmap | undefined>();
  const scores: Score[] = useScore(diff);

  const totalNotes: number = useMemo(() => {
    if (!diff) return 0;
    return diff.count_circles + diff.count_sliders + diff.count_spinners;
  }, [diff]);

  const ACC_INITIAL: accInt = useMemo(() => ({
    acc: 100,
    geki: 0,
    x300: totalNotes,
    katu: 0,
    x100: 0,
    x50: 0,
    xMiss: 0
  }), [diff]);

  const [acc, setAcc] = useState<number>(100);

  const [mods, setMods] = useState<string[]>([]);

  const stats = useStats(diff, acc, mods);

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
              <div className="flex flex-col gap-3 p-3 rounded-xl bg-custom-700">
                <div className="flex flex-row gap-2 p-4 rounded-lg drop-shadow-md bg-custom-950">
                  <DiffIcon setId={beatmapset.id} diffId={diff.id}
                    size={24} mode={diff.mode} diff={diff.difficulty_rating} name={diff.version} />
                  <div>{diff.version}</div>
                </div>
                <div className="flex flex-col gap-4 p-4 rounded-lg drop-shadow-md bg-custom-950">
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
                    <progress className="justify-between progress progress-custom"
                      value={stats.ar} max="11"></progress>
                    <div className="text-start">{stats.ar}</div>
                  </div>
                  <div className="flex flex-row gap-3 justify-between items-center">
                    <div className="text-end">CS:</div>
                    <progress className="progress progress-custom"
                      value={stats.cs} max="11"></progress>
                    <div className="text-start">{stats.cs}</div>
                  </div>
                  <div className="flex flex-row gap-3 justify-between items-center">
                    <div className="text-end">OD:</div>
                    <progress className="progress progress-custom"
                      value={stats.od} max="11"></progress>
                    <div className="text-start">{stats.od}</div>
                  </div>
                  <div className="flex flex-row gap-3 justify-between items-center">
                    <div className="text-end">HP:</div>
                    <progress className="progress progress-custom"
                      value={stats.hp} max="11"></progress>
                    <div className="text-start">{stats.hp}</div>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap gap-2 justify-center items-center p-4 rounded-lg drop-shadow-md bg-custom-950">
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

  function useSet(setId: number, diffId: number | undefined) {
    const [beatmapset, setBeatmapset] = useState<BeatmapSet | undefined>();

    useEffect(() => {
      getBeatmap();
    }, [setId])

    async function getBeatmap() {
      try {
        const d = await fina.post('/beatmapset', { setId: setId });
        setBeatmapset(d);
        if (!d) return;
        if (d.beatmaps.length < 1) return;
        let diffId;
        if (diffId) {
          let i = 0;
          for (const b of d.beatmaps) {
            if (b.id === diffId) {
              i = b.id;
              break;
            }
          }
          diffId = d.beatmaps[i]?.id;
        } else {
          diffId = d.beatmaps[0].id;
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
      if (!diff) return;
      getLeaderboards(diff)
    }, [diff])

    async function getLeaderboards(diff: Beatmap) {
      try {
        const d: Score[] = await fina.post('/beatmapscores', {
          id: diff.id,
          mode: diff.mode,
        });
        setLeaderboards(d);
      } catch (err) {
        console.error(err);
      }
    }
    return leaderboards;
  }
}

export default BeatmapsetPage;

