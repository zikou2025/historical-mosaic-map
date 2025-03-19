
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftRight, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Compare = () => {
  const comparisons = {
    revolutions: {
      title: "Revolutionary Movements",
      description: "Compare key factors and outcomes of major revolutionary movements in history",
      pairs: [
        {
          id: 1,
          left: {
            title: "American Revolution (1775-1783)",
            factors: [
              "Colonial taxation without representation",
              "Desire for self-governance",
              "Influence of Enlightenment ideas",
              "Economic independence"
            ],
            outcome: "Established the United States as an independent nation with a constitutional republic",
            keyFigures: ["George Washington", "Thomas Jefferson", "Benjamin Franklin"]
          },
          right: {
            title: "French Revolution (1789-1799)",
            factors: [
              "Economic crisis and food shortages",
              "Social inequality under absolute monarchy",
              "Influence of Enlightenment ideas",
              "Example of American Revolution"
            ],
            outcome: "Overthrew monarchy, but led to the Reign of Terror and eventually Napoleon's rise",
            keyFigures: ["Maximilien Robespierre", "Georges Danton", "Napoleon Bonaparte"]
          }
        }
      ]
    },
    empires: {
      title: "Imperial Powers",
      description: "Explore similarities and differences between major historical empires",
      pairs: [
        {
          id: 1,
          left: {
            title: "Roman Empire (27 BCE - 476 CE)",
            characteristics: [
              "Republican origins before imperial structure",
              "Advanced legal system and infrastructure",
              "Assimilation of conquered peoples and cultures",
              "Extensive road networks and military organization"
            ],
            decline: "Overexpansion, economic troubles, corruption, and barbarian invasions",
            legacy: "Legal systems, languages, architecture, and governance models"
          },
          right: {
            title: "British Empire (1583-1997)",
            characteristics: [
              "Constitutional monarchy with parliamentary system",
              "Naval dominance and maritime trade network",
              "Colonial administration through local elites",
              "Industrial and technological advancement"
            ],
            decline: "World wars, independence movements, and changing global politics",
            legacy: "English language, legal systems, parliamentary democracy, and educational institutions"
          }
        }
      ]
    }
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
          <ArrowLeftRight className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Comparative Visuals</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore side-by-side comparisons of historical events, movements, and civilizations
          to better understand their similarities, differences, and interconnections.
        </p>
      </motion.div>

      <Tabs defaultValue="revolutions" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="revolutions">Revolutions</TabsTrigger>
            <TabsTrigger value="empires">Empires</TabsTrigger>
          </TabsList>
        </div>
        
        {Object.entries(comparisons).map(([key, category]) => (
          <TabsContent key={key} value={key} className="space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">{category.title}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            
            {category.pairs.map((pair) => (
              <motion.div
                key={pair.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="glass-panel border-primary/10">
                    <CardHeader>
                      <CardTitle>{pair.left.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pair.left.factors && (
                        <>
                          <h3 className="font-medium mb-2">Key Factors</h3>
                          <ul className="space-y-1 mb-4">
                            {pair.left.factors.map((factor, index) => (
                              <li key={index} className="flex items-start">
                                <ChevronRight className="h-4 w-4 mr-2 mt-1 text-primary" />
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {pair.left.characteristics && (
                        <>
                          <h3 className="font-medium mb-2">Characteristics</h3>
                          <ul className="space-y-1 mb-4">
                            {pair.left.characteristics.map((char, index) => (
                              <li key={index} className="flex items-start">
                                <ChevronRight className="h-4 w-4 mr-2 mt-1 text-primary" />
                                <span>{char}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {pair.left.outcome && (
                        <>
                          <h3 className="font-medium mb-2">Outcome</h3>
                          <p className="mb-4 text-muted-foreground">{pair.left.outcome}</p>
                        </>
                      )}
                      
                      {pair.left.decline && (
                        <>
                          <h3 className="font-medium mb-2">Decline</h3>
                          <p className="mb-4 text-muted-foreground">{pair.left.decline}</p>
                        </>
                      )}
                      
                      {pair.left.keyFigures && (
                        <>
                          <h3 className="font-medium mb-2">Key Figures</h3>
                          <p className="text-muted-foreground">{pair.left.keyFigures.join(", ")}</p>
                        </>
                      )}
                      
                      {pair.left.legacy && (
                        <>
                          <h3 className="font-medium mb-2">Legacy</h3>
                          <p className="text-muted-foreground">{pair.left.legacy}</p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-panel border-primary/10">
                    <CardHeader>
                      <CardTitle>{pair.right.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pair.right.factors && (
                        <>
                          <h3 className="font-medium mb-2">Key Factors</h3>
                          <ul className="space-y-1 mb-4">
                            {pair.right.factors.map((factor, index) => (
                              <li key={index} className="flex items-start">
                                <ChevronRight className="h-4 w-4 mr-2 mt-1 text-primary" />
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {pair.right.characteristics && (
                        <>
                          <h3 className="font-medium mb-2">Characteristics</h3>
                          <ul className="space-y-1 mb-4">
                            {pair.right.characteristics.map((char, index) => (
                              <li key={index} className="flex items-start">
                                <ChevronRight className="h-4 w-4 mr-2 mt-1 text-primary" />
                                <span>{char}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {pair.right.outcome && (
                        <>
                          <h3 className="font-medium mb-2">Outcome</h3>
                          <p className="mb-4 text-muted-foreground">{pair.right.outcome}</p>
                        </>
                      )}
                      
                      {pair.right.decline && (
                        <>
                          <h3 className="font-medium mb-2">Decline</h3>
                          <p className="mb-4 text-muted-foreground">{pair.right.decline}</p>
                        </>
                      )}
                      
                      {pair.right.keyFigures && (
                        <>
                          <h3 className="font-medium mb-2">Key Figures</h3>
                          <p className="text-muted-foreground">{pair.right.keyFigures.join(", ")}</p>
                        </>
                      )}
                      
                      {pair.right.legacy && (
                        <>
                          <h3 className="font-medium mb-2">Legacy</h3>
                          <p className="text-muted-foreground">{pair.right.legacy}</p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Compare;
