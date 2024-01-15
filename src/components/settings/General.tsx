import React from "react";

interface GeneralSettingsProps {
  notificationSound: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  handleUserGeneralSettings: (
    e: React.ChangeEvent<HTMLInputElement>,
    audioRef: React.RefObject<HTMLAudioElement>
  ) => void;
  updateUserSettings: () => Promise<void>;
}

const General: React.FC<GeneralSettingsProps> = (props) => {
  return (
    <div className="bg-white w-full p-4 flex flex-col gap-8 rounded-lg h-fit">
      <div className="flex flex-row w-full items-center justify-start gap-2 text-sm">
        <div className="flex flex-row items-center justify-center gap-4">
          <input
            name="notification_sound"
            type="range"
            className="text-primary-500 bg-primary-500 w-24"
            step={10}
            value={props.notificationSound}
            onChange={(e) => props.handleUserGeneralSettings(e, props.audioRef)}
          />

          <p>Notification Sound</p>
        </div>
      </div>

      <button
        onClick={props.updateUserSettings}
        className="bg-primary-500 text-white font-semibold 
                    p-2 rounded-lg t:w-fit t:px-10"
      >
        Save Changes
      </button>
    </div>
  );
};

export default General;
