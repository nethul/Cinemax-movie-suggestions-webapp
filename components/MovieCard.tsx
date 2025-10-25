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

const CheckCircleIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MovieCard: React.FC<MovieCardProps> = ({ recommendation }) => {
  const { title, reason, posterPath, match_reasons } = recommendation;

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-slate-700 flex flex-col">
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
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
            <span className="font-semibold text-violet-400">Why you'll love it: </span>
            {reason}
        </p>
        
        {match_reasons && match_reasons.length > 0 && (
            <div className="mt-auto pt-4 border-t border-slate-700">
                <h4 className="text-sm font-semibold text-slate-200 mb-2">Key Matches:</h4>
                <ul className="space-y-2">
                    {match_reasons.map((match, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-400 text-xs">
                           <CheckCircleIcon className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                           <span>{match}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;