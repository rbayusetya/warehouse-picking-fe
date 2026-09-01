"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Eraser } from "lucide-react";

interface SignaturePadProps {
  onSign: (dataUrl: string) => void;
  disabled?: boolean;
  label?: string;
}

export default function SignaturePad({ onSign, disabled, label = "Tanda Tangan Driver" }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--text-primary").trim() || "#17212f";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const source = "touches" in e ? e.touches[0] : e;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top };
  };

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, [disabled]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasContent(true);
    onSign(canvas.toDataURL("image/png"));
  }, [isDrawing, disabled, onSign]);

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
    onSign("");
  }, [onSign]);

  return (
    <div className="grid gap-[10px]">
      <h3 className="m-0 text-sm font-bold">{label}</h3>
      <canvas
        ref={canvasRef}
        className="h-[220px] w-full touch-none rounded-lg border border-[var(--line)] bg-[var(--surface-soft)]"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      {!disabled && (
        <button
          type="button"
          onClick={clear}
          className="inline-flex h-8 items-center gap-1.5 self-start rounded-md border border-[var(--line)] bg-[var(--surface)] px-[10px] text-[13px] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
        >
          <Eraser size={14} />
          Bersihkan TTD
        </button>
      )}
      {hasContent && (
        <p className="text-xs text-green-700">Tanda tangan terekam</p>
      )}
    </div>
  );
}
