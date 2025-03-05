import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { Contributor } from "../../services/githubService";

interface ContributorCardProps {
  contributor: Contributor;
}

const ContributorCard: React.FC<ContributorCardProps> = ({ contributor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const opacity = useTransform(rotateX, [-20, 20], [0, 1]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;

    rotateX.set(-(y / height) * 20);
    rotateY.set((x / width) * 20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.a
      key={contributor.id}
      href={contributor.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex flex-col items-center p-6 rounded-xl shadow-lg glassmorphism
                 transform transition-all duration-300 hover:shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
      }}
    >
      {/* Avatar */}
      <motion.img
        src={contributor.avatar_url}
        alt={contributor.login}
        className="w-24 h-24 rounded-full border-4 border-orange-400 shadow-md"
        loading="lazy"
        style={{
          rotateX,
          rotateY,
        }}
      />

      {/* Hiệu ứng Pixelated Reveal */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-orange-500 rounded-xl text-white font-bold text-lg"
        style={{
          opacity: isHovered ? 1 : 0,
          clipPath: isHovered
            ? "circle(100% at center)"
            : "circle(0% at center)",
          transition: "clip-path 0.5s ease-out",
          filter: "url(#pixelate)",
        }}
      >
        {contributor.login}
      </motion.div>

      {/* SVG Filter cho pixelated effect */}
      <svg className="absolute w-0 h-0">
        <filter id="pixelate">
          <feFlood x="4" y="4" height="10" width="10" floodColor="black" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feTile result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="atop" />
        </filter>
      </svg>
    </motion.a>
  );
};

export default ContributorCard;
