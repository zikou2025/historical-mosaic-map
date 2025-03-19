
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactFlow, { 
  Node, 
  Edge, 
  Background, 
  Controls, 
  ReactFlowProvider,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { processCharacterNetworkData } from '@/utils/dataProcessing';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const Characters = () => {
  const { toast } = useToast();
  const [historyContext, setHistoryContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
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
          <Users className="h-6 w-6 text-primary" />
          Character Network
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Visualizing connections and relationships between key figures.
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
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedNode?.data.label}</SheetTitle>
            <SheetDescription>
              Role: {selectedNode?.data.role}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Relationships</h4>
            <div className="space-y-2">
              {edges
                .filter(edge => edge.source === selectedNode?.id || edge.target === selectedNode?.id)
                .map(edge => {
                  const otherNodeId = edge.source === selectedNode?.id ? edge.target : edge.source;
                  const otherNode = nodes.find(node => node.id === otherNodeId);
                  return (
                    <div key={edge.id} className="flex items-center justify-between text-sm p-2 border rounded-md">
                      <span>{otherNode?.data.label}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {edge.label}
                      </span>
                    </div>
                  );
                })}
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

export default Characters;
