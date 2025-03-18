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
      className=" min-h-screen flex flex-col gap-8 bg-transparent"
    >
      <Dashboard />
    </motion.div>
  );
};

export default AdminDashBoard;
