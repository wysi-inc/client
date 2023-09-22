import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { GiMusicalNotes } from "react-icons/gi";

import axios from "../resources/axios-config";
import DiffIcon from "../components/DiffIcon";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import { Beatmap, BeatmapSet } from "../resources/interfaces/beatmapset";
import { HiOutlineClock } from "react-icons/hi";
import { HiMiniMusicalNote, HiMiniStar } from "react-icons/hi2";
import moment from "moment";

interface BeatmapsetPageProps {
  setId: number;
  diffId: number | undefined;
}
const BeatmapsetPage = (props: BeatmapsetPageProps) => {

  const [beatmapset, setBeatmapset] = useState<BeatmapSet | undefined>();
  const [diff, setDiff] = useState<Beatmap | undefined>();

  useEffect(() => {
    getBeatmap(props.setId);
  }, [props.setId])

  useEffect(() => {
    if (!beatmapset) return;
    let diffId;
    if (!props.diffId) {
      setDiff(beatmapset.beatmaps[0]);
    } else {
      beatmapset.beatmaps.map((beat) => {
        if (beat.id === props.diffId) {
          diffId = beat.id;
          setDiff(beat);
        }
        return '';
      });
    }
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

  return (
    <div style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${beatmapset.covers["card@2x"]}) center / cover no-repeat` }}>
      <div style={{ backdropFilter: "blur(2px)" }}
        className="flex flex-col p-8 gap-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-6 col-span-2">
            <div className="flex flex-row gap-6">
              <img src={`https://assets.ppy.sh/beatmaps/${beatmapset.id}/covers/list.jpg?${beatmapset.id}`}
                onError={addDefaultSrc}
                alt="cover" className="rounded-lg" loading="lazy"
                style={{ width: 100, objectFit: 'cover' }} />
              <div className="flex flex-col gap-1 grow">
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
              </div>
            </div>
            <div className="flex flex-row flex-wrap p-2 gap-2 rounded-lg" style={{ backgroundColor: '#ffffff22' }}>
              {beatmapset.beatmaps.sort((a, b) => {
                if (a.mode === b.mode) {
                  return a.difficulty_rating - b.difficulty_rating;
                } else {
                  return a.mode_int - b.mode_int;
                }
              }).map((beatmap: Beatmap, index: number) => {
                return <DiffIcon key={index + 1} diff={beatmap.difficulty_rating} size={24} setId={beatmap.beatmapset_id} diffId={beatmap.id}
                  mode={beatmap.mode} name={beatmap.version} />
              })}
            </div>
            <div className="flex flex-row gap-3">
              <div>{moment(beatmapset.submitted_date).format('DD MMM YYYY')}</div>
            </div>
            <div className="flex flex-row gap-2">
              <img src={`https://a.ppy.sh/${beatmapset.user_id}`} className="rounded-md w-14 object-cover" alt="img" loading="lazy" />
              <div className="flex flex-col gap-2">
                <div className="text-xl">{beatmapset.creator}</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-3 gap-3 bg-accent-700 flex flex-col">
            {diff &&
              <>
                <div className="bg-accent-8w00 p-2 rounded-lg flex flex-row gap-2">
                  <DiffIcon setId={beatmapset.id} diffId={diff.id}
                    size={24} mode={diff.mode} diff={diff.difficulty_rating} name={diff.version} />
                  <div>{diff.version}</div>
                </div>
                <div className="bg-accent-950 p-4 rounded-lg flex flex-col gap-4">
                  <div className="flex flex-row gap-8 items-center justify-center">
                    <div className="flex flex-row gap-1 items-center">
                      <HiMiniStar />
                      <div>{diff.difficulty_rating}</div>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                      <HiOutlineClock />
                      <div>{secondsToTime(diff.total_length)}</div>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                      <HiMiniMusicalNote />
                      <div>{diff.bpm}bpm</div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-3 items-center">
                    <div className="text-end">AR:</div>
                    <progress className="progress progress-accent justify-between"
                      value={diff.ar} max="10"></progress>
                    <div className="text-start">{diff.ar}</div>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-between">
                    <div className="text-end">CS:</div>
                    <progress className="progress progress-accent"
                      value={diff.cs} max="10"></progress>
                    <div className="text-start">{diff.cs}</div>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-between">
                    <div className="text-end">OD:</div>
                    <progress className="progress progress-accent"
                      value={diff.accuracy} max="10"></progress>
                    <div className="text-start">{diff.accuracy}</div>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-between">
                    <div className="text-end">HP:</div>
                    <progress className="progress progress-accent"
                      value={diff.drain} max="10"></progress>
                    <div className="text-start">{diff.drain}</div>
                  </div>
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
