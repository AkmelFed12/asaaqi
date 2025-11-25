export interface User {
  username: string;
  role: 'USER' | 'ADMIN';
  lastPlayedDate: string | null; // ISO Date string YYYY-MM-DD
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface QuizResult {
  username: string;
  score: number;
  totalQuestions: number;
  date: string; // ISO String
}

export enum AppView {
  AUTH = 'AUTH',
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  LEADERBOARD = 'LEADERBOARD',
  ADMIN = 'ADMIN',
  PROFILE = 'PROFILE'
}

export interface GlobalState {
  isManualOverride: boolean; // If true, ignores time check
  isQuizOpen: boolean; // Manual open/close state if override is on
}