import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const outlineRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const outline = outlineRef.current;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
      
      gsap.to(outline, {
        x: clientX,
        y: clientY,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, outline], { scale: 0.8, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to([cursor, outline], { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor fixed top-0 left-0 hidden md:block" />
      <div ref={outlineRef} className="custom-cursor-outline fixed top-0 left-0 hidden md:block" />
    </>
  );
};

export default CustomCursor;
