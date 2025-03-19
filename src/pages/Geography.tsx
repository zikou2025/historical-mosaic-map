
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader, Info, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { processGeographyData } from '@/utils/dataProcessing';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

interface GeoEvent {
  name: string;
  date: string;
  description: string;
  longitude: number;
  latitude: number;
}

interface GeoData {
  features: any[];
  events: GeoEvent[];
}

const Geography = () => {
  const { toast } = useToast();
  const [historyContext, setHistoryContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<GeoEvent | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  // Detect if on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Initialize map when token is provided
  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
      setShowTokenInput(false);
    }
    
    const storedContext = sessionStorage.getItem('historyContext');
    if (storedContext) {
      setHistoryContext(storedContext);
      if (mapboxToken || storedToken) {
        generateGeographicMap(storedContext, storedToken || mapboxToken);
      }
    }
  }, []);
  
  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = token;
    
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 15],
      pitch: 45,
    });
    
    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );
    
    // Disable scroll zoom for smoother experience
    map.current.scrollZoom.disable();
    
    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });
    
    // Rotation animation settings
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;
    
    // Spin globe function
    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }
    
    // Event listeners for interaction
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('moveend', () => {
      spinGlobe();
    });
    
    // Start the globe spinning
    spinGlobe();
  };
  
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };
  
  const saveMapboxToken = () => {
    localStorage.setItem('mapbox_token', mapboxToken);
    setShowTokenInput(false);
    toast({
      title: "Token saved",
      description: "Your Mapbox token has been saved locally.",
    });
    
    if (historyContext) {
      generateGeographicMap(historyContext, mapboxToken);
    }
  };
  
  const generateGeographicMap = async (context: string, token: string) => {
    setLoading(true);
    try {
      initializeMap(token);
      
      // Process the actual input text
      setTimeout(() => {
        const data = processGeographyData(context);
        renderMapboxMarkers(data);
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
  
  const renderMapboxMarkers = (data: GeoData) => {
    if (!map.current) return;
    
    // Clear previous markers
    clearMarkers();
    
    // Add event markers
    data.events.forEach(event => {
      const markerElement = document.createElement('div');
      markerElement.className = 'flex items-center justify-center w-6 h-6 bg-primary rounded-full text-white shadow-md cursor-pointer hover:bg-primary/80 transition-colors';
      markerElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
      
      // Create the marker and add it to the map
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([event.longitude, event.latitude])
        .addTo(map.current);
      
      // Add click event to show details
      markerElement.addEventListener('click', () => {
        setSelectedEvent(event);
        if (isMobile) {
          setIsDrawerOpen(true);
        } else {
          setIsSheetOpen(true);
        }
      });
      
      // Store marker reference for later cleanup
      markers.current.push(marker);
    });
    
    // Fit map to markers if there are any
    if (data.events.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      data.events.forEach(event => {
        bounds.extend([event.longitude, event.latitude]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000
      });
    }
  };
  
  const handleAnalyzeWithGemini = () => {
    toast({
      title: "Coming Soon",
      description: "Gemini integration requires Supabase connection. Please connect to Supabase to enable this feature.",
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
        
        {showTokenInput && (
          <div className="mt-4 p-4 bg-muted rounded-lg max-w-md mx-auto">
            <h3 className="font-medium mb-2">Enter your Mapbox token</h3>
            <p className="text-sm text-muted-foreground mb-3">
              To use the map feature, please enter your Mapbox public token. You can get one from the 
              <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> Mapbox website</a>.
            </p>
            <div className="flex gap-2">
              <Textarea 
                value={mapboxToken} 
                onChange={(e) => setMapboxToken(e.target.value)} 
                placeholder="Enter your Mapbox public token here..."
                className="h-10 resize-none"
              />
              <Button onClick={saveMapboxToken} disabled={!mapboxToken}>Save</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Note: This will be stored in your browser&apos;s local storage.
            </p>
          </div>
        )}
        
        <div className="mt-4 flex justify-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleAnalyzeWithGemini}
          >
            <Info className="mr-2 h-4 w-4" />
            Analyze with Gemini AI
          </Button>
        </div>
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
            ref={mapContainer}
            className="w-full h-[600px] flex items-center justify-center"
          >
            {(!mapboxToken && !localStorage.getItem('mapbox_token')) && (
              <div className="text-center p-8 rounded-lg">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Map Unavailable</h3>
                <p className="text-muted-foreground">Please provide a Mapbox token to view the map.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Mobile drawer for event details */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedEvent?.name}</DrawerTitle>
            <DrawerDescription>
              Date: {selectedEvent?.date}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <p className="text-sm">{selectedEvent?.description}</p>
            <div className="mt-4 text-xs text-muted-foreground">
              Location: {selectedEvent?.longitude.toFixed(2)}, {selectedEvent?.latitude.toFixed(2)}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Desktop side panel for event details */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedEvent?.name}</SheetTitle>
            <SheetDescription>
              Date: {selectedEvent?.date}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm">{selectedEvent?.description}</p>
            
            <h4 className="text-sm font-medium mt-4 mb-2">Location</h4>
            <div className="text-sm">
              Longitude: {selectedEvent?.longitude.toFixed(6)}<br />
              Latitude: {selectedEvent?.latitude.toFixed(6)}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleAnalyzeWithGemini}
                className="w-full"
              >
                <Info className="mr-2 h-4 w-4" />
                Analyze with Gemini AI
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Geography;
