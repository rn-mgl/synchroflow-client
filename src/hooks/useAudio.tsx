import React from "react";
import { useSettings } from "@/base/src/contexts/settingsContext";

export default function useAudio() {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { settings } = useSettings();

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.notification_sound / 100;
    }
  }, [settings.notification_sound]);

  return {
    audioRef,
  };
}
