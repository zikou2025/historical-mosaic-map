import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { motion } from 'framer-motion';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main 
        className="flex-1 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default MainLayout;
