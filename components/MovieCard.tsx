import React from 'react';
import { MovieRecommendation } from '../types';

interface MovieCardProps {
  recommendation: MovieRecommendation;
}

const FilmPlaceholderIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" />
    </svg>
);

const MovieCard: React.FC<MovieCardProps> = ({ recommendation }) => {
  const { title, reason, posterPath } = recommendation;

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-slate-700">
       {posterPath ? (
         <img
           src={posterPath}
           alt={`Movie poster for ${title}`}
           className="w-full h-48 object-cover"
         />
       ) : (
         <div className="w-full h-48 bg-slate-700 flex items-center justify-center">
            <FilmPlaceholderIcon className="w-16 h-16 text-slate-500" />
         </div>
       )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
            <span className="font-semibold text-violet-400">Why you'll love it: </span>
            {reason}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
