
import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSource {
  name: string;
  description: string;
  url: string;
  requiresLogin: boolean;
  resourceCount?: number;
}

interface SourcesDirectoryProps {
  sources: SearchSource[];
}

const SourcesDirectory: React.FC<SourcesDirectoryProps> = ({ sources }) => {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  const handleToggleSource = (sourceName: string) => {
    if (expandedSource === sourceName) {
      setExpandedSource(null);
    } else {
      setExpandedSource(sourceName);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Search Sources Directory</h2>
        <p className="text-sm text-gray-600">All ServiceNow knowledge sources indexed by this assistant</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sources.map((source) => (
          <div key={source.name} className="group">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => handleToggleSource(source.name)}
            >
              <div className="flex items-center">
                {expandedSource === source.name ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <span className="font-medium ml-2">{source.name}</span>
                {source.requiresLogin && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Login Required
                  </span>
                )}
              </div>
              
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-servicenow-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Source <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
            
            <div 
              className={cn(
                "px-4 pb-4 bg-gray-50 text-sm", 
                expandedSource === source.name ? "block" : "hidden"
              )}
            >
              <p className="mb-2 text-gray-700">{source.description}</p>
              {source.resourceCount && (
                <p className="text-gray-600">
                  <span className="font-semibold">{source.resourceCount.toLocaleString()}</span> resources indexed
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourcesDirectory;
