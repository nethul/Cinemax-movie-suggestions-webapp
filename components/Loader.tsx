
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-t-violet-500 border-slate-600 rounded-full animate-spin"></div>
      <p className="text-slate-400">Finding your next favorite movie...</p>
    </div>
  );
};

export default Loader;
