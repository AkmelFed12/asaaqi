import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getUsers, saveUser } from '../services/storageService';
import { Lock } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdminAttempt, setIsAdminAttempt] = useState(false);

  useEffect(() => {
    // Check if the username indicates an admin attempt
    if (username.trim().toLowerCase() === 'admin') {
      setIsAdminAttempt(true);
    } else {
      setIsAdminAttempt(false);
    }
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Le nom d'utilisateur est requis.");
      return;
    }

    // Admin Authentication
    if (isAdminAttempt) {
      if (password !== 'ASAA2023') {
        setError("Code d'accès administrateur incorrect.");
        return;
      }
      
      // Admin Login Success
      const adminUser: User = {
        username: 'Admin',
        role: 'ADMIN',
        lastPlayedDate: null
      };
      
      // Ensure admin exists in storage (though not strictly necessary for logic, good for consistency)
      saveUser(adminUser);
      onLogin(adminUser);
      return;
    }

    // Standard User Logic
    const users = getUsers();
    const existingUser = users.find(u => u.username.toLowerCase() === trimmedUsername.toLowerCase());

    if (isLogin) {
      if (existingUser) {
        // Prevent users from logging in as Admin without password via this path (handled above, but double check)
        if (existingUser.role === 'ADMIN') {
             setError("Veuillez utiliser le code d'accès administrateur.");
             return;
        }
        onLogin(existingUser);
      } else {
        setError("Utilisateur non trouvé. Veuillez vous inscrire.");
      }
    } else {
      if (existingUser) {
        setError("Ce nom d'utilisateur existe déjà.");
      } else {
        // Prevent registration of "admin" name if somehow bypassed check above
        if (trimmedUsername.toLowerCase() === 'admin') {
           setError("Ce nom d'utilisateur est réservé.");
           return;
        }

        const newUser: User = {
          username: trimmedUsername,
          role: 'USER',
          lastPlayedDate: null
        };
        saveUser(newUser);
        onLogin(newUser);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-emerald-600">
        <div className="text-center mb-8">
           <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-md overflow-hidden border-2 border-emerald-50">
             <img 
               src="logo.png" 
               alt="ASAA Logo" 
               className="w-full h-full object-contain"
               onError={(e) => {
                 // Fallback if image missing
                 const target = e.target as HTMLImageElement;
                 target.style.display = 'none';
                 if (target.parentElement) {
                    target.parentElement.innerHTML = '<span class="text-4xl">🕌</span>';
                 }
               }}
             />
           </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isAdminAttempt ? 'Accès Administrateur' : (isLogin ? 'Connexion' : 'Inscription')}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Bienvenue au Quiz ASAA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder="Entrez votre nom"
            />
          </div>

          {isAdminAttempt && (
             <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Code d'accès</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="Code ASAA2023"
                />
             </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-[1.02] shadow-md"
          >
            {isAdminAttempt ? 'Entrer' : (isLogin ? 'Se connecter' : "S'inscrire")}
          </button>
        </form>

        {!isAdminAttempt && (
          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-emerald-600 hover:text-emerald-800 font-medium hover:underline"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};