import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
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

  const createPC = (ws: WebSocket) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        // Uses the video element to transfer the stream
        remoteVideoRef.current.srcObject = event.streams[0];
        // Waits till the video is ready
        remoteVideoRef.current.onloadedmetadata = () => {
          // Starts playing the remote video
          remoteVideoRef.current!.play().catch(console.error);
        };
      }
    };

    // ICE
    // Interactive Connectivity Establishment
    // Its job is to figure out the best way to connect computers with each other

    // looks for the best connection
    pc.onicecandidate = (event) => {
      // goes through only if it finds it
      if (event.candidate) {
        // Sends network info to the other device through websockets
        ws.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
      }
    };

    // Runs only when the connection state is changed
    pc.oniceconnectionstatechange = () => {
      setStatus(pc.iceConnectionState);
    };

    pcRef.current = pc;
    return pc;
  };

  const getStream = async (pc: RTCPeerConnection) => {
    // askes the user for camera and microphone access
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    // Stores that data
    localStreamRef.current = stream;
    // Shows your the local camera
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    // Sends everything to the other user
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  };

  // Saving ICE Candidates
  const flushIce = async (pc: RTCPeerConnection) => {
    // loops through all canditates (All possible connection paths)
    for (const candidate of iceBuf.current) {
      // Adds a candidate into WebRTC to verify path
      try {
        await pc.addIceCandidate(candidate);
      } catch (e) {
        console.error("ICE flush error", e);
      }
    }
    // clears the buffer after proccessing
    // buffer = temporary storage of data
    iceBuf.current = [];
  };

  const startCall = async (ws: WebSocket) => {
    // updates ui
    setStatus("Starting call...");
    // creates a connection
    const pc = createPC(ws);
    // gets all info
    await getStream(pc);
    // creates a request ("offer") and saves it inside the browser
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    // sends it through websocket to the other person
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
      // converts msg to javascript object
      const msg = JSON.parse(event.data);

      if (msg.type === "room-joined") {
        if (msg.role === "waiter") {
          setStatus("Waiting for someone...");
          // creates a webrtc connection
          // gets all the info
          // saves this conneciton for later
          const pc = createPC(ws);
          await getStream(pc);
          pcRef.current = pc;
        } else {
          // starts call if the second user is connected
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
        // gets webrtc connection
        const pc = pcRef.current!;
        // saves the other user's connection in the browser
        await pc.setRemoteDescription(msg.sdp);
        // adds ice candites that were stored earlier
        await flushIce(pc);
        // creates responose to the offer
        const answer = await pc.createAnswer();
        // stores anwser in browser
        await pc.setLocalDescription(answer);
        // sends it through the websocket
        ws.send(JSON.stringify({ type: "answer", sdp: answer }));
      }

      if (msg.type === "answer") {
        // waits for response
        await pcRef.current!.setRemoteDescription(msg.sdp);
        // stores ICE candidates
        await flushIce(pcRef.current!);
      }

      if (msg.type === "ice") {
        const pc = pcRef.current;
        // checks if the connection is not connected
        if (!pc || !pc.remoteDescription) {
          // saves the ice candidate
          iceBuf.current.push(msg.candidate);
        } else {
          // else add the network route so both users can connect
          try {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } catch (e) {
            console.error("ICE error", e);
          }
        }
      }
    };

    return () => ws.close();
  }, [roomId]);

  const toggleMute = () => {
    // gets local camera & microphone
    const stream = localStreamRef.current;
    // stops this action if there is no stream
    if (!stream) return;
    // toggles the mute button
    stream.getAudioTracks().forEach((t) => (t.enabled = muted));
    // informs the ui
    setMuted(!muted);
  };

  const toggleCam = () => {
    // gets local camera & microphone
    const stream = localStreamRef.current;
    if (!stream) return;
    // toggles the camera button
    stream.getVideoTracks().forEach((t) => (t.enabled = camOff));
    //informs the ui
    setCamOff(!camOff);
  };

  const toggleShare = async () => {
    const pc = pcRef.current;
    if (!pc) return;

    if (!sharing) {
      try {
        // Opens browesr screenshare
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        // uses the screenshare
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replaces the webcam with the screen share
        // finds the video
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        // swaps it with the screenshare
        if (sender) await sender.replaceTrack(screenTrack);

        if (localVideoRef.current) {
          // creates a preview stream with the screen and mic audio
          // creates new combined stream
          const newStream = new MediaStream([
            // adds screenshare
            screenTrack,
            // adds microphone
            ...localStreamRef.current!.getAudioTracks(),
          ]);
          // show the screen on your local video
          localVideoRef.current.srcObject = newStream;
        }
        // Stop sharing
        screenTrack.onended = () => stopShare();
        // updates ui that it stops sharing
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

    // Gets webcam
    const camTrack = stream.getVideoTracks()[0];
    // switches back to webcam from screenshare
    const sender = pc.getSenders().find((s) => s.track?.kind === "video");
    if (sender) await sender.replaceTrack(camTrack);

    // show webcam in local preview
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    // updates ui
    setSharing(false);
  };

  const disconnect = () => {
    // stops camera and micrphone
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    // closes webRTC
    pcRef.current?.close();
    // closes signaling
    wsRef.current?.close();

    // sends user back
    // NEEDS TO CHANGE vvvvv
    navigate("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Room: {roomId}</h3>
      <p>{status}</p>

      <div style={{ display: "flex", gap: 10 }}>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{
            width: "70%",
            background: "black",
          }}
        />

        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "30%",
            background: "black",
          }}
        />
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={toggleMute}>{muted ? "Unmute" : "Mute"}</button>

        <button onClick={toggleCam}>
          {camOff ? "Show Camera" : "Hide Camera"}
        </button>

        <button onClick={toggleShare}>
          {sharing ? "Stop Sharing" : "Share Screen"}
        </button>

        <button onClick={disconnect}>Disconnect</button>
      </div>
    </div>
  );
}
