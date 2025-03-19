
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Info, ExternalLink } from 'lucide-react';

const Sources = () => {
  const [activeTab, setActiveTab] = useState('artwork');
  
  const sources = {
    artwork: [
      {
        id: 1,
        title: 'The Declaration of Independence',
        artist: 'John Trumbull',
        year: '1819',
        description: 'This painting depicts the presentation of the draft of the Declaration of Independence to Congress.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Declaration_of_Independence_%281819%29%2C_by_John_Trumbull.jpg/1200px-Declaration_of_Independence_%281819%29%2C_by_John_Trumbull.jpg',
        link: 'https://en.wikipedia.org/wiki/Declaration_of_Independence_(Trumbull)'
      },
      {
        id: 2,
        title: 'Liberty Leading the People',
        artist: 'Eugène Delacroix',
        year: '1830',
        description: 'A painting commemorating the July Revolution of 1830 in France.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg/1200px-Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg',
        link: 'https://en.wikipedia.org/wiki/Liberty_Leading_the_People'
      }
    ],
    artifacts: [
      {
        id: 1,
        title: 'Rosetta Stone',
        origin: 'Ancient Egypt',
        year: '196 BCE',
        description: 'The Rosetta Stone is a granodiorite stele inscribed with a decree issued in Memphis, Egypt in 196 BCE on behalf of King Ptolemy V.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rosetta_Stone.jpg/800px-Rosetta_Stone.jpg',
        link: 'https://en.wikipedia.org/wiki/Rosetta_Stone'
      },
      {
        id: 2,
        title: 'Mask of Tutankhamun',
        origin: 'Ancient Egypt',
        year: '1323 BCE',
        description: 'The mask of Tutankhamun is a gold death mask of the 18th-dynasty ancient Egyptian Pharaoh Tutankhamun.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/CairoEgMuseumTaaMaskMostlyPhotographed.jpg/800px-CairoEgMuseumTaaMaskMostlyPhotographed.jpg',
        link: 'https://en.wikipedia.org/wiki/Mask_of_Tutankhamun'
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-block mb-4 p-2 rounded-full bg-primary/10">
          <ImageIcon className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Visual Primary Sources</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Examine authentic period artwork and artifacts to gain deeper insights 
          into the visual culture and material evidence of historical periods.
        </p>
      </motion.div>

      <Tabs defaultValue="artwork" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="artwork">Artwork</TabsTrigger>
            <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="artwork" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.artwork.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full glass-panel overflow-hidden border-primary/10 hover:border-primary/30 interactive-element">
                  <div className="relative pb-[65%] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{item.title}</span>
                      <span className="text-sm font-normal text-muted-foreground">{item.year}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{item.artist}</p>
                    <p className="mb-4">{item.description}</p>
                    <Button variant="outline" size="sm" onClick={() => window.open(item.link, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="artifacts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.artifacts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full glass-panel overflow-hidden border-primary/10 hover:border-primary/30 interactive-element">
                  <div className="relative pb-[65%] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{item.title}</span>
                      <span className="text-sm font-normal text-muted-foreground">{item.year}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{item.origin}</p>
                    <p className="mb-4">{item.description}</p>
                    <Button variant="outline" size="sm" onClick={() => window.open(item.link, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sources;
