import moment from "moment";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addDefaultSrc, isNumeric, secondsToTime } from "../../resources/global/functions";
import { PlayerStoreInterface, playerStore } from "../../resources/global/tools";
import { Beatmap, Beatmapset } from "../../resources/types/beatmapset";

import { FaDownload, FaFileDownload, FaHeadphonesAlt, FaItunesNote, FaMicrophoneAlt, FaRegClock, FaStar } from "react-icons/fa";
import { useQuery } from "react-query";
import fina from "../../helpers/fina";
import { useStats } from "../../resources/hooks/scoreHooks";
import Loading from "../../web/w_comp/Loading";
import ModIcon from "../scores/s_comp/ModIcon";
import BeatmapLeaderboards from "./b_comp/BeatmapLeaderboards";
import DiffIcon from "./b_comp/DiffIcon";
import StatusBadge from "./b_comp/StatusBadge";

//interface accInt {
//  acc: number,
//  geki: number,
//  x300: number,
//  katu: number,
//  x100: number,
//  x50: number,
//  xMiss: number,
//}

const BeatmapsetPage = () => {

  const play = playerStore((state: PlayerStoreInterface) => state.play);

  const { urlSetId } = useParams();
  const { urlDiffId } = useParams();

  const { data: beatmapset, status: beatmapsetStatus } = useQuery<Beatmapset>({
    queryKey: ['beatmapset', urlSetId],
    queryFn: () => getBeatmapset(),
  });

  const diffId = getDiffId(beatmapset, urlDiffId);

//  const totalNotes: number = 0;

//  const ACC_INITIAL: accInt = useMemo(() => ({
//    acc: 100,
//    geki: 0,
//    x300: totalNotes,
//    katu: 0,
//    x100: 0,
//    x50: 0,
//    xMiss: 0
//  }), [urlDiffId]);
//
//  const [acc, setAcc] = useState<number>(100);

  const [mods, setMods] = useState<string[]>([]);

  const diff = getDiff(beatmapset, diffId);
  const stats = useStats(diff, 100, mods);

  if (beatmapsetStatus === 'loading') return <Loading />;
  if (beatmapsetStatus === 'error') return <div>There was an error</div>;
  if (!beatmapset) return <></>;
  if (!diff) return <></>;

  if (!urlSetId) return <></>;
  if (!isNumeric(urlSetId)) return <></>;
  const setId: number = parseInt(urlSetId);

  console.log(beatmapset);


  window.history.replaceState({}, '', `/beatmaps/${urlSetId}/${diffId}`);

  const mn: string[] = ['HR', 'DT', 'HD', 'FL', 'EZ', 'HT']

  return (<>
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
                  <img src={`https://a.ppy.sh/${beatmapset.user_id}`} className="object-cover rounded-md w-14" alt="img" loading="lazy" />
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
                <div className="flex flex-row items-center gap-2 text-xl">
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
                    <div key={i} className='flex items-center justify-center w-8 h-8 rounded-md' style={{ outline: `#ffffff99 ${diff?.id === b.id ? 'solid 2px' : 'none'}` }}>
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
                <div className="flex flex-row flex-wrap items-center justify-center gap-8">
                  <div className="flex flex-row items-center gap-1">
                    <FaStar />
                    <div>{stats.sr}</div>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <FaRegClock />
                    <div>{secondsToTime(stats.len)}</div>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <FaItunesNote />
                    <div>{stats.bpm}bpm</div>
                  </div>
                  <div>
                    {stats.pp}pp
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <div className="text-end">AR:</div>
                  <progress className="justify-between progress progress-custom"
                    value={stats.ar} max="11"></progress>
                  <div className="text-start">{stats.ar}</div>
                </div>
                <div className="flex flex-row items-center justify-between gap-3">
                  <div className="text-end">CS:</div>
                  <progress className="progress progress-custom"
                    value={stats.cs} max="11"></progress>
                  <div className="text-start">{stats.cs}</div>
                </div>
                <div className="flex flex-row items-center justify-between gap-3">
                  <div className="text-end">OD:</div>
                  <progress className="progress progress-custom"
                    value={stats.od} max="11"></progress>
                  <div className="text-start">{stats.od}</div>
                </div>
                <div className="flex flex-row items-center justify-between gap-3">
                  <div className="text-end">HP:</div>
                  <progress className="progress progress-custom"
                    value={stats.hp} max="11"></progress>
                  <div className="text-start">{stats.hp}</div>
                </div>
              </div>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2 p-4 rounded-lg drop-shadow-md bg-custom-950">
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
          <BeatmapLeaderboards setId={setId} diffId={diffId} />
        </tbody>
      </table>
    </div>
  </>)

  function getBeatmapset() {
    return fina.post('/beatmapset', { setId: urlSetId });
  }

  function getDiffId(beatmapset: Beatmapset | undefined, diffId: string | undefined): number {
    if (!beatmapset) return 0;
    if (!diffId || !isNumeric(diffId)) return beatmapset.beatmaps[0].id;
    const id: number = parseInt(diffId);
    const findId = beatmapset.beatmaps.find((beatmap) => beatmap.id === id);
    if (!findId) return beatmapset.beatmaps[0].id;
    return id;
  }

  function getDiff(beatmapset: Beatmapset | undefined, diffId: number): Beatmap | undefined {
    if (!beatmapset) return undefined;
    return beatmapset.beatmaps.find((beatmap) => beatmap.id === diffId);
  }

}

export default BeatmapsetPage;
