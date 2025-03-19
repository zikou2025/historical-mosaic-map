import React from 'react';
import { User, Building, Map, BookOpen, Users, Info } from 'lucide-react';

const CharacterProfileData = ({ character, relationships }) => {
  if (!character) return null;
  
  const entityTypeIcons = {
    person: User,
    organization: Building,
    location: Map,
    concept: BookOpen,
    unknown: Users
  };
  
  const IconComponent = entityTypeIcons[character.data.entityType] || entityTypeIcons.unknown;
  
  return (
    <div className="space-y-6">
      {/* Header with icon and name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-primary/10">
          <IconComponent className="text-primary h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-medium">{character.data.label}</h3>
          {character.data.role && (
            <p className="text-sm text-muted-foreground">{character.data.role}</p>
          )}
        </div>
      </div>
      
      {/* Entity type badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs bg-secondary px-2 py-1 rounded-full capitalize">
          {character.data.entityType || 'Entity'}
        </span>
        {character.data.importance && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            Importance: {character.data.importance}/10
          </span>
        )}
      </div>
      
      {/* Description */}
      {character.data.description && (
        <div className="bg-secondary/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            Description
          </h4>
          <p className="text-sm">{character.data.description}</p>
        </div>
      )}
      
      {/* Traits */}
      {character.data.traits && character.data.traits.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Traits & Characteristics</h4>
          <div className="flex flex-wrap gap-1.5">
            {character.data.traits.map((trait, i) => (
              <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Relationships */}
      {relationships.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Relationships</h4>
          <div className="space-y-2.5">
            {relationships.map((edge) => {
              // Determine if this character is the source or target
              const isSource = edge.source === character.id;
              const otherEntityName = isSource ? edge.targetName : edge.sourceName;
              const relationshipDirection = isSource ? "→" : "←";
              
              // Set color based on relationship type
              const getRelationshipColor = (type) => {
                const types = {
                  'ally': 'text-primary',
                  'friend': 'text-primary',
                  'colleague': 'text-primary',
                  'family': 'text-orange-500',
                  'enemy': 'text-destructive',
                  'rival': 'text-destructive'
                };
                return types[type?.toLowerCase()] || 'text-foreground';
              };
              
              return (
                <div 
                  key={edge.id} 
                  className="flex items-center justify-between text-sm p-3 border rounded-md hover:bg-secondary/10 transition-colors"
                >
                  <div className="flex gap-2 items-center">
                    <span>{relationshipDirection}</span>
                    <span>{otherEntityName}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRelationshipColor(edge.label)}`}>
                      {edge.label}
                      {edge.data?.strength && ` (${edge.data.strength}/10)`}
                    </span>
                    {edge.data?.description && (
                      <span className="text-xs text-muted-foreground mt-1 text-right">
                        {edge.data.description}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterProfileData;
