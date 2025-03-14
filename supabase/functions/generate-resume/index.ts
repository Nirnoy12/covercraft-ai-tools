
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    if (!openaiApiKey) {
      throw new Error('Missing OpenAI API key');
    }
    
    // Get request body
    const { jobDescription, experience, skills, userId } = await req.json();
    
    if (!jobDescription || !experience || !skills || !userId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: job description, experience, skills, and userId are required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');

    // Initialize Supabase client with auth context if available
    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {}
        }
      }
    );
    
    console.log('Sending request to OpenAI API...');
    
    // Create prompt for OpenAI
    const prompt = `
    Create a professional resume for someone applying for this job: "${jobDescription}".
    
    Their work experience (most recent first):
    ${experience}
    
    Their skills:
    ${skills}
    
    Format the resume in a professional way with sections for:
    1. Professional Summary
    2. Work Experience
    3. Skills
    4. Education (create a reasonable education background based on the role)
    
    Return the result in JSON format with the following structure:
    {
      "professionalSummary": "...",
      "workExperience": [
        {"position": "...", "company": "...", "duration": "...", "description": "..."},
        ...
      ],
      "skills": ["skill1", "skill2", ...],
      "education": [
        {"degree": "...", "institution": "...", "year": "..."},
        ...
      ]
    }
    `;
    
    // Call OpenAI API to generate the resume
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional resume writer who specializes in creating tailored resumes for job seekers.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });
    
    const openaiData = await openaiResponse.json();
    console.log('Received response from OpenAI');
    
    if (!openaiData.choices || openaiData.choices.length === 0) {
      console.error('Invalid response from OpenAI:', openaiData);
      throw new Error('Failed to generate resume content from OpenAI');
    }
    
    // Extract the resume content from OpenAI's response
    const resumeContent = openaiData.choices[0].message.content;
    
    // Create a title for the resume
    const resumeTitle = `Resume for ${jobDescription.split(' ').slice(0, 3).join(' ')}...`;
    
    console.log('Storing resume in Supabase...');
    
    // Create a string-based ID column to store the Clerk user ID
    // This avoids the UUID format conflict
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        title: resumeTitle,
        content: resumeContent
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error inserting resume:', error);
      throw error;
    }
    
    console.log('Resume stored successfully with ID:', data.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Resume generated successfully', 
        resumeId: data.id,
        title: resumeTitle,
        content: resumeContent
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error generating resume:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate resume', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
