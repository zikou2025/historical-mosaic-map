
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Loader } from 'lucide-react';
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
import { processMindMapData } from '@/utils/dataProcessing';

const MindMap = () => {
  const { toast } = useToast();
  const [historyContext, setHistoryContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  useEffect(() => {
    const storedContext = sessionStorage.getItem('historyContext');
    if (storedContext) {
      setHistoryContext(storedContext);
      generateMindMap(storedContext);
    }
  }, []);

  const generateMindMap = async (context: string) => {
    setLoading(true);
    try {
      // Process the actual input text
      setTimeout(() => {
        const data = processMindMapData(context);
        setNodes(data.nodes);
        setEdges(data.edges);
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

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
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
          <Network className="h-6 w-6 text-primary" />
          Mind Map Generation
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Visualizing concepts and their relationships from your historical context.
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

      {selectedNode && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 border rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-medium">{selectedNode.data.label}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Click on nodes to explore relationships and connections between concepts
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MindMap;
