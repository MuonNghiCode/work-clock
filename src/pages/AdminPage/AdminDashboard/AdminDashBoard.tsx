import React from "react";
import Dashboard from "../../../components/AdminComponents/DashBoard/DashBoard";
import { motion } from "framer-motion";
const AdminDashBoard: React.FC = () => {
  const fadeInScaleUp = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={fadeInScaleUp}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1 }}
      className="p-8 min-h-screen flex flex-col gap-8 bg-transparent"
    >
      {/* Header Section */}
      <header className="text-center py-6">
        <h1 className="text-5xl font-extrabold text-gradient-color ">
          Admin Dashboard
        </h1>
        <p className="text-lg text-black mt-2">System analytics at a glance</p>
      </header>

      {/* Dashboard Content */}
      <section>
        <Dashboard />
      </section>
    </motion.div>
  );
};

export default AdminDashBoard;
