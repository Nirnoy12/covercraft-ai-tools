
import React from "react";
import { Link } from "react-router-dom";

type ResumeItemProps = {
  id: string;
  title: string;
  createdAt: string;
  onDelete: (id: string) => void;
};

const ResumeItem = ({ id, title, createdAt, onDelete }: ResumeItemProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100 hover:border-primary/20 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">
            Created: {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link 
            to={`/resume/${id}`} 
            className="text-sm px-3 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            View
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="text-sm px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeItem;
