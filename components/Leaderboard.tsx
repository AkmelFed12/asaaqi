import React, { useMemo } from 'react';
import { getResults } from '../services/storageService';
import { Trophy, Calendar } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const results = getResults();

  // Aggregate stats per user
  const stats = useMemo(() => {
    const userStats: Record<string, { totalScore: number, gamesPlayed: number, lastDate: string }> = {};

    results.forEach(r => {
      if (!userStats[r.username]) {
        userStats[r.username] = { totalScore: 0, gamesPlayed: 0, lastDate: r.date };
      }
      userStats[r.username].totalScore += r.score;
      userStats[r.username].gamesPlayed += 1;
      if (new Date(r.date) > new Date(userStats[r.username].lastDate)) {
        userStats[r.username].lastDate = r.date;
      }
    });

    return Object.entries(userStats)
      .map(([username, data]) => ({ username, ...data }))
      .sort((a, b) => b.totalScore - a.totalScore); // Sort by total score
  }, [results]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-gray-800 flex items-center justify-center gap-3">
          <Trophy className="text-amber-400" size={32} />
          Classement Général
        </h2>
        <p className="text-gray-500 mt-2">Les meilleurs participants de l'association</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {stats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucun résultat pour le moment. Soyez le premier à participer !
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rang</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Membre</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Score Total</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Participations</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Dernier Quiz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.map((stat, index) => (
                  <tr key={stat.username} className={`hover:bg-gray-50 transition ${index < 3 ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                        ${index === 0 ? 'bg-amber-400 text-white shadow-sm' : 
                          index === 1 ? 'bg-gray-300 text-white shadow-sm' : 
                          index === 2 ? 'bg-amber-700 text-white shadow-sm' : 'text-gray-500'}`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{stat.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                        {stat.totalScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
                      {stat.gamesPlayed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 flex items-center justify-end gap-2">
                      <Calendar size={14} />
                      {new Date(stat.lastDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};