"use client";

import { useEffect, useState } from "react";
import {
  initialStory,
  resolveActiveStory,
  type ActiveStory,
} from "@/lib/home/story-calendar";

const MINUTE = 60_000;

export function useActiveStory() {
  const [story, setStory] = useState<ActiveStory>(initialStory);

  useEffect(() => {
    const update = () => setStory(resolveActiveStory(new Date()));
    update();

    const interval = window.setInterval(update, MINUTE);
    document.addEventListener("visibilitychange", update);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return story;
}
