
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
  const [generatedResume, setGeneratedResume] = useState(null);

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
    setGeneratedResume(null);
    
    try {
      // Get the standard JWT token instead of using a template
      const token = await getToken();
      
      console.log("Calling generate-resume function with userId:", user.id);
      
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
      
      // Store the generated resume in state
      setGeneratedResume(data);
      
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

  // Parse and display the JSON resume if it exists
  const renderResume = () => {
    if (!generatedResume || !generatedResume.content) return null;
    
    // Try to parse the JSON content
    let resumeData;
    try {
      // Check if the content is already an object
      if (typeof generatedResume.content === 'object') {
        resumeData = generatedResume.content;
      } else {
        // Parse the string to get JSON
        resumeData = JSON.parse(generatedResume.content);
      }
    } catch (error) {
      console.error("Error parsing resume content:", error);
      return (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-600">Error parsing resume content. Raw content:</p>
          <pre className="mt-2 bg-white p-2 rounded overflow-auto text-sm">{generatedResume.content}</pre>
        </div>
      );
    }
    
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Generated Resume</h2>
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Save & Go to Dashboard
          </button>
        </div>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Professional Summary</h3>
            <p className="mt-3 text-gray-700">{resumeData.professionalSummary}</p>
          </section>
          
          <section>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Work Experience</h3>
            <div className="mt-3 space-y-4">
              {resumeData.workExperience && resumeData.workExperience.map((exp, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{exp.position}</h4>
                    <span className="text-gray-600">{exp.duration}</span>
                  </div>
                  <p className="text-gray-700">{exp.company}</p>
                  <p className="mt-2 text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {resumeData.skills && resumeData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Education</h3>
            <div className="mt-3 space-y-3">
              {resumeData.education && resumeData.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                    <span className="text-gray-600">{edu.year}</span>
                  </div>
                  <p className="text-gray-700">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Create AI Resume</h1>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!generatedResume ? (
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
                  className="w-full py-2 px-4 rounded bg-primary text-white hover:bg-primary/90 transition-colors flex justify-center items-center"
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
        ) : (
          renderResume()
        )}
      </main>
    </div>
  );
};

export default CreateResume;
