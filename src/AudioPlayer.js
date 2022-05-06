import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as PauseIcon } from './assets/pause-flat.svg';
import { ReactComponent as PlayIcon } from './assets/play-flat.svg';
const AudioPlayer = ({ track, image }) => {
  // State
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // Destructure for conciseness
  const { name: title, link: audioSrc } = track;
  // Refs
  const audioRef = useRef(new Audio(audioSrc));
  const intervalRef = useRef();
  const isReady = useRef(false);

  // Destructure for conciseness
  const { duration } = audioRef.current;

  const currentPercentage = duration
    ? `${(trackProgress / duration) * 100}%`
    : "0%";
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        // toNextTrack();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();

    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, [audioSrc]);
  function formatSeconds(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - hr * 3600) / 60);
    var sec = Math.floor(secs - hr * 3600 - min * 60);

    if (min < 10) {
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }

    return min + ":" + sec;
  }
  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div >
      <div className="track-info">
        <h2 className="title">{title}</h2>
        <div className="player">
          {isPlaying ? (
            <button
              type="button"
              className="pause"
              onClick={() => setIsPlaying(false)}
              aria-label="Pause"
            >
              <PauseIcon />
            </button>
          ) : (
            <button
              type="button"
              className="play"
              onClick={() => setIsPlaying(true)}
              aria-label="Play"
            >
              <PlayIcon />
            </button>
          )}
          <input
            type="range"
            value={trackProgress}
            step="1"
            min="0"
            max={duration ? duration : `${duration}`}
            className="progress"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
            style={{ background: trackStyling }}
          />
          <div className="duration">{!isNaN(duration) && formatSeconds(duration)}</div>
        </div>

      </div>
      <img
        className="artwork"
        src={image}
        alt={`track artwork for ${title}`}
      />
    </div>
  );
};

export default AudioPlayer;
