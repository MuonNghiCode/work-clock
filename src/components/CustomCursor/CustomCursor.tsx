import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent): void => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200); // Hiệu ứng thu nhỏ sau 200ms
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <>
      {/* Ẩn con trỏ mặc định */}
      {/* <style>{`* { cursor: none; }`}</style> */}

      {/* Con trỏ tùy chỉnh */}
      <div
        className={`fixed bg-[#ff914d] z-99 rounded-full pointer-events-none 
        transition-transform transform -translate-x-1/2 -translate-y-1/2 
        `}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isClicked ? "30px" : "20px", // Phóng to khi click
          height: isClicked ? "30px" : "20px", // Phóng to khi click
          transition: "width 0.2s ease, height 0.2s ease",
        }}
      />
    </>
  );
};

export default CustomCursor;
