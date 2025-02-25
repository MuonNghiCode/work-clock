import { motion } from "framer-motion";
import { Contributor } from "../../services/githubService";

interface ContributorCardProps {
  contributor: Contributor;
}

const ContributorCard: React.FC<ContributorCardProps> = ({ contributor }) => {
  return (
    <motion.a
      key={contributor.id}
      href={contributor.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex flex-col items-center p-6 rounded-xl shadow-lg glassmorphism 
                 transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
      whileHover={{ scale: 1.1 }}
    >
      <div className="absolute inset-0 bg-orange-500 opacity-10 rounded-xl"></div>
      <img
        src={contributor.avatar_url}
        alt={contributor.login}
        className="w-24 h-24 rounded-full border-4 border-orange-400 shadow-md"
        loading="lazy"
      />
      <p className="mt-4 font-semibold text-lg text-black">
        {contributor.login}
      </p>
    </motion.a>
  );
};

export default ContributorCard;
