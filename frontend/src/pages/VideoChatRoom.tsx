import { useEffect, useRef, useState } from "react";

type Props = {
  roomId: string;
  onDisconnect: () => void;
};

export default function Room({ roomId, onDisconnect }: Props) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const iceBuf = useRef<RTCIceCandidateInit[]>([]);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState("Connecting...");
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const createPC = async (ws: WebSocket) => {
    const res = await fetch("/api/turn-credentials");
    const data = await res.json();

    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: data.urls,
          username: data.username,
          credential: data.credential,
        },
      ],
    });

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.onloadedmetadata = () => {
          remoteVideoRef.current!.play().catch(console.error);
        };
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
      }
    };

    pc.oniceconnectionstatechange = () => {
      setStatus(pc.iceConnectionState);
    };

    pcRef.current = pc;
    return pc;
  };

  const getStream = async (pc: RTCPeerConnection) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  };

  const flushIce = async (pc: RTCPeerConnection) => {
    for (const candidate of iceBuf.current) {
      try {
        await pc.addIceCandidate(candidate);
      } catch (e) {
        console.error("ICE flush error", e);
      }
    }
    iceBuf.current = [];
  };

  const startCall = async (ws: WebSocket) => {
    setStatus("Starting call...");
    const pc = await createPC(ws);
    await getStream(pc);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    ws.send(JSON.stringify({ type: "offer", sdp: offer }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(
      `${proto}//${window.location.host}/ws/${roomId}?token=${encodeURIComponent(token)}`
    );
    wsRef.current = ws;

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "room-joined") {
        if (msg.role === "waiter") {
          setStatus("Waiting for someone...");
          const pc = await createPC(ws);
          await getStream(pc);
          pcRef.current = pc;
        } else {
          await startCall(ws);
        }
      }

      if (msg.type === "peer-joined") setStatus("Peer joined, connecting...");

      if (msg.type === "peer-left") {
        setStatus("Peer left");
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      }

      if (msg.type === "room-full") setStatus("Room is full!");

      if (msg.type === "offer") {
        const pc = pcRef.current!;
        await pc.setRemoteDescription(msg.sdp);
        await flushIce(pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: "answer", sdp: answer }));
      }

      if (msg.type === "answer") {
        await pcRef.current!.setRemoteDescription(msg.sdp);
        await flushIce(pcRef.current!);
      }

      if (msg.type === "ice") {
        const pc = pcRef.current;
        if (!pc || !pc.remoteDescription) {
          iceBuf.current.push(msg.candidate);
        } else {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } catch (e) {
            console.error("ICE error", e);
          }
        }
      }
    };

    return () => ws.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted(!muted);
  };

  const toggleCam = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = camOff));
    setCamOff(!camOff);
  };

  const toggleShare = async () => {
    const pc = pcRef.current;
    if (!pc) return;

    if (!sharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(screenTrack);

        if (localVideoRef.current) {
          const newStream = new MediaStream([
            screenTrack,
            ...localStreamRef.current!.getAudioTracks(),
          ]);
          localVideoRef.current.srcObject = newStream;
        }
        screenTrack.onended = () => stopShare();
        setSharing(true);
      } catch (e) {
        console.error("Screen share error", e);
      }
    } else {
      stopShare();
    }
  };

  const stopShare = async () => {
    const pc = pcRef.current;
    const stream = localStreamRef.current;
    if (!pc || !stream) return;

    const camTrack = stream.getVideoTracks()[0];
    const sender = pc.getSenders().find((s) => s.track?.kind === "video");
    if (sender) await sender.replaceTrack(camTrack);

    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    setSharing(false);
  };

  const disconnect = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    wsRef.current?.close();
    onDisconnect();
  };

  return (
    <div className="h-full w-full bg-card flex flex-col p-3 gap-3">
      <div className="w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-foreground text-sm font-medium font-['DM_Sans']">
            {formatTime(callSeconds)}
          </span>
        </div>
        <span className="text-muted-foreground text-xs font-['DM_Sans']">
          {status}
        </span>
      </div>

      <div className="relative flex-1 min-h-0 bg-muted rounded-2xl overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="absolute bottom-3 right-3 w-1/4 max-w-[240px] min-w-[100px] aspect-video object-cover rounded-xl border-2 border-border"
        />
      </div>

      <div className="flex justify-center items-center gap-3 pb-2">
        <button
          onClick={toggleMute}
          className="px-5 py-2.5 bg-muted hover:bg-Colors-card border border-border text-foreground rounded-2xl text-sm font-semibold font-['DM_Sans'] transition-colors"
        >
          {muted ? "Slå på ljud" : "Stäng av ljud"}
        </button>

        <button
          onClick={toggleCam}
          className="px-5 py-2.5 bg-muted hover:bg-Colors-card border border-border text-foreground rounded-2xl text-sm font-semibold font-['DM_Sans'] transition-colors"
        >
          {camOff ? "Slå på kamera" : "Stäng av kamera"}
        </button>

        <button
          onClick={toggleShare}
          className="px-5 py-2.5 bg-muted hover:bg-Colors-card border border-border text-foreground rounded-2xl text-sm font-semibold font-['DM_Sans'] transition-colors"
        >
          {sharing ? "Sluta dela" : "Dela skärm"}
        </button>

        <button
          onClick={disconnect}
          className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-sm font-semibold font-['DM_Sans'] transition-colors"
        >
          Avsluta
        </button>
      </div>
    </div>
  );
}
