
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ViewResume = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();
  
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isSignedIn || !user) {
      navigate("/sign-in");
      return;
    }
    
    const fetchResume = async () => {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setResume(data);
        } else {
          toast({
            title: "Resume Not Found",
            description: "The requested resume could not be found.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
        toast({
          title: "Error",
          description: "Failed to load resume. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchResume();
  }, [id, isSignedIn, user, navigate, toast]);
  
  const parseResumeContent = () => {
    try {
      return JSON.parse(resume.content);
    } catch (e) {
      return null;
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const resumeData = parseResumeContent();
  
  if (!resume || !resumeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Resume Not Found</h2>
        <button 
          onClick={() => navigate("/dashboard")}
          className="btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Resume View</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handlePrint}
              className="text-sm px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Print / Download PDF
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white my-8 shadow-sm rounded-lg print:shadow-none print:my-0 print:py-0">
        <div className="resume-preview">
          <div className="text-center mb-6 print:mb-4">
            <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
            <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
          
          <div className="mb-6 print:mb-4">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Professional Summary</h2>
            <p>{resumeData.objective}</p>
          </div>
          
          <div className="mb-6 print:mb-4">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Experience</h2>
            <ul className="list-disc pl-5 space-y-2">
              {resumeData.experience.map((exp: string, index: number) => (
                <li key={index}>{exp}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6 print:mb-4">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded print:bg-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewResume;
