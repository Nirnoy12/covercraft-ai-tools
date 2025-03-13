
import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Navigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ResumeItem from "@/components/ResumeItem";

const Dashboard = () => {
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchResumes();
    }
  }, [isSignedIn, user]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setResumes(data || []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast({
        title: "Error",
        description: "Failed to load your resumes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      setResumes(resumes.filter(resume => resume.id !== id));
      
      toast({
        title: "Resume Deleted",
        description: "Your resume has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">ResumeAI Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">{user?.firstName}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome to your dashboard!</h2>
          <p className="text-gray-600">
            This is where you'll create and manage your resumes and cover letters.
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Your Resumes</h2>
            <Link to="/create-resume" className="btn-primary text-sm">
              Create New Resume
            </Link>
          </div>
          
          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : resumes.length > 0 ? (
            <div className="space-y-4">
              {resumes.map(resume => (
                <ResumeItem
                  key={resume.id}
                  id={resume.id}
                  title={resume.title}
                  createdAt={resume.created_at}
                  onDelete={handleDeleteResume}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>You haven't created any resumes yet.</p>
              <Link to="/create-resume" className="text-primary hover:underline mt-2 inline-block">
                Create your first resume
              </Link>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Resume</h3>
            <p className="text-gray-600 mb-4">Start building your professional resume with our AI-powered tools.</p>
            <Link to="/create-resume" className="btn-primary text-sm inline-block">Create Resume</Link>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Cover Letter</h3>
            <p className="text-gray-600 mb-4">Generate a matching cover letter to increase your chances of getting hired.</p>
            <button className="btn-primary text-sm">Create Cover Letter</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
