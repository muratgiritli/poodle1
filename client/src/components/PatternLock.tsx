import { useCallback, useEffect, useRef, useState } from "react";

const NODES = 9;
const COLS = 3;

type Props = {
  size?: number;
  accent?: string;
  accentSoft?: string;
  disabled?: boolean;
  onComplete: (nodes: number[]) => void;
  resetKey?: string | number;
};

function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.hypot(dx, dy);
}

/** 3x3 Android-style pattern lock — touch/mouse drawable. */
export default function PatternLock({
  size = 280,
  accent = "#5D3A1A",
  accentSoft = "#F5F0E6",
  disabled = false,
  onComplete,
  resetKey,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [path, setPath] = useState<number[]>([]);
  const drawing = useRef(false);
  const pathRef = useRef<number[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const nodesRef = useRef<{ x: number; y: number }[]>([]);

  const pad = size * 0.16;
  const gap = (size - pad * 2) / (COLS - 1);
  const hitR = gap * 0.32;

  const layoutNodes = useCallback(() => {
    const nodes: { x: number; y: number }[] = [];
    for (let i = 0; i < NODES; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      nodes.push({ x: pad + col * gap, y: pad + row * gap });
    }
    nodesRef.current = nodes;
    return nodes;
  }, [gap, pad]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const nodes = layoutNodes();
    const current = pathRef.current;

    if (current.length > 0) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      current.forEach((idx, i) => {
        const n = nodes[idx];
        if (i === 0) ctx.moveTo(n.x, n.y);
        else ctx.lineTo(n.x, n.y);
      });
      if (drawing.current && pointerRef.current) {
        ctx.lineTo(pointerRef.current.x, pointerRef.current.y);
      }
      ctx.stroke();
    }

    nodes.forEach((n, i) => {
      const active = current.includes(i);
      ctx.beginPath();
      ctx.arc(n.x, n.y, active ? 14 : 11, 0, Math.PI * 2);
      ctx.fillStyle = active ? accentSoft : "#F9FAFB";
      ctx.fill();
      ctx.strokeStyle = active ? accent : "#D1D5DB";
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.stroke();
      if (active) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
      }
    });
  }, [accent, accentSoft, layoutNodes, size]);

  useEffect(() => {
    pathRef.current = [];
    setPath([]);
    pointerRef.current = null;
    drawing.current = false;
    draw();
  }, [resetKey, draw]);

  useEffect(() => {
    draw();
  }, [path, draw]);

  const hitTest = (x: number, y: number) => {
    const nodes = nodesRef.current.length ? nodesRef.current : layoutNodes();
    for (let i = 0; i < nodes.length; i++) {
      if (dist(x, y, nodes[i].x, nodes[i].y) <= hitR) return i;
    }
    return -1;
  };

  const addNode = (idx: number) => {
    if (idx < 0) return;
    if (pathRef.current.includes(idx)) return;
    pathRef.current = [...pathRef.current, idx];
    setPath(pathRef.current);
  };

  const localPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    pathRef.current = [];
    setPath([]);
    const p = localPos(e);
    pointerRef.current = p;
    addNode(hitTest(p.x, p.y));
    draw();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || disabled) return;
    const p = localPos(e);
    pointerRef.current = p;
    addNode(hitTest(p.x, p.y));
    draw();
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    pointerRef.current = null;
    const finalPath = pathRef.current;
    draw();
    if (finalPath.length >= 4) onComplete(finalPath);
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        touchAction: "none",
        display: "block",
        margin: "0 auto",
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        opacity: disabled ? 0.55 : 1,
        borderRadius: 16,
        background: "#fff",
      }}
      aria-label="Desen kilidi"
      role="img"
    />
  );
}
