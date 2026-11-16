import { useEffect, useRef, useState } from 'react';
import { formatClock, toFa } from '../lib/fa';
import { haptic } from '../lib/eitaa';
import { Icon } from './Icon';

const BEAT_MS = 545;
const BREATHE_SECONDS = 6;

export function CprTimer() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'compress' | 'breathe'>('compress');
  const [count, setCount] = useState(0);
  const [breathLeft, setBreathLeft] = useState(BREATHE_SECONDS);
  const [cycles, setCycles] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [sound, setSound] = useState(true);
  const audioRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  const beep = (freq: number) => {
    if (!soundRef.current) return;
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      if (!audioRef.current) audioRef.current = new Ctor();
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      /* audio unavailable */
    }
  };

  useEffect(() => {
    if (!running) return;
    if (phase === 'compress') {
      const id = window.setInterval(() => setCount((c) => Math.min(c + 1, 30)), BEAT_MS);
      return () => window.clearInterval(id);
    }
    const id = window.setInterval(() => setBreathLeft((b) => Math.max(b - 1, 0)), 1000);
    return () => window.clearInterval(id);
  }, [running, phase]);

  useEffect(() => {
    if (!running || phase !== 'compress' || count === 0) return;
    beep(count === 30 ? 1046 : 880);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, running, phase]);

  useEffect(() => {
    if (!running || phase !== 'compress' || count < 30) return;
    setPhase('breathe');
    setBreathLeft(BREATHE_SECONDS);
    haptic('medium');
  }, [count, phase, running]);

  useEffect(() => {
    if (!running || phase !== 'breathe' || breathLeft > 0) return;
    setPhase('compress');
    setCount(0);
    setBreathLeft(BREATHE_SECONDS);
    setCycles((c) => c + 1);
    haptic('success');
  }, [breathLeft, phase, running]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(
    () => () => {
      if (audioRef.current) {
        void audioRef.current.close().catch(() => undefined);
        audioRef.current = null;
      }
    },
    [],
  );

  const toggle = () => {
    if (!running) {
      beep(660);
      haptic('medium');
      setRunning(true);
    } else {
      haptic('light');
      setRunning(false);
    }
  };

  const reset = () => {
    setRunning(false);
    setPhase('compress');
    setCount(0);
    setBreathLeft(BREATHE_SECONDS);
    setCycles(0);
    setElapsed(0);
    haptic('light');
  };

  const progress = phase === 'compress' ? (count / 30) * 100 : (breathLeft / BREATHE_SECONDS) * 100;

  return (
    <div className={`cpr ${phase === 'breathe' ? 'breathe' : ''}`}>
      <div className="cpr-head">
        <span className="cpr-label">
          <Icon name="timer" size={14} /> تایمر تمرین CPR
        </span>
        <button
          type="button"
          className="cpr-sound"
          onClick={() => {
            setSound((s) => !s);
            haptic('select');
          }}
          aria-pressed={sound}
        >
          {sound ? 'صدا روشن' : 'صدا خاموش'}
        </button>
      </div>

      <div className="cpr-big" aria-live="off">
        {phase === 'compress' ? (
          <>
            <span key={count} className="beat">
              {toFa(count)}
            </span>
            <small>/ ۳۰</small>
          </>
        ) : (
          <>
            <span key={breathLeft} className="beat">
              {toFa(breathLeft)}
            </span>
            <small>ثانیه</small>
          </>
        )}
      </div>

      <div className="cpr-label center">
        {phase === 'compress' ? 'فشار قوی و پیوسته وسط قفسه سینه' : '۲ تنفس نجات بدهید'}
      </div>

      <div className="cpr-bar">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="cpr-meta">
        <span>چرخه: {toFa(cycles)}</span>
        <span>زمان: {formatClock(elapsed)}</span>
        <span>ریتم: ۱۱۰ در دقیقه</span>
      </div>

      <div className="cpr-actions">
        <button type="button" className={`btn ${running ? 'btn-ghost-white' : 'btn-white'}`} onClick={toggle}>
          <Icon name={running ? 'timer' : 'heart'} size={15} />
          {running ? 'توقف' : 'شروع'}
        </button>
        <button type="button" className="btn btn-ghost-white" onClick={reset}>
          <Icon name="close" size={15} />
          بازنشانی
        </button>
      </div>

      <p className="cpr-note">
        این تایمر برای تمرین ریتم است؛ عمق و کیفیت فشار مهم‌تر از شمارش است. در موارد واقعی حتماً با ۱۱۵
        هماهنگ باشید.
      </p>
    </div>
  );
}
