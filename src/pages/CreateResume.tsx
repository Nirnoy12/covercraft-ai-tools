
import React, { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateResume = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn || !user) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to generate a resume.",
        variant: "destructive",
      });
      return;
    }
    
    if (!jobDescription.trim() || !experience.trim() || !skills.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate your resume.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get the session token from Clerk using the auth hook
      const token = await getToken();
      
      // Call the Edge Function to generate the resume with auth headers
      const { data, error } = await supabase.functions.invoke('generate-resume', {
        body: {
          jobDescription,
          experience,
          skills,
          userId: user.id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Resume Generated",
        description: "Your resume has been created successfully!",
      });
      
      // Navigate to dashboard or a resume view page
      navigate("/dashboard");
    } catch (error) {
      console.error("Error generating resume:", error);
      
      toast({
        title: "Generation Failed",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Create AI Resume</h1>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Generate Your Resume</h2>
          <p className="text-gray-600 mb-6">
            Fill in the form below with your desired job description, experience, and skills. 
            Our AI will automatically create a professional resume tailored to your needs.
          </p>
          
          <form onSubmit={handleGenerateResume} className="space-y-6">
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Desired Job or Position
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="E.g., Senior Software Engineer with expertise in React and Node.js"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Your Experience (one entry per line)
              </label>
              <textarea
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="E.g., 
Software Engineer at XYZ Company (2020-2023)
Web Developer at ABC Agency (2018-2020)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                rows={5}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter each position on a new line
              </p>
            </div>
            
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Your Skills (comma separated)
              </label>
              <textarea
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="E.g., JavaScript, React, Node.js, Python, Team Leadership"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                rows={3}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate each skill with a comma
              </p>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full btn-primary py-2 px-4 flex justify-center items-center"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Resume...
                  </>
                ) : (
                  "Generate Resume"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateResume;
