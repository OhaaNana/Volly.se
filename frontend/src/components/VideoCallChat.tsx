import React, { useState, useEffect } from "react";

interface VideoChatCallProps {
  remoteUserName?: string;
  onEndCall?: () => void;
  onMicToggle?: (enabled: boolean) => void;
  onCameraToggle?: (enabled: boolean) => void;
  onSettings?: () => void;
}

export const VideoChatCall: React.FC<VideoChatCallProps> = ({
  remoteUserName = "Lena Philipsson",
  onEndCall,
  onMicToggle,
  onCameraToggle,
  onSettings,
}) => {
  const [callTime, setCallTime] = useState<string>("00:00");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [seconds, setSeconds] = useState(0);

  // Timer for call duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev + 1;
        const minutes = Math.floor(newSeconds / 60);
        const secs = newSeconds % 60;
        const formattedTime = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        setCallTime(formattedTime);
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMicToggle = () => {
    setIsMicOn(!isMicOn);
    onMicToggle?.(!isMicOn);
  };

  const handleCameraToggle = () => {
    setIsCameraOn(!isCameraOn);
    onCameraToggle?.(!isCameraOn);
  };

  const handleEndCall = () => {
    onEndCall?.();
  };

  return (
    <div className="w-[672px] max-w-[672px] p-6 bg-card rounded-3xl inline-flex flex-col justify-start items-start gap-4">
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        {/* Timer with Live Indicator */}
        <div className="self-stretch inline-flex justify-start items-start overflow-hidden">
          <div className="size- flex justify-start items-center gap-2">
            <div className="text-center justify-center text-destructive text-2xl font-bold font-['DM_Sans'] uppercase leading-3 tracking-wide">
              •
            </div>
            <div className="text-center justify-center text-foreground text-xs font-bold font-['DM_Sans'] uppercase tracking-wide">
              {callTime}
            </div>
          </div>
        </div>

        {/* Call Room - Video Container */}
        <div
          data-property-1="Call Room"
          className="w-[624px] h-80 p-3 rounded-2xl inline-flex justify-between items-end bg-gray-900"
        >
          {/* Remote User Name Badge */}
          <div className="size- px-2 py-1 bg-gray-900/60 rounded-3xl inline-flex flex-col justify-center items-center overflow-hidden">
            <div className="text-center justify-center text-background text-xs font-medium font-['DM_Sans']">
              {remoteUserName}
            </div>
          </div>

          {/* Local Video Preview */}
          <img
            className="w-32 h-16 rounded-xl border-2 border-stone-50/40"
            src="https://placehold.co/128x72"
            alt="Local video preview"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="w-[636px] inline-flex justify-center items-center gap-2 overflow-hidden">
        {/* Mic Button */}
        <button
          onClick={handleMicToggle}
          data-property-1="Mic ON"
          className="size-12 p-2.5 bg-muted rounded-3xl inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden hover:bg-gray-300 transition-colors cursor-pointer"
          title={isMicOn ? "Mic on" : "Mic off"}
        >
          <div
            data-property-1="Mic"
            className="w-8 p-2.5 flex flex-col justify-center items-center gap-2.5 overflow-hidden"
          >
            <div className="w-3.5 h-5 outline outline-2 outline-offset-[-1px] outline-foreground" />
          </div>
        </button>

        {/* Camera Button */}
        <button
          onClick={handleCameraToggle}
          data-property-1="Cam ON"
          className="size-12 p-2.5 bg-muted rounded-3xl inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden hover:bg-gray-300 transition-colors cursor-pointer"
          title={isCameraOn ? "Camera on" : "Camera off"}
        >
          <div
            data-property-1="Camera"
            className="w-8 p-2.5 flex flex-col justify-center items-center gap-2.5 overflow-hidden"
          >
            <div className="w-5 h-3 outline outline-2 outline-offset-[-1px] outline-foreground" />
          </div>
        </button>

        {/* Settings Button */}
        <button
          onClick={onSettings}
          data-property-1="Settings"
          className="size-12 p-2.5 bg-muted rounded-3xl inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden hover:bg-gray-300 transition-colors cursor-pointer"
          title="Settings"
        >
          <div
            data-property-1="Settings"
            className="w-8 p-2.5 flex flex-col justify-center items-center gap-2.5 overflow-hidden"
          >
            <div className="size-5 outline outline-2 outline-offset-[-1px] outline-foreground" />
          </div>
        </button>

        {/* End Call Button */}
        <button
          onClick={handleEndCall}
          className="h-12 px-5 bg-destructive rounded-3xl shadow-[0px_4px_16px_0px_rgba(22,26,38,0.05)] shadow-[0px_1px_2px_0px_rgba(22,26,38,0.04)] flex justify-center items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
          title="End call"
        >
          <div
            data-property-1="End Call"
            className="w-8 p-2.5 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden"
          >
            <div className="w-5 h-3.5 outline outline-2 outline-offset-[-1px] outline-background" />
          </div>
          <div className="text-center justify-center text-background text-base font-semibold font-['DM_Sans']">
            Avsluta samtal
          </div>
        </button>
      </div>
    </div>
  );
};
