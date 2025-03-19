import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { label: "Timeline", path: "/timeline" },
    { label: "Mind Map", path: "/mindmap" },
    { label: "Geography", path: "/geography" },
    { label: "Characters", path: "/characters" },
  ];

  return (
    <header className="w-full py-4 px-8 backdrop-blur-lg bg-background/80 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <h1 
            onClick={() => navigate('/')}
            className="text-2xl font-medium cursor-pointer"
          >
            Chrono<span className="text-primary">Vis</span>
          </h1>
        </motion.div>
        
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className="relative px-4 py-2 transition-all duration-300"
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/about')}>
            About
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
