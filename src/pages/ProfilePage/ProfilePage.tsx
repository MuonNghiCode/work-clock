import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Contributor, fetchContributors } from "../../services/githubService";
import Background3D from "../../components/Background3D/Background3D";
import ContributorCard from "../../components/ContributorCard/ContributorCard";

const ProfilePage = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    const getContributors = async () => {
      const data = await fetchContributors();
      setContributors(data);
    };
    getContributors();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start text-white overflow-hidden px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-20 text-center px-6 relative z-5"
      >
        <h1 className="text-6xl font-extrabold text-gradient-color drop-shadow-lg">
          WorkClock Contributors
        </h1>
        <p className="text-xl mt-4 max-w-3xl mx-auto text-black">
          Meet the amazing contributors who have helped shape WorkClock. Scroll
          down to see all the contributors!
        </p>
      </motion.div>

      {/* Contributors Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full px-6 py-1 text-center mt-20 glassmorphism rounded-xl  relative z-5"
      >
        <h2 className="text-4xl font-bold text-gradient-color mb-8">
          Contributors
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {contributors.map((contributor) => (
            <ContributorCard key={contributor.id} contributor={contributor} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
