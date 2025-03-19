
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gemini API key from Supabase environment variables
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text content is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Analyzing text with Gemini API:', text.substring(0, 100) + '...');

    // Call Gemini API to analyze text
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `
            Analyze the following text and extract character relationships:
            
            ${text}
            
            Return a JSON in the following format:
            {
              "characters": [
                {
                  "name": "Character Name",
                  "role": "Main Character/Supporting Character/Antagonist/etc.",
                  "importance": 1-10,
                  "description": "Brief description",
                  "traits": ["trait1", "trait2"],
                  "entityType": "person/organization/location/concept"
                }
              ],
              "relationships": [
                {
                  "source": "Character1 Name",
                  "target": "Character2 Name",
                  "type": "ally/enemy/family/colleague/etc.",
                  "description": "Brief description of the relationship",
                  "strength": 1-10
                }
              ]
            }
            
            Only include the JSON, no other text.`
          }]
        }]
      })
    });

    const geminiData = await response.json();
    console.log('Gemini API response received');

    // Extract the JSON from the response text
    let charactersData;
    try {
      const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      // Find JSON object in the text (in case Gemini adds extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : responseText;
      
      charactersData = JSON.parse(jsonText);
      console.log('Successfully parsed character data');
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse AI response', 
          rawResponse: geminiData.candidates?.[0]?.content?.parts?.[0]?.text 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify(charactersData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-characters function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
