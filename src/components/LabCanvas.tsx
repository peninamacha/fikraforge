/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Rotate3d, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function LabCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States to keep track of camera, allowing reactivity & controls
  const [rotX, setRotX] = useState<number>(0.32);
  const [rotY, setRotY] = useState<number>(-0.55);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Refs to hold current values for the mouse listener without re-triggering effects frequently
  const stateRef = useRef({ rotX, rotY, zoom, isDragging, lastMX: 0, lastMY: 0 });

  useEffect(() => {
    stateRef.current.rotX = rotX;
    stateRef.current.rotY = rotY;
    stateRef.current.zoom = zoom;
    stateRef.current.isDragging = isDragging;
  }, [rotX, rotY, zoom, isDragging]);

  // Handle Resize and Canvas drawing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.offsetWidth;
      canvas.height = Math.min(380, Math.round(container.offsetWidth * 0.55));
      draw();
    };

    // Responsive initial sizes and listner
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Whenever rotX, rotY, or zoom modifies, draw
  useEffect(() => {
    draw();
  }, [rotX, rotY, zoom]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const currentRotX = stateRef.current.rotX;
    const currentRotY = stateRef.current.rotY;
    const currentZoom = stateRef.current.zoom;

    // Clear and draw background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Grid details
    const gridOverlayIntensity = 0.05;
    ctx.fillStyle = `rgba(255, 255, 255, ${gridOverlayIntensity})`;
    
    // Draw grid mesh
    ctx.strokeStyle = 'rgba(201, 74, 26, 0.08)';
    ctx.lineWidth = 0.5;

    // 3D projections function
    function project(x: number, y: number, z: number): [number, number] {
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);

      // Intermediate camera metrics
      const y2 = y * cosX - z * sinX;
      const z2 = y * sinX + z * cosX;
      const x2 = x * cosY + z2 * sinY;
      const z3 = -x * sinY + z2 * cosY;

      // Distance factor
      const d = 6.0;
      const f = d / (d + z3 * 0.5);

      // Scale up to screen translation
      const screenX = width / 2 + x2 * f * currentZoom * 82;
      const screenY = height / 2 - y2 * f * currentZoom * 56;
      return [screenX, screenY];
    }

    // Line drawing helper
    function line(a: [number, number, number], b: [number, number, number], col: string, w: number = 1) {
      const [ax, ay] = project(...a);
      const [bx, by] = project(...b);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      ctx.stroke();
    }

    // Custom face drawing
    function face(pts: [number, number, number][], fill: string, stroke: string) {
      const p = pts.map(pt => project(...pt));
      ctx.beginPath();
      ctx.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length; i++) {
        ctx.lineTo(p[i][0], p[i][1]);
      }
      ctx.closePath();
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // 3D Prism box drawer
    function box(x: number, y: number, z: number, w: number, h: number, d: number, topC: string, sideC: string, frontC: string) {
      const BL: [number, number, number] = [x, y, z];
      const BR: [number, number, number] = [x + w, y, z];
      const BLF: [number, number, number] = [x, y, z + d];
      const BRF: [number, number, number] = [x + w, y, z + d];
      const TL: [number, number, number] = [x, y + h, z];
      const TR: [number, number, number] = [x + w, y + h, z];
      const TLF: [number, number, number] = [x, y + h, z + d];
      const TRF: [number, number, number] = [x + w, y + h, z + d];

      face([BL, BR, TR, TL], sideC, 'rgba(255,255,255,0.06)');
      face([BL, BLF, TLF, TL], sideC, 'rgba(255,255,255,0.06)');
      face([BR, BRF, TRF, TR], sideC, 'rgba(255,255,255,0.06)');
      face([TL, TR, TRF, TLF], topC, 'rgba(255,255,255,0.08)');
      face([BLF, BRF, TRF, TLF], frontC, 'rgba(255,255,255,0.1)');
    }

    // Draw baseline coordinate guidelines
    function drawGrid() {
      const colG = 'rgba(201, 74, 26, 0.15)';
      for (let i = -4; i <= 4; i++) {
        line([-4, 0, i], [4, 0, i], colG, 0.5);
        line([i, 0, -4], [i, 0, 4], colG, 0.5);
      }
    }

    // Draw text in isometric space
    function text3d(str: string, x: number, y: number, z: number, col: string, size: number = 10) {
      const [px, py] = project(x, y, z);
      ctx.fillStyle = col;
      ctx.font = `${size}px "Space Grotesk", System-UI, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(str, px, py);
    }

    // Core Drawing Flow
    drawGrid();

    // Floor outline
    face([[-4, 0, -4], [4, 0, -4], [4, 0, 4], [-4, 0, 4]], 'rgba(16,16,16,0.7)', 'rgba(201, 74, 26, 0.15)');

    // Back walls
    face([[-4, 0, -4], [4, 0, -4], [4, 3, -4], [-4, 3, -4]], 'rgba(22, 22, 22, 0.95)', 'rgba(201, 74, 26, 0.2)');
    face([[-4, 0, -4], [-4, 0, 4], [-4, 3, 4], [-4, 3, -4]], 'rgba(18, 18, 18, 0.85)', 'rgba(255, 255, 255, 0.05)');

    // Styled window panels on the back wall
    for (let i = 0; i < 5; i++) {
      const wx = -3.5 + i * 1.8;
      face(
        [
          [wx, 0.4, -3.95],
          [wx + 1.3, 0.4, -3.95],
          [wx + 1.3, 2.5, -3.95],
          [wx, 2.5, -3.95]
        ],
        i % 2 === 0 ? 'rgba(201, 74, 26, 0.08)' : 'rgba(255, 255, 255, 0.02)',
        'rgba(255, 255, 255, 0.04)'
      );
    }

    // Lab Title Logo
    text3d('⬡  FIKRAFORGE  ·  FORGE LAB  ·  DSM', 0.0, 2.7, -3.9, '#C94A1A', 11);

    // WORKSTATION (Left Table)
    box(-3.2, 0, -1, 3.8, 0.1, 1.2, 'rgba(52,42,37,0.95)', 'rgba(42,34,30,0.95)', 'rgba(48,38,33,0.95)');
    
    // Workstation stand and legs
    box(-3.0, 0, -0.9, 0.1, 0.7, 0.1, '#1e1e1e', '#1a1a1a', '#181818');
    box(0.2, 0, -0.9, 0.1, 0.7, 0.1, '#1e1e1e', '#1a1a1a', '#181818');
    box(-3.0, 0, 0.0, 0.1, 0.7, 0.1, '#1e1e1e', '#1a1a1a', '#181818');
    box(0.2, 0, 0.0, 0.1, 0.7, 0.1, '#1e1e1e', '#1a1a1a', '#181818');

    // High efficiency compilation desktop monitor
    box(-2.4, 0.1, -0.6, 0.1, 0.65, 0.08, '#2d2d2d', '#252525', '#202020');
    box(-2.8, 0.75, -0.58, 0.9, 0.5, 0.04, '#121212', '#0a0a0a', '#080808');
    
    // Monitor screen glow / visual
    face(
      [
        [-2.78, 0.77, -0.56],
        [-1.92, 0.77, -0.56],
        [-1.92, 1.22, -0.56],
        [-2.78, 1.22, -0.56]
      ],
      'rgba(201, 74, 26, 0.15)',
      'rgba(201, 74, 26, 0.3)'
    );
    text3d('⚡ DEVELOPMENT', -2.35, 1.0, -0.56, 'rgba(240, 238, 233, 0.85)', 8);

    // 3D PRINTER (Right table & Apparatus)
    box(1.5, 0, 0.5, 2.0, 0.1, 1.0, 'rgba(52,42,37,0.95)', 'rgba(42,34,30,0.95)', 'rgba(48,38,33,0.95)');
    box(1.7, 0, 0.7, 0.1, 0.7, 0.1, '#1e1e1e', '#1a1a1a', '#181818');
    box(3.1, 0, 0.7, 0.1, 0.7, 0.1, '#1e1e1e', '#1a1a1a', '#181818');

    // The printer body itself
    box(1.8, 0.1, 0.6, 1.2, 0.85, 0.8, 'rgba(32,32,32,0.92)', 'rgba(26,26,26,0.92)', 'rgba(38,38,38,0.92)');
    
    // Printer build volume / interior glow
    face(
      [
        [1.85, 0.95, 0.62],
        [2.95, 0.95, 0.62],
        [2.95, 0.95, 1.38],
        [1.85, 0.95, 1.38]
      ],
      'rgba(201, 74, 26, 0.35)',
      '#C94A1A'
    );
    // Extruder arm
    box(2.35, 0.95, 0.95, 0.1, 0.5, 0.1, '#C94A1A', '#b03f15', '#df5220');
    text3d('⚙️ ADDFAB ACTIVE', 2.4, 0.6, 1.1, 'rgba(240, 238, 233, 0.85)', 8);

    // EPSON COLOR PRINTER (Middle)
    box(0.2, 0, 0.5, 1.0, 0.3, 0.8, 'rgba(230,230,230,0.15)', 'rgba(200,200,200,0.1)', 'rgba(220,220,220,0.12)');
    text3d('🖨️', 0.7, 0.22, 0.9, 'rgba(255, 255, 255, 0.65)', 15);

    // INVENTIONS & CLIPBOARD STAND (Left side background)
    box(-3.6, 0, 2.8, 0.05, 2.2, 0.05, '#9a8167', '#816b54', '#8c755d');
    box(-3.55, 0, 2.8, 0.05, 2.2, 0.05, '#9a8167', '#816b54', '#8c755d');
    face(
      [
        [-3.7, 1.4, 2.75],
        [-3.4, 1.4, 2.75],
        [-3.4, 2.3, 2.75],
        [-3.7, 2.3, 2.75]
      ],
      'rgba(245, 245, 240, 0.92)',
      'rgba(200, 190, 170, 0.4)'
    );
    text3d('📋 PATENTS', -3.55, 1.9, 2.7, 'rgba(20, 20, 20, 0.85)', 10);

    // Text descriptions
    text3d('CAD WORKSTATION', -2.3, -0.22, -0.5, 'rgba(240, 238, 233, 0.35)', 9);
    text3d('3D PRINTER (DMAKERS)', 2.4, -0.22, 1.0, 'rgba(240, 238, 233, 0.35)', 9);
    text3d('EPSON L634', 0.7, -0.22, 0.9, 'rgba(240, 238, 233, 0.35)', 9);

    // Dotted floor overlays
    ctx.setLineDash([3, 4]);
    line([-3.5, 0.01, 0], [3.5, 0.01, 0], 'rgba(201, 74, 26, 0.25)', 0.5);
    line([0, 0.01, -3.5], [0, 0.01, 3.5], 'rgba(201, 74, 26, 0.25)', 0.5);
    ctx.setLineDash([]);
  };

  // Drag interaction events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    stateRef.current.isDragging = true;
    stateRef.current.lastMX = e.clientX;
    stateRef.current.lastMY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!stateRef.current.isDragging) return;
    const dx = e.clientX - stateRef.current.lastMX;
    const dy = e.clientY - stateRef.current.lastMY;

    const newRotY = rotY + dx * 0.007;
    // Cap inclination rotX to avoid visual flips
    const newRotX = Math.max(-0.6, Math.min(0.8, rotX + dy * 0.005));

    setRotY(newRotY);
    setRotX(newRotX);
    stateRef.current.lastMX = e.clientX;
    stateRef.current.lastMY = e.clientY;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    stateRef.current.isDragging = false;
  };

  // Touch handlers for seamless mobile access
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      stateRef.current.isDragging = true;
      stateRef.current.lastMX = e.touches[0].clientX;
      stateRef.current.lastMY = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!stateRef.current.isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - stateRef.current.lastMX;
    const dy = e.touches[0].clientY - stateRef.current.lastMY;

    const newRotY = rotY + dx * 0.007;
    const newRotX = Math.max(-0.6, Math.min(0.8, rotX + dy * 0.005));

    setRotY(newRotY);
    setRotX(newRotX);
    stateRef.current.lastMX = e.touches[0].clientX;
    stateRef.current.lastMY = e.touches[0].clientY;
  };

  // Camera presets
  const handleReset = () => {
    setRotX(0.32);
    setRotY(-0.55);
    setZoom(1.0);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(1.8, prev + 0.15));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.65, prev - 0.15));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Visual Workspace wrapper */}
      <div 
        ref={containerRef} 
        className="relative w-full overflow-hidden border border-white/8 rounded-2xl bg-[#0a0a0a] shadow-2xl group cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
          className="block w-full"
        />

        {/* Floating controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#080808]/85 backdrop-blur-md border border-white/10 rounded-xl p-2 z-10">
          <button
            onClick={handleReset}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="Reset View"
            aria-label="Reset View"
          >
            <Rotate3d className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/10" />
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive hints */}
        <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C94A1A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C94A1A]"></span>
          </span>
          <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Interactive Live Rig</span>
        </div>
      </div>
    </div>
  );
}
