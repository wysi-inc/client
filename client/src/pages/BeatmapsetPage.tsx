import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { GiMusicalNotes } from "react-icons/gi";

import axios from "../resources/axios-config";
import DiffIcon from "../components/DiffIcon";
import { addDefaultSrc, getModsInt, secondsToTime } from "../resources/functions";
import { Beatmap, BeatmapSet } from "../resources/interfaces/beatmapset";
import { HiOutlineClock } from "react-icons/hi";
import { HiMiniMusicalNote, HiMiniStar } from "react-icons/hi2";
import moment from "moment";
import ModIcon from "../components/ModIcon";
import { modsInt } from "../resources/store";

interface BeatmapsetPageProps {
  setId: number;
  diffId: number | undefined;
}
const BeatmapsetPage = (props: BeatmapsetPageProps) => {

  const [beatmapset, setBeatmapset] = useState<BeatmapSet | undefined>();
  const [diff, setDiff] = useState<Beatmap | undefined>();

  const [acc, setAcc] = useState<number>(100);
  const [mods, setMods] = useState<string[]>([]);
  const [PP, setPP] = useState<number>(0);

  const [OD, setOD] = useState<number | undefined>();
  const [AR, setAR] = useState<number | undefined>();
  const [CS, setCS] = useState<number | undefined>();
  const [HP, setHP] = useState<number | undefined>();

  const [SR, setSR] = useState<number | undefined>();
  const [LEN, setLEN] = useState<number | undefined>();
  const [BPM, setBPM] = useState<number | undefined>();

  useEffect(() => {
    getBeatmap(props.setId);
  }, [props.setId])

  useEffect(() => {
    if (!diff) return;
    getThings(diff);
  }, [diff, mods])

  async function getThings(b: Beatmap) {
    try {
      const url = `https://catboy.best/api/meta/${b.id}?misses=0&acc=${acc}&mods=${getModsInt(mods)}`;
      const d = (await axios.post('/proxy', { url: url })).data;
      setPP(Math.round(d.pp[100].pp));
      setSR(d.difficulty.stars.toFixed(2));
      setBPM(d.map.bpm);
      setLEN(b.total_length)
      setOD(d.map.od);
      setAR(d.map.ar);
      setHP(d.map.hp);
      setCS(d.map.cs);
      if (mods.includes('DT')) setLEN(b.total_length * 0.75);
      else if (mods.includes('HT')) setLEN(b.total_length * 1.5);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!beatmapset) return;
    const beat = beatmapset.beatmaps.filter(b => b.id == props.diffId)[0] || beatmapset.beatmaps[0]
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
      console.log(data);
      if (data.beatmaps.length < 1) return;
      let diffId;
      if (props.diffId) {
        let i = 0;
        data.beatmaps.map((beat) => {
          if (beat.id === props.diffId) {
            i = beat.id;
          }
        });
        setDiff(data.beatmaps[i]);
        diffId = data.beatmaps[i].id;
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

  return (
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
                  <div>Submited at {moment(typeof beatmapset.submitted_date === "number" ? beatmapset.submitted_date * 1000 : beatmapset.submitted_date).format('DD MMM YYYY')}</div>
                </div>
                <div className="flex flex-row gap-2">
                  <img src={`https://a.ppy.sh/${beatmapset.user_id}`} className="rounded-md w-14 object-cover" alt="img" loading="lazy" />
                  <div className="flex flex-col gap-2">
                    <Link to={`/users/${beatmapset.user_id}`} className="text-xl">{beatmapset.creator}</Link>
                  </div>
                </div>
              </div>
              <div className="col-span-3 flex flex-col gap-3 grow">
                <div className="text-3xl">
                  {beatmapset.title}
                </div>
                <div className="text-xl flex flex-row gap-2 items-center">
                  <div>
                    <GiMusicalNotes />
                  </div>
                  <div>
                    {beatmapset.artist}
                  </div>
                </div>
                <div className="flex flex-row flex-wrap p-2 gap-1 rounded-lg" style={{ backgroundColor: '#ffffff22' }}>
                  {beatmapset.beatmaps.sort((a, b) => a.mode === b.mode ?
                    a.difficulty_rating - b.difficulty_rating : a.mode_int - b.mode_int
                  ).map((b: Beatmap, i: number) =>
                    <div className='h-8 w-8 flex items-center justify-center rounded-md' style={{ outline: `#ffffff99 ${diff?.id === b.id ? 'solid 2px' : 'none'}` }}>
                      <DiffIcon key={i} size={24} mode={b.mode}
                        diff={b.difficulty_rating} name={b.version}
                        setId={b.beatmapset_id} diffId={b.id} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-3 gap-3 bg-accent-700 flex flex-col">
            {diff &&
              <>
                <div className="p-4 bg-accent-950 rounded-lg drop-shadow-md flex flex-row gap-2">
                  <DiffIcon setId={beatmapset.id} diffId={diff.id}
                    size={24} mode={diff.mode} diff={diff.difficulty_rating} name={diff.version} />
                  <div>{diff.version}</div>
                </div>
                <div className="p-4 bg-accent-950 rounded-lg drop-shadow-md flex flex-col gap-4">
                  <div className="flex flex-row flex-wrap gap-8 items-center justify-center">
                    <div className="flex flex-row gap-1 items-center">
                      <HiMiniStar />
                      <div>{SR ? SR : diff.difficulty_rating}</div>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                      <HiOutlineClock />
                      <div>{secondsToTime(LEN ? LEN : diff.total_length)}</div>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                      <HiMiniMusicalNote />
                      <div>{Math.round(BPM ? BPM : diff.bpm)}bpm</div>
                    </div>
                    <div>
                      {PP}pp
                    </div>
                  </div>
                  <div className="flex flex-row gap-3 items-center">
                    <div className="text-end">AR:</div>
                    <progress className="progress progress-accent justify-between"
                      value={AR ? AR : diff.ar} max="11"></progress>
                    <div className="text-start">{(AR ? AR : diff.ar).toFixed(1)}</div>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-between">
                    <div className="text-end">CS:</div>
                    <progress className="progress progress-accent"
                      value={CS ? CS : diff.cs} max="11"></progress>
                    <div className="text-start">{(CS ? CS : diff.cs).toFixed(1)}</div>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-between">
                    <div className="text-end">OD:</div>
                    <progress className="progress progress-accent"
                      value={OD ? OD : diff.accuracy} max="11"></progress>
                    <div className="text-start">{(OD ? OD : diff.accuracy).toFixed(1)}</div>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-between">
                    <div className="text-end">HP:</div>
                    <progress className="progress progress-accent"
                      value={HP ? HP : diff.drain} max="11"></progress>
                    <div className="text-start">{(HP ? HP : diff.drain).toFixed(1)}</div>
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
              </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeatmapsetPage; 
