import { useEffect, useRef, useState } from "react";
import micIcon from "../assets/mic.svg";
import cameraIcon from "../assets/camera.svg";
import settingsIcon from "../assets/Settings.svg";

type Props = {
  roomId: string;
  userName: string;
  onConnect: () => void;
  onCancel: () => void;
};

type DeviceInfo = { deviceId: string; label: string };

export function VideoChatLobby({ userName, onConnect, onCancel }: Props) {
  const previewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [cameras, setCameras] = useState<DeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<DeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>("");

  const startStream = async (cameraId?: string) => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    const stream = await navigator.mediaDevices.getUserMedia({
      video: cameraId ? { deviceId: { exact: cameraId } } : true,
      audio: true,
    });
    streamRef.current = stream;
    if (previewRef.current) previewRef.current.srcObject = stream;
    if (!isMicOn) stream.getAudioTracks().forEach((t) => (t.enabled = false));
    if (!isCameraOn)
      stream.getVideoTracks().forEach((t) => (t.enabled = false));
  };

  const loadDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices
      .filter((d) => d.kind === "videoinput")
      .map((d, i) => ({
        deviceId: d.deviceId,
        label: d.label || `Kamera ${i + 1}`,
      }));
    const spks = devices
      .filter((d) => d.kind === "audiooutput")
      .map((d, i) => ({
        deviceId: d.deviceId,
        label: d.label || `Högtalare ${i + 1}`,
      }));
    setCameras(cams);
    setSpeakers(spks);
    if (!selectedCameraId && cams.length > 0)
      setSelectedCameraId(cams[0].deviceId);
    if (!selectedSpeakerId && spks.length > 0)
      setSelectedSpeakerId(spks[0].deviceId);
  };

  useEffect(() => {
    let active = true;
    startStream()
      .then(() => {
        if (active) loadDevices();
      })
      .catch(console.error);
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCameraChange = async (deviceId: string) => {
    setSelectedCameraId(deviceId);
    await startStream(deviceId);
  };

  const handleSpeakerChange = (deviceId: string) => {
    setSelectedSpeakerId(deviceId);
    const video = previewRef.current as HTMLVideoElement & {
      setSinkId?: (id: string) => Promise<void>;
    };
    if (video?.setSinkId) video.setSinkId(deviceId).catch(console.error);
  };

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !isMicOn));
    setIsMicOn((prev) => !prev);
  };

  const toggleCamera = () => {
    streamRef.current
      ?.getVideoTracks()
      .forEach((t) => (t.enabled = !isCameraOn));
    setIsCameraOn((prev) => !prev);
  };

  const handleConnect = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onConnect();
  };

  const handleCancel = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCancel();
  };

  return (
    <div className="w-[672px] max-w-full p-6 bg-card rounded-3xl inline-flex flex-col justify-start items-start gap-4">
      <div className="self-stretch flex flex-col justify-start items-start gap-4 overflow-hidden">
        {/* Header */}
        <div className="self-stretch flex flex-col justify-center items-center">
          <div className="text-center justify-center text-foreground text-xl font-bold font-['DM_Sans']">
            Redo att ansluta?
          </div>
          <div className="text-center justify-center text-muted-foreground text-sm font-normal font-['DM_Sans']">
            Videosamtal med {userName}
          </div>
        </div>

        {/* Camera Preview */}
        <div className="w-full h-80 rounded-2xl overflow-hidden bg-gray-900 relative">
          <video
            ref={previewRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover -scale-x-100"
          />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <span className="text-muted-foreground text-sm font-['DM_Sans']">
                Kamera avstängd
              </span>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="self-stretch inline-flex justify-start items-start gap-2">
          {/* Mic Button */}
          <div
            onClick={toggleMic}
            className={`flex-1 self-stretch p-3 cursor-pointer relative rounded-xl outline outline-2 outline-offset-[-2px] inline-flex flex-col justify-center items-center gap-1 overflow-hidden transition-colors ${
              isMicOn
                ? "bg-lime-300 outline-primary hover:bg-lime-400"
                : "bg-destructive/10 outline-destructive hover:bg-destructive/15"
            }`}
          >
            <img src={micIcon} alt="Mikrofon" className="w-5 h-5" />
            <div
              className={`text-xs font-semibold font-['DM_Sans'] ${isMicOn ? "text-primary" : "text-destructive"}`}
            >
              Mikrofon
            </div>
          </div>

          {/* Camera Button */}
          <div
            onClick={toggleCamera}
            className={`flex-1 self-stretch p-3 cursor-pointer rounded-xl outline outline-2 outline-offset-[-2px] inline-flex flex-col justify-center items-center gap-1 overflow-hidden transition-colors ${
              isCameraOn
                ? "bg-lime-300 outline-primary hover:bg-lime-400"
                : "bg-destructive/10 outline-destructive hover:bg-destructive/15"
            }`}
          >
            <img src={cameraIcon} alt="Kamera" className="w-5 h-5" />
            <div
              className={`text-xs font-semibold font-['DM_Sans'] ${isCameraOn ? "text-primary" : "text-destructive"}`}
            >
              Kamera
            </div>
          </div>

          {/* Settings Button */}
          <div
            onClick={() => setShowSettings((v) => !v)}
            className={`flex-1 self-stretch p-3 cursor-pointer rounded-xl outline outline-2 outline-offset-[-2px] inline-flex flex-col justify-center items-center gap-1 overflow-hidden transition-colors ${
              showSettings
                ? "bg-primary/10 outline-primary"
                : "bg-muted outline-border hover:bg-gray-200"
            }`}
          >
            <img src={settingsIcon} alt="Inställningar" className="w-5 h-5" />
            <div
              className={`text-xs font-semibold font-['DM_Sans'] ${showSettings ? "text-primary" : "text-foreground"}`}
            >
              Inställningar
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="self-stretch p-4 bg-muted rounded-2xl outline outline-1 outline-offset-[-1px] outline-border flex flex-col gap-3">
            {cameras.length > 0 && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground font-['DM_Sans']">
                  Kamera
                </label>
                <select
                  value={selectedCameraId}
                  onChange={(e) => handleCameraChange(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground font-['DM_Sans'] outline-none cursor-pointer"
                >
                  {cameras.map((c) => (
                    <option key={c.deviceId} value={c.deviceId}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {speakers.length > 0 && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground font-['DM_Sans']">
                  Högtalare
                </label>
                <select
                  value={selectedSpeakerId}
                  onChange={(e) => handleSpeakerChange(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground font-['DM_Sans'] outline-none cursor-pointer"
                >
                  {speakers.map((s) => (
                    <option key={s.deviceId} value={s.deviceId}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {cameras.length === 0 && speakers.length === 0 && (
              <p className="text-xs text-muted-foreground font-['DM_Sans']">
                Inga enheter hittades.
              </p>
            )}
          </div>
        )}

        {/* Security Warning */}
        <div className="self-stretch p-4 bg-orange-300/10 rounded-2xl outline outline-1 outline-offset-[-1px] outline-orange-300/40 flex flex-col justify-start items-start gap-1.5">
          <div className="inline-flex justify-start items-start gap-1.5">
            <i
              aria-hidden
              className="fi fi-rr-shield-check shrink-0 text-[14px] leading-none text-foreground mt-0.5"
            />
            <div className="text-center justify-center text-foreground text-sm font-semibold font-['DM_Sans']">
              Håll dig säker på Volly
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch justify-center text-muted-foreground text-xs font-normal font-['DM_Sans']">
              Dela aldrig känsliga eller personliga uppgifter som adress,
              lösenord, ID-uppgifter eller bankinformation.
            </div>
            <div className="self-stretch justify-center text-muted-foreground text-xs font-normal font-['DM_Sans']">
              Om något känns obehagligt eller misstänkt, avsluta samtalet och
              rapportera användaren direkt.
            </div>
            <div className="self-stretch justify-center text-muted-foreground text-xs font-normal font-['DM_Sans']">
              Du kan lämna en chatt eller ett videosamtal när som helst — din
              trygghet kommer alltid först.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="self-stretch inline-flex justify-start items-start gap-2 overflow-hidden">
          <div
            onClick={handleCancel}
            className="flex-1 h-12 rounded-3xl outline outline-1 outline-offset-[-1px] outline-border inline-flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="text-center justify-center text-foreground text-base font-semibold font-['DM_Sans']">
              Avbryt
            </div>
          </div>
          <div
            onClick={handleConnect}
            className="flex-1 h-12 bg-primary rounded-3xl shadow-[0px_4px_16px_0px_rgba(22,26,38,0.05)] inline-flex flex-col justify-center items-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="text-center justify-center text-card text-base font-semibold font-['DM_Sans']">
              Anslut
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
