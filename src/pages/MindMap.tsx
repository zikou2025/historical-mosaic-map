import React, { useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  MarkerType,
} from '@xyflow/react';
import { motion } from 'framer-motion';
import { Loader, GitBranch } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { processMindMapData } from '@/utils/dataProcessing';
import '@xyflow/react/dist/style.css';

const initialNodes = [];
const initialEdges = [];

const MindMap = () => {
  const { toast } = useToast();
  const [historyContext, setHistoryContext] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const storedContext = sessionStorage.getItem('historyContext');
    if (storedContext) {
      setHistoryContext(storedContext);
      generateMindMap(storedContext);
    }
  }, []);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => 
      addEdge({
        ...params,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      }, eds)
    );
  }, [setEdges]);

  const generateMindMap = async (context: string) => {
    setLoading(true);
    try {
      // Normally would call an AI service here
      setTimeout(() => {
        const { nodes: generatedNodes, edges: generatedEdges } = processMindMapData(context);
        setNodes(generatedNodes);
        setEdges(generatedEdges);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating mind map:", error);
      toast({
        title: "Error",
        description: "Failed to generate mind map. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <GitBranch className="h-6 w-6 text-primary" />
          Historical Mind Map
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Exploring connections and relationships between historical elements.
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
          <p className="mt-4 text-muted-foreground">Generating mind map...</p>
        </div>
      ) : (
        <div className="w-full h-[70vh] glass-panel overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionLineType={ConnectionLineType.SmoothStep}
            defaultZoom={1}
            minZoom={0.1}
            maxZoom={2}
            fitView
            attributionPosition="bottom-right"
          >
            <Background />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case 'input':
                    return 'hsl(var(--primary))';
                  case 'output':
                    return 'hsl(var(--secondary))';
                  default:
                    return 'hsl(var(--muted))';
                }
              }}
              maskColor="rgba(255, 255, 255, 0.1)"
            />
          </ReactFlow>
        </div>
      )}
    </div>
  );
};

export default MindMap;
