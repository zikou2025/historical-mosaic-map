// supabase/functions/analyze-characters/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

const apiKey = Deno.env.get('GEMINI_API_KEY')
if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is required')
}

const genAI = new GoogleGenerativeAI(apiKey)

serve(async (req) => {
  try {
    // Parse request body
    const { text } = await req.json()
    
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text input is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    // Create the prompt for extracting characters and relationships
    const prompt = `
      Analyze the following text and extract:
      1. Characters/entities (people, organizations, locations, concepts)
      2. Their relationships to each other
      
      Please format your response as a valid JSON object with the following structure:
      {
        "characters": [
          {
            "name": "Character name",
            "entityType": "person|organization|location|concept",
            "description": "Brief description based on the text",
            "role": "Character's role or position",
            "traits": ["trait1", "trait2"],
            "importance": 1-10 (numeric importance score)
          }
        ],
        "relationships": [
          {
            "source": "Source character name (must match a name in characters array)",
            "target": "Target character name (must match a name in characters array)",
            "type": "relationship type (ally, enemy, family, colleague, etc.)",
            "description": "Brief description of relationship",
            "strength": 1-10 (numeric strength of relationship)
          }
        ]
      }

      Ensure all source and target values in relationships exactly match character names in the characters array.
      Only include entities clearly mentioned in the text.
      Limit to the most important 10-15 characters/entities.
      
      The text to analyze is: ${text}
    `
    
    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const textResponse = response.text()
    
    // Extract JSON from the response
    let jsonData
    try {
      // First try to parse the entire response as JSON
      jsonData = JSON.parse(textResponse)
    } catch (e) {
      // If that fails, try to extract JSON from the text response
      const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || 
                        textResponse.match(/{[\s\S]*}/)
      
      if (jsonMatch) {
        try {
          jsonData = JSON.parse(jsonMatch[1] || jsonMatch[0])
        } catch (innerError) {
          throw new Error('Could not parse JSON from AI response')
        }
      } else {
        throw new Error('No valid JSON found in AI response')
      }
    }
    
    // Validate the structure
    if (!jsonData || !Array.isArray(jsonData.characters)) {
      throw new Error('Invalid response format from AI')
    }
    
    return new Response(
      JSON.stringify(jsonData),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
