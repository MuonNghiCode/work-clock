import React, { useEffect, useRef, useState } from "react";

const AnimatedBackground: React.FC = () => {
  const blobRefs = useRef<(HTMLDivElement | null)[]>(new Array(8).fill(null)); // Initialize with 8 slots
  const [isMounted, setIsMounted] = useState(false); // Track when DOM is ready
  const initialPositions = [
    { x: -4, y: 0 },    // Blob 0
    { x: -4, y: 0 },    // Blob 1
    { x: 20, y: -8 },   // Blob 2
    { x: 20, y: -8 },   // Blob 3
    { x: 0, y: 10 },    // Blob 4
    { x: 10, y: 20 },   // Blob 5
    { x: -10, y: -10 }, // Blob 6
    { x: 5, y: -5 },    // Blob 7
  ];

  useEffect(() => {
    // Mark component as mounted once refs are assigned
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Wait until DOM is ready

    let requestId: number;

    const handleScroll = () => {
      const newScroll = window.pageYOffset;

      blobRefs.current.forEach((blob, index) => {
        if (!blob) return; // Skip if ref is null (e.g., hidden elements)

        const initialPos = initialPositions[index] || { x: 0, y: 0 };
        const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340;
        const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40;

        const x = initialPos.x + xOffset;
        const y = initialPos.y + yOffset;

        blob.style.transform = `translate(${x}px, ${y}px)`;
        blob.style.transition = "transform 1.4s ease-out";
      });

      requestId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call to set positions

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestId);
    };
  }, [isMounted]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0">
        {/* Blob cam */}
        <div
          ref={(ref) => (blobRefs.current[0] = ref)}
          className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72 bg-[#ff914d] rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[1] = ref)}
          className="absolute top-0 -right-4 w-96 h-96 bg-[#ff853a] rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 hidden sm:block"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[2] = ref)}
          className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96 bg-[#ff914d] rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[3] = ref)}
          className="absolute -bottom-10 right-20 w-96 h-96 bg-[#ff853a] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 md:opacity-10 hidden sm:block"
        ></div>

        {/* Blob trắng xen kẽ */}
        <div
          ref={(ref) => (blobRefs.current[4] = ref)}
          className="absolute top-10 left-[30%] w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-[128px] opacity-30 md:opacity-15"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[5] = ref)}
          className="absolute top-20 right-[20%] w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-[128px] opacity-30 md:opacity-15 hidden sm:block"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[6] = ref)}
          className="absolute bottom-10 left-[10%] w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-[128px] opacity-30 md:opacity-15"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[7] = ref)}
          className="absolute bottom-5 right-[5%] w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-[128px] opacity-30 md:opacity-15 hidden sm:block"
        ></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;