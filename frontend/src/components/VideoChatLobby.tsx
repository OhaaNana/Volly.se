import React, { useState } from "react";

interface VideoChatModalProps {
  onConnect?: () => void;
  onCancel?: () => void;
  userName?: string;
}

export const VideoChatModal: React.FC<VideoChatModalProps> = ({
  onConnect,
  onCancel,
  userName = "Lena Philipsson",
}) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  return (
    <div className="w-[672px] max-w-[672px] p-6 bg-card rounded-3xl inline-flex flex-col justify-start items-start gap-4">
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

        {/* Video Preview */}
        <img
          data-property-1="Self Preview"
          className="w-[624px] h-80 rounded-2xl"
          src="https://placehold.co/624x351"
          alt="Video preview"
        />

        {/* Control Buttons */}
        <div className="self-stretch inline-flex justify-start items-start gap-2">
          {/* Mic Button */}
          <div
            data-property-1="OFF"
            onClick={() => setIsMicOn(!isMicOn)}
            className="flex-1 self-stretch p-3 cursor-pointer relative bg-destructive/10 rounded-xl outline outline-2 outline-offset-[-2px] outline-destructive inline-flex flex-col justify-center items-center gap-1 overflow-hidden hover:bg-destructive/15 transition-colors"
          >
            <div
              data-property-1="Mic OFF"
              className="w-12 flex flex-col justify-center items-center gap-1"
            >
              <div className="w-3.5 h-5 outline outline-2 outline-offset-[-1px] outline-destructive" />
              <div className="text-center justify-center text-destructive text-xs font-semibold font-['DM_Sans']">
                Mikrofon
              </div>
            </div>
            <div className="w-7 h-0 left-[46px] top-[31px] absolute origin-top-left rotate-[-133.53deg] outline outline-2 outline-offset-[-1px] outline-destructive"></div>
          </div>

          {/* Camera Button */}
          <div
            data-property-1="ON"
            onClick={() => setIsCameraOn(!isCameraOn)}
            className="flex-1 self-stretch p-3 cursor-pointer bg-lime-300 rounded-xl outline outline-2 outline-offset-[-2px] outline-primary inline-flex flex-col justify-center items-center gap-1 overflow-hidden hover:bg-lime-400 transition-colors"
          >
            <div
              data-property-1="Cam ON"
              className="w-12 flex flex-col justify-center items-center gap-1"
            >
              <div className="w-5 h-3 outline outline-2 outline-offset-[-1px] outline-primary" />
              <div className="text-center justify-center text-primary text-xs font-semibold font-['DM_Sans']">
                Kamera
              </div>
            </div>
          </div>

          {/* Settings Button */}
          <div
            data-property-1="Default"
            className="flex-1 self-stretch p-3 cursor-pointer bg-muted rounded-xl outline outline-2 outline-offset-[-2px] outline-border inline-flex flex-col justify-center items-center gap-1 overflow-hidden hover:bg-gray-200 transition-colors"
          >
            <div className="size- flex flex-col justify-center items-center gap-1">
              <div
                data-property-1="Inställningar"
                className="size- inline-flex justify-start items-center"
              >
                <div className="size-5 flex justify-center items-center gap-2.5">
                  <div className="size-4 outline outline-2 outline-offset-[-1px] outline-foreground" />
                </div>
              </div>
              <div className="text-center justify-center text-foreground text-xs font-semibold font-['DM_Sans']">
                Inställningar
              </div>
            </div>
          </div>
        </div>

        {/* Security Warning Box */}
        <div className="self-stretch p-4 bg-orange-300/10 rounded-2xl outline outline-1 outline-offset-[-1px] outline-orange-300/40 flex flex-col justify-start items-start gap-1.5">
          <div className="size- inline-flex justify-start items-start gap-1.5">
            <div
              data-property-1="Säkerhet"
              className="size- flex justify-start items-center"
            >
              <div className="size-5 flex justify-center items-center gap-2.5">
                <div className="w-3 h-4 outline outline-2 outline-offset-[-1px] outline-foreground" />
              </div>
            </div>
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
          {/* Cancel Button */}
          <div
            onClick={onCancel}
            className="flex-1 h-12 rounded-3xl outline outline-1 outline-offset-[-1px] outline-border inline-flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="text-center justify-center text-foreground text-base font-semibold font-['DM_Sans']">
              Avbryt
            </div>
          </div>

          {/* Connect Button */}
          <div
            onClick={onConnect}
            className="flex-1 h-12 bg-primary rounded-3xl shadow-[0px_4px_16px_0px_rgba(22,26,38,0.05)] shadow-[0px_1px_2px_0px_rgba(22,26,38,0.04)] outline outline-1 outline-offset-[-1px] outline-border inline-flex flex-col justify-center items-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="text-center justify-center text-card text-base font-semibold font-['DM_Sans']">
              Anslut
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
