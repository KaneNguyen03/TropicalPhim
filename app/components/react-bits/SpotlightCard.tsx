'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '../ui/utils';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SpotlightCard({ children, className, ...props }: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  // Cache rect để tránh getBoundingClientRect() trên mỗi mousemove (forced reflow)
  const rectRef = useRef<DOMRect | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  // Invalidate cache khi window resize — dùng ResizeObserver thay vì đọc rect mỗi move
  useEffect(() => {
    const el = divRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      // Chỉ invalidate cache, không đọc rect ngay (tránh forced reflow trong observer callback)
      rectRef.current = null;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    // Đọc rect từ cache — chỉ gọi getBoundingClientRect() khi cache invalid
    // Điều này tránh forced reflow: browser không cần sync recalculate layout
    if (!rectRef.current) {
      rectRef.current = divRef.current.getBoundingClientRect();
    }

    setPosition({
      x: e.clientX - rectRef.current.left,
      y: e.clientY - rectRef.current.top,
    });
  }, [isFocused]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setOpacity(1);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setOpacity(0);
  }, []);

  const handleMouseEnter = useCallback(() => {
    // Refresh cache khi mouse enter — element có thể đã scroll/reposition
    rectRef.current = divRef.current?.getBoundingClientRect() ?? null;
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4 transition-colors',
        className
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(204,255,0,.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
