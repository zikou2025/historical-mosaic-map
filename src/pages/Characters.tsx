
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader, Info, User, Building, Map, BookOpen, UserCheck, MessageSquare, Robot } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactFlow, { 
  Node, 
  Edge, 
  Background, 
  Controls, 
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import { processCharacterNetworkData } from '@/utils/dataProcessing';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";

// Custom node types for different entity types
const entityTypeIcons = {
  person: User,
  organization: Building,
  location: Map,
  concept: BookOpen,
  unknown: Users
};

// Custom node component for different entity types
const EntityNode = ({ data }) => {
  const IconComponent = entityTypeIcons[data.entityType || 'unknown'] || entityTypeIcons.unknown;
  
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center w-full h-full">
      <IconComponent className="mb-2" size={24} />
      <div className="font-semibold">{data.label}</div>
      {data.role && <div className="text-xs opacity-70">{data.role}</div>}
    </div>
  );
};

const CharacterProfileData = ({ character, relationships }) => {
  if (!character) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {character.data.entityType === 'person' && <User className="text-primary" />}
        {character.data.entityType === 'organization' && <Building className="text-primary" />}
        {character.data.entityType === 'location' && <Map className="text-primary" />}
        {character.data.entityType === 'concept' && <BookOpen className="text-primary" />}
        {(!character.data.entityType || character.data.entityType === 'unknown') && <Users className="text-primary" />}
        <h3 className="text-lg font-medium">{character.data.label}</h3>
      </div>
      
      {character.data.description && (
        <div className="bg-secondary/30 p-3 rounded-md">
          <p className="text-sm">{character.data.description}</p>
        </div>
      )}
      
      {character.data.traits && character.data.traits.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Traits</h4>
          <div className="flex flex-wrap gap-1">
            {character.data.traits.map((trait, i) => (
              <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {relationships.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Relationships</h4>
          <div className="space-y-2">
            {relationships.map((edge) => (
              <div 
                key={edge.id} 
                className="flex items-center justify-between text-sm p-2 border rounded-md"
              >
                <span>{edge.targetName || edge.sourceName}</span>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {edge.label}
                  </span>
                  {edge.data?.description && (
                    <span className="text-xs text-muted-foreground mt-1">
                      {edge.data.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Characters = () => {
  const { toast } = useToast();
  const [historyContext, setHistoryContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Define custom node types
  const nodeTypes: NodeTypes = {
    entity: EntityNode
  };
  
  useEffect(() => {
    const storedContext = sessionStorage.getItem('historyContext');
    if (storedContext) {
      setHistoryContext(storedContext);
      generateCharacterNetwork(storedContext);
    }
  }, []);

  const generateCharacterNetwork = async (context: string) => {
    setLoading(true);
    try {
      // Process the actual input text
      setTimeout(() => {
        const data = processCharacterNetworkData(context);
        setNodes(data.nodes);
        setEdges(data.edges);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating character network:", error);
      toast({
        title: "Error",
        description: "Failed to generate character network. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsSheetOpen(true);
  };

  const handleAnalyzeWithGemini = async () => {
    if (!historyContext) {
      toast({
        title: "No Text Available",
        description: "Please provide some text on the home page first.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzeLoading(true);
    setAiError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-characters', {
        body: { text: historyContext }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data || !data.characters) {
        throw new Error("Invalid response from AI service");
      }

      // Transform Gemini response to ReactFlow nodes and edges
      const transformedData = transformGeminiDataToReactFlow(data);
      
      // Update the visualization
      setNodes(transformedData.nodes);
      setEdges(transformedData.edges);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${data.characters.length} characters and ${data.relationships ? data.relationships.length : 0} relationships.`,
      });
    } catch (error) {
      console.error("Error analyzing with Gemini:", error);
      setAiError(error.message);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze text with AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzeLoading(false);
    }
  };

  // Transform Gemini API response to ReactFlow format
  const transformGeminiDataToReactFlow = (data) => {
    const { characters, relationships } = data;
    
    // Create a lookup for character names to IDs
    const characterIdMap = {};
    
    // Transform characters to nodes
    const nodes = characters.map((character, index) => {
      const id = `char-${index}`;
      characterIdMap[character.name] = id;
      
      // Calculate position in a circle layout
      const radius = 250; // Radius of the circle
      const angle = (index / characters.length) * 2 * Math.PI;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);
      
      // Set node style based on entity type and importance
      const getNodeStyle = (entityType, importance) => {
        const baseStyle = {
          width: 120,
          height: 120,
          border: '1px solid',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8px',
        };
        
        const styles = {
          person: {
            ...baseStyle,
            background: 'hsl(var(--primary) / 0.2)',
            borderColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary))'
          },
          organization: {
            ...baseStyle,
            background: 'hsl(var(--destructive) / 0.2)',
            borderColor: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive))'
          },
          location: {
            ...baseStyle,
            background: 'hsl(215 20.2% 65.1% / 0.2)',
            borderColor: 'hsl(215 20.2% 65.1%)',
            color: 'hsl(215 20.2% 65.1%)'
          },
          concept: {
            ...baseStyle,
            background: 'hsl(24.6 95% 53.1% / 0.2)',
            borderColor: 'hsl(24.6 95% 53.1%)',
            color: 'hsl(24.6 95% 53.1%)'
          },
          unknown: {
            ...baseStyle,
            background: 'hsl(var(--secondary) / 0.4)',
            borderColor: 'hsl(var(--secondary))',
            color: 'hsl(var(--foreground))'
          }
        };

        // Adjust size based on importance
        const importanceScale = importance ? Math.min(importance / 5, 2) : 1;
        const style = styles[entityType || 'unknown'] || styles.unknown;
        
        return {
          ...style,
          width: style.width * importanceScale,
          height: style.height * importanceScale,
        };
      };
      
      return {
        id,
        type: 'entity',
        position: { x, y },
        data: {
          label: character.name,
          role: character.role,
          entityType: character.entityType || 'unknown',
          description: character.description,
          traits: character.traits,
          importance: character.importance
        },
        style: getNodeStyle(character.entityType, character.importance)
      };
    });

    // Transform relationships to edges
    const edges = relationships ? relationships.map((relationship, index) => {
      const sourceId = characterIdMap[relationship.source];
      const targetId = characterIdMap[relationship.target];
      
      if (!sourceId || !targetId) {
        console.warn(`Could not find node for ${!sourceId ? relationship.source : relationship.target}`);
        return null;
      }
      
      // Determine edge style based on relationship type
      const getEdgeStyle = (type, strength) => {
        const strokeWidth = strength ? Math.max(1, Math.min(strength / 2, 5)) : 2;
        
        const styles = {
          ally: { stroke: 'hsl(var(--primary))' },
          enemy: { stroke: 'hsl(var(--destructive))' },
          family: { stroke: 'hsl(24.6 95% 53.1%)' },
          colleague: { stroke: 'hsl(215 20.2% 65.1%)' },
          default: { stroke: 'hsl(var(--secondary))' }
        };
        
        return {
          ...styles[type] || styles.default,
          strokeWidth
        };
      };
      
      return {
        id: `edge-${index}`,
        source: sourceId,
        target: targetId,
        label: relationship.type,
        animated: relationship.type === 'enemy',
        style: getEdgeStyle(relationship.type, relationship.strength),
        data: {
          description: relationship.description,
          strength: relationship.strength
        },
        // Add these for the sidebar's relationship rendering
        sourceName: relationship.source,
        targetName: relationship.target
      };
    }).filter(Boolean) : [];

    return { nodes, edges };
  };

  // Get relationships for the selected node
  const getSelectedNodeRelationships = () => {
    if (!selectedNode) return [];
    
    return edges.filter(edge => 
      edge.source === selectedNode.id || edge.target === selectedNode.id
    );
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
          <Users className="h-6 w-6 text-primary" />
          Character Network
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Visualizing connections and relationships between key figures.
        </p>
        
        <div className="mt-4">
          <Button 
            onClick={handleAnalyzeWithGemini}
            disabled={analyzeLoading || !historyContext}
            className="mt-2"
          >
            {analyzeLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with Gemini AI
              </>
            ) : (
              <>
                <Robot className="mr-2 h-4 w-4" />
                Analyze with Gemini AI
              </>
            )}
          </Button>
          {aiError && (
            <p className="text-sm text-destructive mt-2">{aiError}</p>
          )}
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
          <p className="mt-4 text-muted-foreground">Generating character network...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel relative"
          style={{ height: 600 }}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-right"
            >
              <Background />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </motion.div>
      )}

      {/* Side panel for character details */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedNode?.data.label}</SheetTitle>
            <SheetDescription>
              {selectedNode?.data.role}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <CharacterProfileData 
              character={selectedNode} 
              relationships={getSelectedNodeRelationships()} 
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Characters;
