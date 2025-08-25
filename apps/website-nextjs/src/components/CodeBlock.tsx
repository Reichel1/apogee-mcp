import React from 'react';

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  children, 
  language = 'text',
  className = ''
}) => {
  return (
    <pre className={`bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm ${className}`}>
      <code className={`language-${language}`}>
        {children}
      </code>
    </pre>
  );
};