
import React from 'react';
import { GithubIcon, HeartIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="text-xl font-bold text-servicenow-blue mr-1">
                ServiceNow
              </div>
              <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-servicenow-blue text-white">
                Knowledge
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Your on-demand knowledge assistant
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-2">
              <a href="#" className="text-gray-600 hover:text-servicenow-blue transition-colors">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-servicenow-blue transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-servicenow-blue transition-colors">
                Terms
              </a>
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <span>Made with</span>
              <HeartIcon size={12} className="text-red-500 mx-1" />
              <span>• Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
