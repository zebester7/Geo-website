// components/Cursor.tsx
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface CursorProps {
  color?: string;
  size?: number;
  trailing?: boolean;
}

export default function CustomCursor({ 
  color = "#D35400", 
  size = 32,
  trailing = true 
}: CursorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const trailX = useMotionValue(0);
  const trailY = useMotionValue(0);
  const trailXSpring = useSpring(trailX, { damping: 20, stiffness: 200, mass: 0.8 });
  const trailYSpring = useSpring(trailY, { damping: 20, stiffness: 200, mass: 0.8 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (trailing) {
        setTimeout(() => {
          trailX.set(e.clientX);
          trailY.set(e.clientY);
        }, 50);
      }
    };
    
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('button, a, [role="button"], .cursor-pointer');
      setIsPointer(!!isClickable);
      
      const isHoverable = target.closest('div, li, .group');
      setIsHovering(!!isHoverable);
    };
    
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleHover);
    
    document.body.style.cursor = "none";
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleHover);
      document.body.style.cursor = "auto";
    };
  }, [cursorX, cursorY, trailX, trailY, trailing]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: isPointer ? size * 1.5 : isHovering ? size * 1.2 : size,
          height: isPointer ? size * 1.5 : isHovering ? size * 1.2 : size,
          backgroundColor: color,
          opacity: 0.85,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
      
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full bg-white"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: 4,
          height: 4,
          marginLeft: -2,
          marginTop: -2,
        }}
      />
      
      {trailing && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full opacity-40"
          style={{
            x: trailXSpring,
            y: trailYSpring,
            width: size * 0.6,
            height: size * 0.6,
            backgroundColor: color,
          }}
        />
      )}
    </>
  );
}