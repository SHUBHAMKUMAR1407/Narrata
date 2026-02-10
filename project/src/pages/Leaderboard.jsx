// src/pages/Leaderboard.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError('');
        // The backend returns an object with a 'leaderboard' property
        const data = await apiService.getLeaderboard();
        setLeaderboard(data.leaderboard || []);
      } catch (err) {
        setError('Failed to load the leaderboard. Please try again later.');
        console.error("Fetch leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []); // Runs once when the component mounts

  if (loading) {
    return <div className="text-center p-8">Loading Leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-premium-text mb-12 font-serif text-center">Top Storytellers</h1>

      <div className="bg-white rounded-2xl shadow-xl shadow-teal-500/10 overflow-hidden border border-teal-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-teal-100">
            <thead className="bg-teal-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-premium-text uppercase tracking-wider font-serif">Rank</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-premium-text uppercase tracking-wider font-serif">Writer</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-premium-text uppercase tracking-wider font-serif">Score</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-premium-text uppercase tracking-wider font-serif">Stories</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-premium-text uppercase tracking-wider font-serif">Followers</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-teal-50">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-premium-slate">
                    The leaderboard is empty. Start writing to get on the board!
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className={`text-xl font-bold font-serif ${entry.rank <= 3 ? 'text-premium-gold' : 'text-premium-text'}`}>#{entry.rank}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <Link to={`/profile/${entry.user.username}`} className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full border-2 border-teal-100 overflow-hidden group-hover:border-premium-gold transition-colors">
                          <img
                            className="h-full w-full object-cover"
                            src={entry.user.avatar || `https://ui-avatars.com/api/?name=${entry.user.fullName}&background=random`}
                            alt={entry.user.fullName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-base font-bold text-premium-text group-hover:text-premium-gold transition-colors">{entry.user.fullName}</div>
                          <div className="text-sm text-premium-slate">@{entry.user.username}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-base font-bold text-premium-text bg-teal-50 inline-block px-3 py-1 rounded-full">{Math.round(entry.totalScore)}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-premium-slate font-medium">{entry.user.stats.totalStories}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-premium-slate font-medium">{entry.user.stats.followerCount}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
