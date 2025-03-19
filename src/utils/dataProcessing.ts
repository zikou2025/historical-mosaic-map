// Helper function to extract years or dates from text
const extractDatesFromText = (text: string): Date[] => {
  // Look for years (4 digits) or full dates in the text
  const yearRegex = /\b(1[0-9]{3}|20[0-2][0-9])\b/g;
  const years = Array.from(text.matchAll(yearRegex), match => parseInt(match[0]));
  
  // Convert years to dates
  const dates = years.map(year => new Date(year, 0, 1));
  
  // If we found no dates, generate some placeholder dates
  if (dates.length === 0) {
    const currentYear = new Date().getFullYear();
    return [
      new Date(currentYear - 100, 0, 1),
      new Date(currentYear - 75, 0, 1),
      new Date(currentYear - 50, 0, 1),
      new Date(currentYear - 25, 0, 1),
      new Date(currentYear, 0, 1),
    ];
  }
  
  // Sort dates chronologically
  return dates.sort((a, b) => a.getTime() - b.getTime());
};

// Extract sentences containing keywords from text
const extractSentencesWithKeywords = (text: string, keywords: string[]): string[] => {
  // Split the text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  // Filter sentences that contain any of the keywords
  return sentences.filter(sentence => 
    keywords.some(keyword => 
      sentence.toLowerCase().includes(keyword.toLowerCase())
    )
  );
};

// Extract key figures or people mentioned in the text
const extractKeyFigures = (text: string): string[] => {
  // This is a simple implementation - would be better with NLP
  // We'll look for capitalized words that might be names
  const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
  const potentialNames = Array.from(new Set(text.match(nameRegex) || []));
  
  // Filter out common words that might be capitalized but aren't names
  const commonWords = ["The", "A", "An", "And", "But", "Or", "For", "Nor", "Yet", "So"];
  return potentialNames
    .filter(name => !commonWords.includes(name))
    .slice(0, 5); // Limit to 5 names
};

// Format date to string
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Generate timeline data based on actual input text
export const processTimelineData = (context: string) => {
  const dates = extractDatesFromText(context);
  const keyFigures = extractKeyFigures(context);
  
  // Split text into sentences
  const sentences = context.match(/[^.!?]+[.!?]+/g) || [];
  
  // Generate timeline events
  return dates.map((date, index) => {
    // Get a random sentence for the description
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)] || 
      "Historical event occurred.";
    
    // Create a title based on context words
    const words = context.split(/\s+/).filter(word => word.length > 4);
    const randomWord = words[Math.floor(Math.random() * words.length)] || "Event";
    
    return {
      date: formatDate(date),
      title: `Historical Event: ${randomWord}`,
      description: randomSentence.trim(),
      key_figures: keyFigures
    };
  });
};

// Extract concepts for mind map from text
const extractConcepts = (text: string): string[] => {
  // Look for capitalized phrases or important nouns
  const words = text.split(/\s+/);
  const importantWords = words.filter(word => 
    word.length > 5 && 
    !word.match(/^[^a-zA-Z]/) // Filter out words that start with non-letters
  );
  
  // Get unique words
  return Array.from(new Set(importantWords)).slice(0, 6);
};

// Generate mind map data based on actual input text
export const processMindMapData = (context: string) => {
  const concepts = extractConcepts(context);
  const centralTopic = concepts[0] || "Historical Event";
  
  // Create nodes and edges for the mind map
  const nodes = [
    {
      id: 'central',
      type: 'input',
      data: { label: centralTopic },
      position: { x: 250, y: 250 },
      style: { 
        background: 'hsl(var(--primary))',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px',
        width: 180,
      },
    }
  ];
  
  const edges: any[] = [];
  
  // Add remaining concepts as nodes connected to the central topic
  concepts.slice(1).forEach((concept, index) => {
    // Position nodes around the central node
    const angle = (index * Math.PI * 2) / (concepts.length - 1);
    const x = 250 + Math.cos(angle) * 200;
    const y = 250 + Math.sin(angle) * 200;
    
    const nodeId = `concept-${index}`;
    nodes.push({
      id: nodeId,
      type: 'default',
      data: { label: concept },
      position: { x, y },
      style: { 
        borderRadius: '8px', 
        padding: '10px',
        background: 'white',
        color: 'black',
        border: '1px solid #e2e8f0',
        width: 150,
      },
    });
    
    // Connect to central node
    edges.push({
      id: `e-central-${nodeId}`,
      source: 'central',
      target: nodeId,
      animated: true,
      label: 'Related to',
    });
  });
  
  return { nodes, edges };
};

