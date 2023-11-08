import { useState } from "react";

import ReactAudioPlayer from 'react-h5-audio-player';

import { BsDisc } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';

import { playerStore, PlayerStoreInterface } from "../../resources/global/tools";

import 'react-h5-audio-player/lib/styles.css';

const SongPlayer = () => {
    const startVolume: number = 20;

    const end = playerStore((state: PlayerStoreInterface) => state.end);
    const mp3: string = playerStore((state: PlayerStoreInterface) => state.mp3);
    const title: string = playerStore((state: PlayerStoreInterface) => state.title);
    const artist: string = playerStore((state: PlayerStoreInterface) => state.artist);

    const [volume, setVolume] = useState<number>(startVolume);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    function onPlay() {
        if (volume < 1) setVolume(startVolume);
        setIsPlaying(true);
    }

    function onEnd() {
        end();
        setIsPlaying(false);
    }

    function onCloseButtonClick() {
        end();
        setIsPlaying(false);
    }

    return (
        <div className={`player sticky inset-x-0 bottom-0 mx-auto overflow-hidden rounded-t-lg bg-custom-800 shadow-lg ${isPlaying ? 'visible' : 'hidden'}`}>
            <div className="titleBox justify-content-between flex flex-row items-center py-2">
                <div className="flex flex-row items-center gap-3 px-3">
                    <div className="spin">
                        <BsDisc />
                    </div>
                    <div className="d-inline-block truncate" style={{ width: 400 }}>
                        {artist} - {title}
                    </div>
                </div>
                <button className="btn btn-circle btn-ghost btn-sm" onClick={onEnd}>
                    <MdClose />
                </button>
            </div>
            <ReactAudioPlayer
                src={mp3}
                volume={volume / 100}
                showFilledVolume={true}
                showSkipControls={false}
                showJumpControls={false}
                hasDefaultKeyBindings={false}
                layout={'horizontal-reverse'}
                autoPlay={true}
                autoPlayAfterSrcChange={true}
                onPlay={onPlay}
                onEnded={onEnd}
            />
            <button className="btn btn-circle btn-ghost btn-sm" onClick={onCloseButtonClick}>
                <MdClose />
            </button>
        </div>
    );
}

export default SongPlayer;