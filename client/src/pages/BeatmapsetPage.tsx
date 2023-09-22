import React, { useEffect, useState } from "react";
import axios from "../resources/axios-config";
import { Beatmap, BeatmapSet } from "../resources/interfaces/beatmapset";
import DiffIcon from "../components/DiffIcon";
interface BeatmapsetPageProps {
  setId: number;
}
const BeatmapsetPage = (props: BeatmapsetPageProps) => {

  const [beatmapset, setBeatmapset] = useState<BeatmapSet | undefined>();

  useEffect(() => {
    getBeatmap(props.setId);
  }, [props.setId])

  async function getBeatmap(id: number) {
    try {
      const res = await axios.post('/beatmapset', { setId: id });
      const data = res.data;
      setBeatmapset(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!beatmapset) return (<div></div>);

  return (
    <div>
      <div style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${beatmapset.covers["card@2x"]})`, backgroundSize: "cover", backgroundPosition: 'center' }}>
        <div style={{ backdropFilter: "blur(2px)" }}
          className="flex flex-col p-8">
            <div className="text-xl">{beatmapset.title}</div>
            <div className="flex flex-row flex-wrap">
              {beatmapset.beatmaps.map((obj : Beatmap, index: number) => 
                <DiffIcon key={index} mode={obj.mode} name={obj.version} diff={obj.difficulty_rating} size={24}/>
              )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default BeatmapsetPage; 
