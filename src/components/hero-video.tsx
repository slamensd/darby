import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const POSTER = '/media/trade-hero-poster.jpg';
const SRC = '/media/trade-hero.mp4';

function prefersStill() {
  if (typeof window === 'undefined') return true;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(reduced || conn?.saveData);
}

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(prefersStill);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setStill(prefersStill());
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || still || failed) return;
    v.muted = true;
    v.play().catch(() => setPlaying(false));
  }, [still, failed]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setFailed(true));
    else v.pause();
  };

  const showVideo = !still && !failed;

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[var(--deep)] bg-cover bg-center" style={{ backgroundImage: `url(${POSTER})` }} data-testid="img-hero-poster" />
      {showVideo && (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          poster={POSTER}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
          data-testid="video-hero"
        >
          <source src={SRC} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,20,32,.92)_0%,rgba(6,20,32,.72)_45%,rgba(6,20,32,.38)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[rgba(6,20,32,.7)] to-transparent" />
      {showVideo && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause background video' : 'Play background video'}
          aria-pressed={!playing}
          className="absolute bottom-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(251,250,247,.45)] bg-[rgba(6,20,32,.55)] text-[#FBFAF7] backdrop-blur transition-colors hover:border-[var(--leaf-light)]"
          data-testid="button-hero-video-toggle"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
