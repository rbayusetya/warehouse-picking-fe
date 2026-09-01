"use client";

import { useRef, useState, useCallback } from "react";
import { Camera, CameraOff, CameraIcon } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  disabled?: boolean;
}

export default function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch {
      alert("Tidak dapat mengakses kamera.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const data = canvas.toDataURL("image/jpeg", 0.86);
    setPhoto(data);
    onCapture(data);
    stopCamera();
  }, [onCapture, stopCamera]);

  if (disabled) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] text-sm text-[var(--muted)]">
        Kamera tidak tersedia
      </div>
    );
  }

  return (
    <div className="grid gap-[10px]">
      <h3 className="m-0 text-sm font-bold">Foto Wajah Driver</h3>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full min-h-[220px] rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] ${stream ? "" : "hidden"}`}
      />
      <canvas ref={canvasRef} className="hidden" />
      {photo ? (
        <div className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-soft)]">
          <img src={photo} alt="Foto driver" className="h-full w-full object-cover" />
        </div>
      ) : (
        !stream && (
          <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] text-sm text-[var(--muted)]">
            Belum ada foto
          </div>
        )
      )}
      <div className="flex gap-2">
        {!stream ? (
          <button
            type="button"
            onClick={startCamera}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--surface)] px-[10px] text-[13px] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
          >
            <Camera size={14} />
            Buka Kamera
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={capturePhoto}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-teal-700 px-[10px] text-[13px] font-bold text-white hover:bg-teal-800"
            >
              <CameraIcon size={14} />
              Ambil Foto
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--surface)] px-[10px] text-[13px] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
            >
              <CameraOff size={14} />
              Tutup Kamera
            </button>
          </>
        )}
      </div>
    </div>
  );
}
