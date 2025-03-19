import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, Clock, MapPin, Users, GitBranch, 
  Image, ArrowLeftRight, BookOpen
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [historyInput, setHistoryInput] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!historyInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a historical context or story to visualize.",
        variant: "destructive",
      });
      return;
    }
    
    // Store the input in sessionStorage for use in visualization components
    sessionStorage.setItem('historyContext', historyInput);
    
    // Navigate to timeline view
    navigate('/timeline');
  };
  
  const featureCards = [
    {
      title: "Timeline Creation",
      description: "Visualize chronological events with dates, figures, and pivotal moments.",
      icon: <Calendar className="w-6 h-6 text-primary" />,
      delay: 0.1,
      path: '/timeline'
    },
    {
      title: "Mind Maps",
      description: "Connect historical events with related factors in an interactive web.",
      icon: <GitBranch className="w-6 h-6 text-primary" />,
      delay: 0.2,
      path: '/mindmap'
    },
    {
      title: "Geographic Mapping",
      description: "Plot events on maps to understand spatial relationships and influences.",
      icon: <MapPin className="w-6 h-6 text-primary" />,
      delay: 0.3,
      path: '/geography'
    },
    {
      title: "Character Networks",
      description: "Explore relationships between key historical figures and their influences.",
      icon: <Users className="w-6 h-6 text-primary" />,
      delay: 0.4,
      path: '/characters'
    },
    {
      title: "Visual Primary Sources",
      description: "Examine period artwork and artifacts to immerse in the visual world of the time.",
      icon: <Image className="w-6 h-6 text-primary" />,
      delay: 0.5,
      path: '/sources'
    },
    {
      title: "Comparative Visuals",
      description: "Create side-by-side comparisons of historical scenarios and developments.",
      icon: <ArrowLeftRight className="w-6 h-6 text-primary" />,
      delay: 0.6,
      path: '/compare'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        className="text-center mb-12 mt-8 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block mb-4 p-2 rounded-full bg-primary/10"
        >
          <Clock className="w-8 h-8 text-primary" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Visualize <span className="text-primary">History</span> Like Never Before
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-balance">
          Transform historical contexts into interactive visual experiences. 
          Input your historical narrative and watch it come to life through timelines, 
          mind maps, geographic explorations and more.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col gap-4">
            <Input
              value={historyInput}
              onChange={(e) => setHistoryInput(e.target.value)}
              placeholder="Enter a historical context, era, or narrative to visualize..."
              className="w-full h-32 p-4 text-lg border-2 focus-visible:ring-2 transition-all duration-300"
              type="text"
              as="textarea"
            />
            <Button type="submit" size="lg" className="interactive-element">
              <BookOpen className="mr-2 h-5 w-5" />
              Visualize History
            </Button>
          </div>
        </form>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-12">
        {featureCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="h-full"
          >
            <Card 
              className="h-full glass-panel hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30 overflow-hidden"
              onClick={() => navigate(card.path)}
            >
              <CardContent className="p-6 flex flex-col h-full cursor-pointer">
                <div className="mb-4 p-2 w-fit rounded-full bg-primary/10">
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-muted-foreground flex-1">{card.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Index;
