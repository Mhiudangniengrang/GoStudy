import React, { useEffect, useRef, useState } from "react";
import {
  SoundOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  PlayCircleOutlined,
  MutedOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import FocusTimer from "./focusTimer";
import { Button, notification } from "antd";
import FocusSession from "./focusSession";
import LazyLoad from "react-lazyload";

function FocusSpace() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState("");
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [backgroundClass, setBackgroundClass] = useState("");
  const [selectedBackground, setSelectedBackground] = useState(
    "https://storage.cloud.google.com/go_study/music/Background1.1%20-%20Made%20with%20Clipchamp.mp4"
  );
  const [focusTime, setFocusTime] = useState(1);
  const [breakTime, setBreakTime] = useState(1);
  const [isLoop, setIsLoop] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Quản lý trạng thái hiển thị cho cả Timer và Goal
  const [showTimer, setShowTimer] = useState(false);
  const [showGoal, setShowGoal] = useState(false);

  // Hàm toggle showTimer, đồng thời ẩn showGoal nếu đang mở
  const toggleShowTimer = () => {
    setShowTimer(!showTimer);
    if (!showTimer) {
      setShowGoal(false); // Ẩn showGoal khi mở showTimer
    }
  };

  // Hàm toggle showGoal, đồng thời ẩn showTimer nếu đang mở
  const toggleShowGoal = () => {
    setShowGoal(!showGoal);
    if (!showGoal) {
      setShowTimer(false); // Ẩn showTimer khi mở showGoal
    }
  };
  const musicOptions = [
    {
      name: "lofi-orchestra",
      src: "https://storage.cloud.google.com/go_study/music/lofi-orchestra-162306.mp3",
    },
    {
      name: "lofi-song-jinsei",
      src: "https://storage.cloud.google.com/go_study/music/lofi-song-jinsei-by-lofium-236730.mp3",
    },
    {
      name: "lofi-song-room",
      src: "https://storage.cloud.google.com/go_study/music/lofi-song-room-by-lofium-242714.mp3",
    },
    {
      name: "playa-del-sol-latin",
      src: "https://storage.cloud.google.com/go_study/music/playa-del-sol-latin-lofi-160149.mp3",
    },
    {
      name: "satisfying-lofi-for-focus",
      src: "https://storage.cloud.google.com/go_study/music/satisfying-lofi-for-focus-study-amp-working-242103.mp3",
    },
  ];

  const backgroundOptions = [
    {
      name: "Magic Bookstore in the Woods",
      src: "https://storage.cloud.google.com/go_study/music/Background1.1%20-%20Made%20with%20Clipchamp.mp4",
    },
    {
      name: "Cozy Farm House",
      src: "https://storage.cloud.google.com/go_study/music/Background2.2%20-%20Made%20with%20Clipchamp.mp4",
    },
    {
      name: "Cozy Fairy Fottage",
      src: "https://storage.cloud.google.com/go_study/music/Background3.3%20-%20Made%20with%20Clipchamp.mp4",
    },
  ];

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const toggleMusicMenu = () => {
    setShowMusicMenu(!showMusicMenu);
    if (!showMusicMenu) {
      setShowBackgroundMenu(false);
    }
  };

  const toggleBackgroundMenu = () => {
    setShowBackgroundMenu(!showBackgroundMenu);
    if (!showBackgroundMenu) {
      setShowMusicMenu(false);
    }
  };

  const selectMusic = (src) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.volume = volume;
      audioRef.current.play();
      setSelectedMusic(src);
      setIsPlaying(true);
      videoRef.current.muted = true;
      setIsMuted(true);
      setShowMusicMenu(false);
    }
  };

  const changeVolume = (e, musicSrc) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current && selectedMusic === musicSrc) {
      audioRef.current.volume = newVolume;
    }
  };

  const renderVolumeControl = (music) => (
    <div className="flex items-center mt-2">
      {selectedMusic === music.src &&
      audioRef.current &&
      !audioRef.current.muted ? (
        <SoundOutlined className="mr-2" />
      ) : (
        <MutedOutlined className="mr-2" />
      )}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={selectedMusic === music.src ? volume : 0.5}
        onChange={(e) => changeVolume(e, music.src)}
        style={{
          width: "100%",
          height: "4px",
          appearance: "none",
          backgroundColor: "#ddd",
          borderRadius: "2px",
          outline: "none",
        }}
        className="slider"
      />
    </div>
  );
  const selectBackground = (src) => {
    setBackgroundClass("video-fade");

    setTimeout(() => {
      setSelectedBackground(src);
      setBackgroundClass("");
    }, 1000);
  };
  return (
    <>
      <div ref={containerRef} className="relative h-screen w-screen">
        <LazyLoad height={200} offset={100}>
          <video
            ref={videoRef}
            className={`pointer-events-none absolute top-0 left-0 w-full h-full object-cover ${backgroundClass}`}
            src={selectedBackground}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
          ></video>
        </LazyLoad>

        <audio ref={audioRef} loop preload="metadata"></audio>
        <div className="relative z-10">
          <div className="flex">
            <FocusTimer
              focusTime={focusTime}
              breakTime={breakTime}
              isLoop={isLoop}
              setFocusTime={setFocusTime}
              setBreakTime={setBreakTime}
              isTimerRunning={isTimerRunning}
              setIsTimerRunning={setIsTimerRunning}
              toggleShowTimer={toggleShowTimer}
              showTimer={showTimer}
            />
            <FocusSession showGoal={showGoal} toggleShowGoal={toggleShowGoal} />
          </div>

          <button
            onClick={toggleMute}
            className="absolute bottom-1 right-52 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
          >
            {isMuted ? (
              <MutedOutlined style={{ fontSize: "24px" }} />
            ) : (
              <SoundOutlined style={{ fontSize: "24px" }} />
            )}
          </button>
          <button
            onClick={toggleMusicMenu}
            className="absolute bottom-1 right-40 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
          >
            <PlayCircleOutlined style={{ fontSize: "24px" }} />
          </button>
          <button
            onClick={toggleBackgroundMenu}
            className="absolute bottom-1 right-28 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
          >
            <PictureOutlined style={{ fontSize: "24px" }} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="absolute bottom-1 right-16 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
          >
            {isFullscreen ? (
              <FullscreenExitOutlined style={{ fontSize: "24px" }} />
            ) : (
              <FullscreenOutlined style={{ fontSize: "24px" }} />
            )}
          </button>
          <div className="absolute mt-[20.5rem] right-4 text-white text-2xl font-bold p-4 rounded-md text-center mx-5">
            “You are never too old to set another
            <br />
            goal or to dream a new dream.”
            <br />
            <div className="text-right text-sm mt-2">Malala Yousafzai</div>
          </div>

          {showMusicMenu && (
            <div className="absolute top-17 right-10 bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <h3 className="mb-2">Select a Song</h3>
              {musicOptions.map((music, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => selectMusic(music.src)}
                    className="block w-full text-left hover:bg-opacity-90"
                  >
                    {music.name}
                  </button>
                  {renderVolumeControl(music)}
                </div>
              ))}
            </div>
          )}
          {showBackgroundMenu && (
            <div className="absolute top-17 right-0 bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <h3 className="mb-2">Select a Background</h3>
              {backgroundOptions.map((bg, index) => (
                <button
                  key={index}
                  onClick={() => selectBackground(bg.src)}
                  className="block w-full text-left p-2 hover:bg-opacity-90"
                >
                  {bg.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FocusSpace;
