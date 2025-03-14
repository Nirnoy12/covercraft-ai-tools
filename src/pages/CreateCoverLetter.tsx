
import React, { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CreateCoverLetter = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string | null>(null);

  const handleGenerateCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn || !user) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to generate a cover letter.",
        variant: "destructive",
      });
      return;
    }
    
    if (!jobTitle.trim() || !company.trim() || !jobDescription.trim() || !experience.trim() || !skills.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate your cover letter.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedCoverLetter(null);
    
    try {
      // Get the standard JWT token
      const token = await getToken();
      
      console.log("Calling generate-cover-letter function with userId:", user.id);
      
      // Call the Edge Function to generate the cover letter with auth headers
      const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
        body: {
          jobTitle,
          company,
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
        title: "Cover Letter Generated",
        description: "Your cover letter has been created successfully!",
      });
      
      // Store the generated cover letter in state
      setGeneratedCoverLetter(data.content);
      
    } catch (error) {
      console.error("Error generating cover letter:", error);
      
      toast({
        title: "Generation Failed",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedCoverLetter || !user) return;
    
    try {
      const { error } = await supabase
        .from('resumes') // We'll use the same table for simplicity
        .insert({
          title: `Cover Letter for ${company} - ${jobTitle}`,
          content: JSON.stringify({
            type: "cover_letter",
            jobTitle,
            company,
            content: generatedCoverLetter
          }),
          user_id: user.id
        });
        
      if (error) throw error;
      
      toast({
        title: "Cover Letter Saved",
        description: "Your cover letter has been saved successfully.",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Error saving cover letter:", error);
      
      toast({
        title: "Save Failed",
        description: "Failed to save cover letter. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Create AI Cover Letter</h1>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!generatedCoverLetter ? (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Generate Your Cover Letter</h2>
            <p className="text-gray-600 mb-6">
              Fill in the form below with job details and your qualifications. 
              Our AI will create a personalized cover letter to help you stand out.
            </p>
            
            <form onSubmit={handleGenerateCoverLetter} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="E.g., Senior Software Engineer"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="E.g., Acme Corporation"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Your Experience</Label>
                <Textarea
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Briefly describe your relevant work experience..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills">Your Skills</Label>
                <Textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="List your key skills relevant to this position..."
                  rows={3}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Cover Letter...
                  </>
                ) : (
                  "Generate Cover Letter"
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Cover Letter</h2>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setGeneratedCoverLetter(null)}
                >
                  Edit
                </Button>
                <Button onClick={handleSave}>
                  Save & Return to Dashboard
                </Button>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <div className="mb-8">
                <div className="text-right mb-8">
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
                
                <p className="font-medium">Re: Application for {jobTitle} position at {company}</p>
                
                <div className="mt-4 whitespace-pre-line">
                  {generatedCoverLetter}
                </div>
                
                <div className="mt-8">
                  <p>Sincerely,</p>
                  <p className="mt-4 font-medium">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateCoverLetter;
