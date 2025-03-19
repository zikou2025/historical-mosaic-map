import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Loader } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { processTimelineData } from '@/utils/dataProcessing';

const Timeline = () => {
  const { toast } = useToast();
  const [historyContext, setHistoryContext] = useState('');
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const storedContext = sessionStorage.getItem('historyContext');
    if (storedContext) {
      setHistoryContext(storedContext);
      generateTimeline(storedContext);
    }
  }, []);

  const generateTimeline = async (context: string) => {
    setLoading(true);
    try {
      // Normally would call an AI service here
      // For now, we'll use a placeholder data processor
      setTimeout(() => {
        const data = processTimelineData(context);
        setTimelineData(data);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating timeline:", error);
      toast({
        title: "Error",
        description: "Failed to generate timeline. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Historical Timeline
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Visualizing the chronological flow of events from your historical context.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="h-10 w-10 text-primary" />
          </motion.div>
          <p className="mt-4 text-muted-foreground">Generating timeline...</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline center line */}
          <div className="timeline-line"></div>
          
          {/* Timeline events */}
          <div className="space-y-16">
            {timelineData.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                {/* Date marker */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                
                {/* Content card - alternating sides */}
                <div className={`w-5/12 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
                  <Card className="node-card overflow-hidden">
                    <CardContent className="p-5">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="mb-2 text-sm font-medium text-primary"
                      >
                        {event.date}
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground">{event.description}</p>
                      {event.key_figures && (
                        <div className="mt-4 text-sm">
                          <span className="font-medium">Key Figures: </span>
                          {event.key_figures.join(", ")}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