// Extract locations from text
const extractLocations = (text: string): {name: string, coordinates: [number, number]}[] => {
  // This is a simplified implementation
  // In a real application, we would use a geocoding API to get actual coordinates
  
  // Common locations and approximate coordinates
  const commonLocations: {[key: string]: [number, number]} = {
    "London": [-0.1276, 51.5074],
    "Paris": [2.3522, 48.8566],
    "Berlin": [13.4050, 52.5200],
    "Rome": [12.4964, 41.9028],
    "Moscow": [37.6173, 55.7558],
    "New York": [-74.0059, 40.7128],
    "Tokyo": [139.6917, 35.6895],
    "Beijing": [116.4074, 39.9042],
    "Delhi": [77.1025, 28.7041],
    "Cairo": [31.2357, 30.0444],
    "Sydney": [151.2093, -33.8688],
    "Rio de Janeiro": [-43.1729, -22.9068],
    "Mexico City": [-99.1332, 19.4326],
    "Lagos": [3.3792, 6.5244],
    "Washington": [-77.0369, 38.9072],
    "USA": [-95.7129, 37.0902],
    "UK": [-3.4359, 55.3781],
    "France": [2.2137, 46.2276],
    "Germany": [10.4515, 51.1657],
    "Italy": [12.5674, 42.5033],
    "Russia": [105.3188, 61.5240],
    "China": [104.1954, 35.8617],
    "India": [78.9629, 20.5937],
    "Japan": [138.2529, 36.2048],
    "Brazil": [-51.9253, -14.2350],
    "Africa": [19.4902, 8.7832],
    "Europe": [15.2551, 54.5260],
    "Asia": [100.6197, 34.0479],
    "North America": [-105.2551, 54.5260],
    "South America": [-58.9302, -23.4425],
    "Australia": [133.7751, -25.2744],
    "Antarctica": [135.0000, -82.8628]
  };
  
  // Extract potential location names from text
  const extractedLocations: {name: string, coordinates: [number, number]}[] = [];
  
  Object.entries(commonLocations).forEach(([locationName, coordinates]) => {
    if (text.includes(locationName)) {
      extractedLocations.push({
        name: locationName,
        coordinates: coordinates
      });
    }
  });
  
  return extractedLocations.length > 0 ? extractedLocations : [
    { name: "Sample Location", coordinates: [0, 0] }
  ];
};

// Generate geography data based on actual input text
export const processGeographyData = (context: string) => {
  const locations = extractLocations(context);
  const sentences = context.match(/[^.!?]+[.!?]+/g) || [];
  const dates = extractDatesFromText(context);
  
  // Extract key events for each location
  const events = locations.map((location, index) => {
    const year = dates[index % dates.length]?.getFullYear() || (1900 + index * 20);
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)] || 
      "Historical event occurred.";
    
    return {
      name: `Event in ${location.name}`,
      date: year.toString(),
      description: randomSentence.trim(),
      longitude: location.coordinates[0],
      latitude: location.coordinates[1],
    };
  });
  
  return {
    features: [],
    events: events,
  };
};

// Process the character network data
export const processCharacterNetworkData = (context: string) => {
  const keyFigures = extractKeyFigures(context);
  
  // If no key figures found, use placeholder names
  const figures = keyFigures.length > 0 ? keyFigures : [
    "Historical Figure A",
    "Historical Figure B",
    "Historical Figure C",
    "Historical Figure D",
    "Historical Figure E"
  ];
  
  // Create node for central figure
  const nodes = [
    {
      id: 'char1',
      type: 'entity',
      data: { 
        label: figures[0] || "Central Figure",
        role: 'leader',
        entityType: 'person'
      },
      position: { x: 250, y: 250 },
      style: { 
        background: 'hsl(var(--primary))',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        padding: '10px',
        width: 150,
        height: 150,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center' as const,
      },
    }
  ];
  
  const edges: any[] = [];
  
  // Different relationship types
  const relationships = ['Ally', 'Mentor', 'Enemy', 'Rival', 'Friend', 'Collaborator'];
  const entityTypes = ['person', 'organization', 'concept', 'location'];
  
  // Position other figures around the central one
  figures.slice(1).forEach((figure, index) => {
    // Alternate between allies and opponents
    const isAlly = index % 2 === 0;
    const role = isAlly ? 'ally' : 'opponent';
    
    // Assign a random entity type
    const entityType = entityTypes[index % entityTypes.length];
    
    // Calculate position (alternating between quadrants)
    const quadrant = index % 4;
    let x = 250, y = 250;
    
    if (quadrant === 0) { x = 100; y = 100; }
    else if (quadrant === 1) { x = 400; y = 100; }
    else if (quadrant === 2) { x = 100; y = 400; }
    else { x = 400; y = 400; }
    
    // Add node
    const nodeId = `char${index + 2}`;
    nodes.push({
      id: nodeId,
      type: 'entity',
      data: { 
        label: figure,
        role: role,
        entityType: entityType
      },
      position: { x, y },
      style: { 
        background: isAlly ? 'white' : 'hsl(var(--destructive))',
        color: isAlly ? 'black' : 'white',
        border: isAlly ? '1px solid #ccc' : 'none',
        borderRadius: '50%',
        padding: '10px',
        width: 100,
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center' as const,
      },
    });
    
    // Add edge
    const relationship = relationships[index % relationships.length];
    edges.push({ 
      id: `e1-${index + 2}`, 
      source: 'char1', 
      target: nodeId, 
      animated: true, 
      label: relationship,
      style: { stroke: isAlly ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' },
    });
  });
  
  return { nodes, edges };
};
