"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import { SOUNDTRACK_CUES } from "./soundtrack-cues";

type SoundState = "idle" | "loading" | "playing" | "paused" | "error";

type AudioGraph = {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
  bedGain: GainNode;
  accentFilter: BiquadFilterNode;
  accentGain: GainNode;
  compressor: DynamicsCompressorNode;
  masterGain: GainNode;
};

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const AUDIO_SOURCE = "/17-08-2026.mp3";
const DEFAULT_AUDIO_VOLUME = 0.6;

function holdParameter(parameter: AudioParam, time: number) {
  if (typeof parameter.cancelAndHoldAtTime === "function") {
    parameter.cancelAndHoldAtTime(time);
    return;
  }

  parameter.cancelScheduledValues(time);
  parameter.setValueAtTime(parameter.value, time);
}

export function MerdekaSoundtrack() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const graphRef = useRef<AudioGraph | null>(null);
  const activeCueRef = useRef(0);
  const playingRef = useRef(false);
  const pauseTimerRef = useRef<number | null>(null);
  const [soundState, setSoundState] = useState<SoundState>("idle");

  useEffect(() => {
    const audio = new Audio(AUDIO_SOURCE);
    audio.crossOrigin = "anonymous";
    audio.autoplay = true;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = DEFAULT_AUDIO_VOLUME;
    audioRef.current = audio;

    return () => {
      if (pauseTimerRef.current !== null) window.clearTimeout(pauseTimerRef.current);
      playingRef.current = false;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      const graph = graphRef.current;
      graph?.source.disconnect();
      graph?.bedGain.disconnect();
      graph?.accentFilter.disconnect();
      graph?.accentGain.disconnect();
      graph?.compressor.disconnect();
      graph?.masterGain.disconnect();
      void graph?.context.close();
      graphRef.current = null;
      audioRef.current = null;
    };
  }, []);

  const ensureAudioGraph = useCallback(() => {
    if (graphRef.current) return graphRef.current;

    const audio = audioRef.current;
    const AudioContextClass = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    if (!audio || !AudioContextClass) return null;

    const context = new AudioContextClass();
    const source = context.createMediaElementSource(audio);
    const bedGain = context.createGain();
    const accentFilter = context.createBiquadFilter();
    const accentGain = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const masterGain = context.createGain();

    bedGain.gain.value = 0.94;
    accentFilter.type = "highpass";
    accentFilter.frequency.value = 2_400;
    accentFilter.Q.value = 0.72;
    accentGain.gain.value = 0;
    compressor.threshold.value = -18;
    compressor.knee.value = 12;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.02;
    compressor.release.value = 0.32;
    masterGain.gain.value = 0;

    source.connect(bedGain);
    source.connect(accentFilter);
    accentFilter.connect(accentGain);
    bedGain.connect(compressor);
    accentGain.connect(compressor);
    compressor.connect(masterGain);
    masterGain.connect(context.destination);

    const graph = { context, source, bedGain, accentFilter, accentGain, compressor, masterGain };
    graphRef.current = graph;
    return graph;
  }, []);

  const applyCue = useCallback((index: number, withSwell: boolean, velocity = 0) => {
    activeCueRef.current = index;
    const graph = graphRef.current;
    if (!graph || !playingRef.current) return;

    const cue = SOUNDTRACK_CUES[index];
    const now = graph.context.currentTime;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intensity = reducedMotion ? 0.35 : gsap.utils.clamp(0.55, 1, Math.abs(velocity) / 2_200);
    const settleAt = now + (withSwell ? 1.05 : 1.6);

    holdParameter(graph.bedGain.gain, now);
    holdParameter(graph.accentGain.gain, now);
    holdParameter(graph.accentFilter.frequency, now);
    holdParameter(graph.masterGain.gain, now);

    if (withSwell) {
      const crestAt = now + 0.32;
      const crestVolume = Math.min(0.62, cue.volume * (1.12 + intensity * 0.12));
      const crestAccent = Math.min(0.22, cue.accent + 0.12 * intensity);

      graph.bedGain.gain.linearRampToValueAtTime(cue.bed * 0.9, crestAt);
      graph.accentGain.gain.linearRampToValueAtTime(crestAccent, crestAt);
      graph.masterGain.gain.linearRampToValueAtTime(crestVolume, crestAt);
    }

    graph.bedGain.gain.linearRampToValueAtTime(cue.bed, settleAt);
    graph.accentGain.gain.linearRampToValueAtTime(cue.accent, settleAt);
    graph.accentFilter.frequency.exponentialRampToValueAtTime(cue.accentFrequency, settleAt);
    graph.masterGain.gain.linearRampToValueAtTime(cue.volume, settleAt);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const existingCues = SOUNDTRACK_CUES.flatMap((cue, index) => {
      const element = document.querySelector<HTMLElement>(cue.selector);
      return element ? [{ cue, index, element }] : [];
    });

    const viewportCenter = window.innerHeight * 0.5;
    const cueAtViewportCenter = existingCues.find(({ element }) => {
      const rect = element.getBoundingClientRect();
      return rect.top <= viewportCenter && rect.bottom >= viewportCenter;
    });
    const nearestCue = existingCues.reduce(
      (nearest, item) => {
        const rect = item.element.getBoundingClientRect();
        const distance = Math.min(Math.abs(rect.top - viewportCenter), Math.abs(rect.bottom - viewportCenter));
        return distance < nearest.distance ? { index: item.index, distance } : nearest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
    activeCueRef.current = cueAtViewportCenter?.index ?? nearestCue.index;

    const triggers = existingCues.map(({ element, index }) =>
      ScrollTrigger.create({
        trigger: element,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: (self) => applyCue(index, index !== 0, self.getVelocity()),
        onEnterBack: (self) => applyCue(index, index !== SOUNDTRACK_CUES.length - 1, self.getVelocity()),
      }),
    );

    return () => triggers.forEach((trigger) => trigger.kill());
  }, [applyCue]);

  useEffect(() => {
    const setVoiceDucking = (ducked: boolean) => {
      const graph = graphRef.current;
      if (!graph || !playingRef.current) return;

      const cue = SOUNDTRACK_CUES[activeCueRef.current];
      const now = graph.context.currentTime;
      holdParameter(graph.masterGain.gain, now);
      graph.masterGain.gain.linearRampToValueAtTime(cue.volume * (ducked ? 0.52 : 1), now + (ducked ? 0.28 : 0.65));
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (event.target instanceof HTMLTextAreaElement && event.target.id === "merdeka-voice") setVoiceDucking(true);
    };
    const handleFocusOut = (event: FocusEvent) => {
      if (event.target instanceof HTMLTextAreaElement && event.target.id === "merdeka-voice") setVoiceDucking(false);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  const startSoundtrack = useCallback(async (automatic = false) => {
    const audio = audioRef.current;
    const graph = ensureAudioGraph();
    if (!audio || !graph) {
      setSoundState(automatic ? "idle" : "error");
      return;
    }

    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    setSoundState("loading");

    try {
      await graph.context.resume();
      await audio.play();
      playingRef.current = true;
      setSoundState("playing");
      applyCue(activeCueRef.current, false);
    } catch {
      playingRef.current = false;
      setSoundState(automatic ? "idle" : "error");
    }
  }, [applyCue, ensureAudioGraph]);

  useEffect(() => {
    const removeUnlockListeners = () => {
      window.removeEventListener("pointerdown", unlockSoundtrack);
      window.removeEventListener("keydown", unlockSoundtrack);
    };

    const unlockSoundtrack = (event: Event) => {
      if (playingRef.current) {
        removeUnlockListeners();
        return;
      }

      if (event.target instanceof Element && event.target.closest("[data-soundtrack-control]")) return;
      removeUnlockListeners();
      void startSoundtrack(false);
    };

    window.addEventListener("pointerdown", unlockSoundtrack, { once: true, passive: true });
    window.addEventListener("keydown", unlockSoundtrack, { once: true });
    void startSoundtrack(true).then(() => {
      if (playingRef.current) removeUnlockListeners();
    });

    return removeUnlockListeners;
  }, [startSoundtrack]);

  const pauseSoundtrack = () => {
    const audio = audioRef.current;
    const graph = graphRef.current;
    playingRef.current = false;
    setSoundState("paused");

    if (!audio || !graph) return;

    const now = graph.context.currentTime;
    holdParameter(graph.masterGain.gain, now);
    graph.masterGain.gain.linearRampToValueAtTime(0, now + 0.45);
    pauseTimerRef.current = window.setTimeout(() => {
      audio.pause();
      pauseTimerRef.current = null;
    }, 500);
  };

  const isPlaying = soundState === "playing";
  const label = soundState === "loading"
    ? "MEMUAT SUARA"
    : soundState === "error"
      ? "COBA LAGI"
      : isPlaying
        ? "SUARA AKTIF"
        : "NYALAKAN SUARA";

  return (
    <div className="fixed right-5 top-[max(6rem,calc(4.75rem+env(safe-area-inset-top)))] z-[70] md:right-10 lg:right-16">
      <button
        data-soundtrack-control
        type="button"
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Matikan musik latar" : "Nyalakan musik latar"}
        disabled={soundState === "loading"}
        onClick={isPlaying ? pauseSoundtrack : () => void startSoundtrack(false)}
        className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-bone/12 bg-night/72 px-4 font-mono text-[8px] uppercase tracking-[0.2em] text-bone/58 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors duration-300 hover:border-red-highlight/38 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-highlight disabled:cursor-wait disabled:opacity-60 md:text-[9px]"
      >
        <span aria-hidden="true" className={`soundtrack-equalizer ${isPlaying ? "is-playing" : ""}`}>
          <span />
          <span />
          <span />
        </span>
        <span>{label}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {soundState === "error" ? "Musik gagal dimuat. Tekan tombol untuk mencoba lagi." : ""}
      </span>
    </div>
  );
}
