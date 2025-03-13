
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Get request body
    const { jobDescription, experience, skills, userId } = await req.json()
    
    if (!jobDescription || !experience || !skills || !userId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: job description, experience, skills, and userId are required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Generate a resume based on the provided information
    // For now, we'll create a simple structured resume
    // In a real implementation, you would integrate with an AI API like OpenAI
    const resumeTitle = `Resume for ${jobDescription.split(' ').slice(0, 3).join(' ')}...`
    
    // Create a simple resume structure
    const resumeContent = JSON.stringify({
      objective: `Seeking a position as a ${jobDescription.split(' ').slice(0, 3).join(' ')}...`,
      experience: experience.split('\n').map(exp => exp.trim()).filter(exp => exp.length > 0),
      skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0),
      jobDescription: jobDescription,
    })
    
    // Store the resume in the database
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        title: resumeTitle,
        content: resumeContent
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error inserting resume:', error)
      throw error
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Resume generated successfully', 
        resumeId: data.id,
        title: resumeTitle
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error generating resume:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate resume', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
