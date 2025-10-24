import React, { useState } from 'react';
import InputChips from './components/InputChips';
import MovieCard from './components/MovieCard';
import Loader from './components/Loader';
import { getMovieRecommendations } from './services/geminiService';
import { searchMovies } from './services/tmdbService';
import { Movie, MovieRecommendation } from './types';

const FilmIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" />
    </svg>
);

const initialMovies: Movie[] = [
    { id: 27205, title: 'Inception (2010)', posterPath: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCK_RX5eDeZmo6B.jpg' },
    { id: 603, title: 'The Matrix (1999)', posterPath: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: 335984, title: 'Blade Runner 2049 (2017)', posterPath: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' }
];


const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [recommendations, setRecommendations] = useState<MovieRecommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    if (movies.length < 2) {
      setError("Please add at least two movies for better recommendations.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const geminiResults = await getMovieRecommendations(movies);
      
      const resultsWithPosters = await Promise.all(
        geminiResults.map(async (rec) => {
          const searchResult = await searchMovies(rec.title.replace(/\s\(\d{4}\)$/, '')); // Remove year for better search
          return {
            ...rec,
            posterPath: searchResult.length > 0 ? searchResult[0].posterPath : null,
          };
        })
      );
      setRecommendations(resultsWithPosters);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-2">
                <FilmIcon className="w-10 h-10 text-violet-400" />
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                    Cinematch AI
                </h1>
            </div>
            <p className="text-slate-400 max-w-2xl mx-auto">
                Tell us what you love, and we'll find your next obsession. Our AI goes beyond genres to match the very soul of the movies you cherish.
            </p>
        </header>

        <main>
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700 mb-8">
            <label className="block text-lg font-semibold text-slate-200 mb-3">
              Enter your all-time favorite movies
            </label>
            <InputChips movies={movies} setMovies={setMovies} />
            <button
              onClick={handleGetRecommendations}
              disabled={isLoading || movies.length === 0}
              className="mt-6 w-full bg-violet-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-violet-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-500/30"
            >
              {isLoading ? 'Analyzing Your Taste...' : 'Find My Next Binge'}
            </button>
          </div>

          <div className="mt-10">
            {isLoading && <Loader />}
            {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>}
            
            {!isLoading && !recommendations && !error && (
                <div className="text-center text-slate-500">
                    <p>Your personalized movie recommendations will appear here.</p>
                </div>
            )}
            
            {recommendations && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {recommendations.map((rec, index) => (
                  <MovieCard key={index} recommendation={rec} />
                ))}
              </div>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-12 py-6 border-t border-slate-800">
            <p className="text-slate-500 text-sm">Powered by Gemini API & TMDb</p>
        </footer>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
       `}</style>
    </div>
  );
};

export default App;
