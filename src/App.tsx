
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Timeline from "./pages/Timeline";
import MindMap from "./pages/MindMap";
import Geography from "./pages/Geography";
import Characters from "./pages/Characters";
import Sources from "./pages/Sources";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/mindmap" element={<MindMap />} />
            <Route path="/geography" element={<Geography />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/compare" element={<Compare />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
