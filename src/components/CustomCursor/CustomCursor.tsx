import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent): void => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 150);
    };

    const handleMouseOver = () => setIsHovered(true);
    const handleMouseOut = () => setIsHovered(false);

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mousedown", handleClick);
    document.querySelectorAll("a, button, input, textarea").forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver);
      el.addEventListener("mouseout", handleMouseOut);
    });

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleClick);
      document.querySelectorAll("a, button, input, textarea").forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseout", handleMouseOut);
      });
    };
  }, []);

  return (
    <>
      <style>{`* { cursor: none; }`}</style>
      <div
        className={`fixed z-[9999] pointer-events-none transition-transform transform -translate-x-1/2 -translate-y-1/2 
        ${
          isClicked
            ? "scale-75 blur-md bg-[#ff4500] shadow-[0_0_25px_rgba(255,69,0,1)]"
            : "scale-100"
        } 
        ${
          isHovered
            ? "scale-150 bg-[#ffd700] shadow-[0_0_25px_rgba(255,215,0,1)]"
            : ""
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,145,77,1) 10%, rgba(255,69,0,1) 80%)",
          boxShadow: "0 0 20px rgba(255,145,77,1)",
          backdropFilter: "blur(5px)",
          transition:
            "transform 0.1s ease-out, background 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease",
        }}
      />
    </>
  );
};

export default CustomCursor;
