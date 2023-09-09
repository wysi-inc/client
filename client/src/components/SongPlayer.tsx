import React, {useState} from "react";
import {playerStore, PlayerStoreInterface} from "../resources/store";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const SongPlayer = () => {
    const startVolume: number = 20;

    const play = playerStore((state: PlayerStoreInterface) => state.play);
    const mp3: string = playerStore((state: PlayerStoreInterface) => state.mp3);
    const title: string = playerStore((state: PlayerStoreInterface) => state.title);
    const artist: string = playerStore((state: PlayerStoreInterface) => state.artist);
    const [show, setShow] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(startVolume);
    return (
        <div className="player mx-auto sticky-bottom" hidden={!show}>
            <div className="bg shadow-lg rounded-top overflow-hidden">
                <div className="py-2 titleBox d-flex flex-row align-items-center justify-content-between">
                    <div className="d-flex flex-row px-3 align-items-center gap-3">
                        <i className="bi bi-headphones"></i>
                        <div className="d-inline-block text-truncate" style={{width: 400}}>
                            {artist} - {title}
                        </div>
                    </div>
                    <button className="btn" onClick={() => {
                        play(0, '', '')
                    }}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <AudioPlayer
                    src={mp3}
                    volume={volume / 100}
                    showFilledVolume={true}
                    showSkipControls={false}
                    showJumpControls={false}
                    hasDefaultKeyBindings={false}
                    layout={'horizontal-reverse'}
                    autoPlay={true}
                    autoPlayAfterSrcChange={true}
                    onPlay={() => {
                        if (volume === 0) setVolume(startVolume);
                        setShow(true);
                    }}
                    onPlayError={() => setShow(false)}
                    onEnded={() => {
                        play(0, '', '')
                    }}
                />
            </div>
        </div>
    )
}

export default SongPlayer;