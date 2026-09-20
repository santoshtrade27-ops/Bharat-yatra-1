import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function HeroVideo({ src }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    return () => {
      try { v.pause(); } catch {}
    };
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={src}
        muted
        loop
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={() => setMuted(!!videoRef.current?.muted)}
      />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1.5 rounded-full bg-stone-900/80 text-white backdrop-blur ring-1 ring-white/15">
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="w-10 h-10 grid place-items-center rounded-full hover:bg-white/15 transition-colors"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <span className="text-[10px] font-medium uppercase tracking-wider text-stone-300 px-1.5">
          {playing ? "Playing" : "Paused"}
        </span>
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="w-10 h-10 grid place-items-center rounded-full hover:bg-white/15 transition-colors"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </>
  );
}