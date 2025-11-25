import React, { useState, useEffect } from 'react';
import { getGlobalState, saveGlobalState } from '../services/storageService';
import { GlobalState } from '../types';
import { Power, Settings, Clock } from 'lucide-react';

export const Admin: React.FC = () => {
  const [state, setState] = useState<GlobalState>({ isManualOverride: false, isQuizOpen: false });

  useEffect(() => {
    setState(getGlobalState());
  }, []);

  const handleToggleOverride = () => {
    const newState = { ...state, isManualOverride: !state.isManualOverride };
    setState(newState);
    saveGlobalState(newState);
  };

  const handleToggleStatus = () => {
    const newState = { ...state, isQuizOpen: !state.isQuizOpen };
    setState(newState);
    saveGlobalState(newState);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Settings className="text-gray-300" size={24} />
                <h2 className="text-xl font-bold text-white">Administration du Quiz</h2>
            </div>
            <div className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">ASAA Control</div>
        </div>
        
        <div className="p-8 space-y-8">
          
          {/* Automatic Mode Status */}
          <div className="pb-6 border-b border-gray-100">
            <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">Mode Automatique (20H - 00H)</h3>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                    <Clock className="text-emerald-600" />
                    <div>
                        <p className="font-medium text-gray-900">Horaire par défaut</p>
                        <p className="text-xs text-gray-500">Le quiz s'ouvre automatiquement à 20h00</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${!state.isManualOverride ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                    {!state.isManualOverride ? 'ACTIF' : 'INACTIF'}
                </div>
            </div>
          </div>

          {/* Manual Override Controls */}
          <div>
             <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">Contrôle Manuel (Urgence)</h3>
             
             <div className="space-y-4">
                 <div className="flex items-center justify-between">
                     <label className="text-gray-700 font-medium">Activer le contrôle manuel</label>
                     <button 
                        onClick={handleToggleOverride}
                        className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out ${state.isManualOverride ? 'bg-indigo-600' : 'bg-gray-300'}`}
                     >
                         <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${state.isManualOverride ? 'translate-x-7' : ''}`}></div>
                     </button>
                 </div>

                 {state.isManualOverride && (
                     <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                         <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-indigo-900">État du Quiz</span>
                            {state.isQuizOpen ? (
                                <span className="flex items-center gap-1 text-green-600 font-bold text-sm"><span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span> OUVERT</span>
                            ) : (
                                <span className="flex items-center gap-1 text-red-600 font-bold text-sm"><span className="w-2 h-2 rounded-full bg-red-600"></span> FERMÉ</span>
                            )}
                         </div>
                         <p className="text-xs text-indigo-700 mb-4">
                             Ce réglage force l'ouverture ou la fermeture du quiz, ignorant l'heure actuelle.
                         </p>
                         <button 
                            onClick={handleToggleStatus}
                            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-white transition ${state.isQuizOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                         >
                             <Power size={18} />
                             {state.isQuizOpen ? 'STOPPER LE QUIZ' : 'DÉMARRER LE QUIZ'}
                         </button>
                     </div>
                 )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};