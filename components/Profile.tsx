import React, { useMemo } from 'react';
import { User } from '../types';
import { getResults } from '../services/storageService';
import { User as UserIcon, Award, Calendar, Hash, History } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const results = getResults();
  const userResults = useMemo(() => 
    results
      .filter(r => r.username === user.username)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [results, user.username]
  );
  
  const stats = useMemo(() => {
    const totalScore = userResults.reduce((acc, curr) => acc + curr.score, 0);
    const gamesPlayed = userResults.length;
    // Use lastPlayedDate from user object or fallback to most recent result
    const lastDate = user.lastPlayedDate || (userResults.length > 0 ? userResults[0].date : null);
    
    return { totalScore, gamesPlayed, lastDate };
  }, [userResults, user]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-emerald-600">
        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
            <span className="text-4xl font-serif text-emerald-700 font-bold">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-800">{user.username}</h2>
          <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wide">
             {user.role === 'ADMIN' ? 'Administrateur' : 'Membre ASAA'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-amber-50 rounded-full text-amber-500 mb-3">
             <Award size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalScore}</h3>
          <p className="text-gray-500 text-sm">Score Total</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-blue-50 rounded-full text-blue-500 mb-3">
             <Hash size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.gamesPlayed}</h3>
          <p className="text-gray-500 text-sm">Participations</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-purple-50 rounded-full text-purple-500 mb-3">
             <Calendar size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {stats.lastDate ? new Date(stats.lastDate).toLocaleDateString() : 'Jamais'}
          </h3>
          <p className="text-gray-500 text-sm">Dernier Quiz</p>
        </div>
      </div>

      {/* History List (Optional but helpful) */}
      {userResults.length > 0 && (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
            <History size={18} className="text-gray-500" />
            <h3 className="font-bold text-gray-700">Historique récent</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {userResults.slice(0, 5).map((result, idx) => (
              <li key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                   <p className="text-sm font-medium text-gray-800">
                     {new Date(result.date).toLocaleDateString()}
                     <span className="text-gray-400 mx-2">•</span>
                     {new Date(result.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                     <span className="block font-bold text-emerald-600">{result.score} pts</span>
                     <span className="text-xs text-gray-400">{result.totalQuestions} questions</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};