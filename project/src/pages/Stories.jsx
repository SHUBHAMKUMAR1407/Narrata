// src/pages/Stories.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Make sure you have heroicons installed

// Categories matching backend
const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Fantasy',
  'Sci-Fi',
  'Romance',
  'Horror',
  'Thriller',
  'Historical',
  'Biography',
  'Self-Help',
  'Poetry',
  'Other'
];

function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt' or 'views' (popular)

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (category !== 'all') params.category = category;
        if (sortBy === 'popular') {
          params.sortBy = 'stats.views'; // Backend expects field name for sorting
        } else {
          params.sortBy = 'createdAt';
        }

        const data = await apiService.getAllStories(params);
        setStories(data.stories || []);
      } catch (err) {
        setError('Failed to load stories. Please try again later.');
        console.error("Fetch stories error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [debouncedSearch, category, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-premium-text font-serif">Featured Stories</h1>
          <p className="text-premium-slate mt-2">Discover stories that matter to you.</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-teal-200 rounded-lg focus:ring-premium-gold focus:border-premium-gold block w-full md:w-64 text-sm bg-white shadow-sm"
              placeholder="Search stories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="pl-3 pr-10 py-2 border border-teal-200 rounded-lg focus:ring-premium-gold focus:border-premium-gold text-sm bg-white shadow-sm cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-3 pr-10 py-2 border border-teal-200 rounded-lg focus:ring-premium-gold focus:border-premium-gold text-sm bg-white shadow-sm cursor-pointer"
          >
            <option value="createdAt">Newest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold mx-auto"></div>
          <p className="mt-4 text-premium-slate">Finding stories...</p>
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-600 bg-red-50 rounded-xl border border-red-100">{error}</div>
      ) : stories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-teal-50">
          <h2 className="text-2xl font-semibold text-premium-text font-serif">No stories found.</h2>
          <p className="text-premium-slate mt-4">Try adjusting your search or filters.</p>
          {(search || category !== 'all') && (
            <button
              onClick={() => { setSearch(''); setCategory('all'); }}
              className="mt-6 text-premium-gold font-bold hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story._id} className="bg-white rounded-2xl shadow-md shadow-teal-500/5 hover:shadow-xl hover:shadow-teal-500/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col border border-teal-50">
              <Link to={`/story/${story.slug}`} className="block overflow-hidden">
                <div className="relative h-56 transition-transform duration-500 hover:scale-105">
                  <img src={story.coverImage || 'https://placehold.co/600x400/f0fdfa/0d9488?text=Narrata'} alt={story.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </Link>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block bg-teal-50 text-premium-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-teal-100">
                    {story.category}
                  </span>
                  <div className="flex items-center space-x-1 bg-teal-50 px-2 py-1 rounded-full">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-xs font-bold text-premium-text">{story.rating.toFixed(1)}</span>
                  </div>
                </div>

                <Link to={`/story/${story.slug}`}>
                  <h2 className="text-xl font-bold text-premium-text mb-3 line-clamp-2 font-serif hover:text-premium-gold transition-colors">{story.title}</h2>
                </Link>

                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 rounded-full bg-teal-100 overflow-hidden mr-2">
                    {story.author.avatar ? (
                      <img src={story.author.avatar} alt={story.author.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-premium-gold">{story.author.fullName[0]}</div>
                    )}
                  </div>
                  <p className="text-xs text-premium-slate font-medium">by {story.author.fullName}</p>
                </div>

                <p className="text-premium-slate-text mb-6 line-clamp-3 flex-grow text-sm leading-relaxed">{story.excerpt}</p>

                <div className="mt-auto pt-4 border-t border-teal-50 flex justify-between items-center">
                  <span className="text-xs text-premium-slate-text">{new Date(story.createdAt).toLocaleDateString()}</span>
                  <Link to={`/story/${story.slug}`} className="text-sm font-bold text-premium-gold hover:text-premium-text transition-colors uppercase tracking-wide">
                    Read Story →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Stories;
