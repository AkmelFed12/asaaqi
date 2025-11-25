import { User, QuizResult, GlobalState } from '../types';

const USERS_KEY = 'asaa_users';
const RESULTS_KEY = 'asaa_results';
const STATE_KEY = 'asaa_global_state';
const CURRENT_USER_KEY = 'asaa_current_user';

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.username === user.username);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const saveResult = (result: QuizResult): void => {
  const results = getResults();
  results.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  
  // Update user's last played date
  const currentUser = getCurrentUser();
  if (currentUser) {
    const today = new Date().toISOString().split('T')[0];
    currentUser.lastPlayedDate = today;
    saveUser(currentUser);
  }
};

export const getResults = (): QuizResult[] => {
  const data = localStorage.getItem(RESULTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getGlobalState = (): GlobalState => {
  const data = localStorage.getItem(STATE_KEY);
  return data ? JSON.parse(data) : { isManualOverride: false, isQuizOpen: false };
};

export const saveGlobalState = (state: GlobalState): void => {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
};