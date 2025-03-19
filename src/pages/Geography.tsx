import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { processGeographyData } from '@/utils/dataProcessing';
import * as d3 from 'd3';

const Geography = () => {
  const { toast } = useToast();
  const [historyContext, setHistoryContext] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const storedContext = sessionStorage.getItem('historyContext');
    if (storedContext) {
      setHistoryContext(storedContext);
      generateGeographicMap(storedContext);
    }
  }, []);

  const generateGeographicMap = async (context: string) => {
    setLoading(true);
    try {
      // Normally would call an AI service here
      setTimeout(() => {
        const data = processGeographyData(context);
        renderMap(data);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating geographic map:", error);
      toast({
        title: "Error",
        description: "Failed to generate geographic map. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const renderMap = (data: any) => {
    // Clear previous map
    d3.select('#map-container').selectAll('*').remove();
    
    const width = document.getElementById('map-container')?.clientWidth || 800;
    const height = 500;
    
    // Create SVG element
    const svg = d3.select('#map-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('class', 'bg-white rounded-xl');
    
    // Create a projection
    const projection = d3.geoMercator()
      .scale(150)
      .translate([width / 2, height / 2]);
    
    // Create a path generator
    const path = d3.geoPath().projection(projection);
    
    // Create a group for the map
    const g = svg.append('g');
    
    // Add world map data (simplified example)
    d3.json('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
      .then((geoData: any) => {
        const countries = g.selectAll('path')
          .data(data.features || [])
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', '#f0f0f0')
          .attr('stroke', '#ccc')
          .attr('stroke-width', 0.5);
        
        // Add event locations
        g.selectAll('circle')
          .data(data.events || [])
          .enter()
          .append('circle')
          .attr('cx', (d: any) => projection([d.longitude, d.latitude])[0])
          .attr('cy', (d: any) => projection([d.longitude, d.latitude])[1])
          .attr('r', 5)
          .attr('fill', 'hsl(var(--primary))')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1)
          .attr('opacity', 0.8)
          .on('mouseover', function(event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('r', 8)
              .attr('opacity', 1);
            
            // Show tooltip
            svg.append('text')
              .attr('id', 'tooltip')
              .attr('x', projection([d.longitude, d.latitude])[0] + 10)
              .attr('y', projection([d.longitude, d.latitude])[1] - 10)
              .attr('fill', '#333')
              .text(d.name);
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('r', 5)
              .attr('opacity', 0.8);
            
            // Remove tooltip
            svg.select('#tooltip').remove();
          });
      });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Geographic Mapping
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Visualizing historical events and their geographic context.
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
          <p className="mt-4 text-muted-foreground">Generating geographic map...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel overflow-hidden"
        >
          <div 
            id="map-container" 
            className="w-full h-[600px] flex items-center justify-center"
          ></div>
        </motion.div>
      )}
    </div>
  );
};

export default Geography;
