import React from "react";

export default function useAudio() {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  return {
    audioRef,
  };
}
