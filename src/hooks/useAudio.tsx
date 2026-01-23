import React from "react";
import { useSettings } from "@/base/src/contexts/settingsContext";

export default function useAudio() {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { settings } = useSettings();

  if (audioRef.current) {
    audioRef.current.volume = settings.notification_sound / 100;
  }

  return {
    audioRef,
  };
}
