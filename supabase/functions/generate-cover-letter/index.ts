
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the OpenAI API key from the environment
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiApiKey) {
      throw new Error('OpenAI API key not found in environment variables');
    }

    // Parse request body
    const { jobTitle, company, jobDescription, experience, skills, userId } = await req.json();

    // Validate required fields
    if (!jobTitle || !company || !jobDescription || !experience || !skills || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating cover letter for user ${userId} for position ${jobTitle} at ${company}`);

    // Create the prompt for OpenAI
    const prompt = `
      Create a professional and compelling cover letter for the following job:
      
      Job Title: ${jobTitle}
      Company: ${company}
      Job Description: ${jobDescription}
      
      The applicant has the following experience:
      ${experience}
      
      The applicant has the following skills:
      ${skills}
      
      Write a formal, personalized cover letter that highlights how the applicant's experience and skills make them a good fit for this role. The letter should be compelling, professional, and about 300-400 words in length. Do not include the heading or signature - just the body of the letter.
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert at writing professional cover letters that help job applicants stand out. Your cover letters are compelling, specific to the job, and highlight the applicant\'s relevant experience and skills.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const coverLetterContent = data.choices[0].message.content.trim();

    // Return the generated cover letter
    return new Response(
      JSON.stringify({ 
        content: coverLetterContent,
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Cover letter generation error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate cover letter' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
