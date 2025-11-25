import React, { useState, useEffect } from 'react';
import { generateQuestions } from '../services/geminiService';
import { Question, User } from '../types';
import { saveResult } from '../services/storageService';
import { CheckCircle, XCircle, Loader2, ArrowRight, Timer } from 'lucide-react';

interface QuizProps {
  user: User;
  onComplete: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ user, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      const data = await generateQuestions(6); // 6 Questions per day
      setQuestions(data);
      setLoading(false);
    };
    loadQuestions();
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    if (loading || quizFinished || isAnswered) return;

    if (timeLeft === 0) {
      // Time run out
      setIsAnswered(true);
      setSelectedOption(null); // No option selected
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, quizFinished, isAnswered]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(s => s + 5); // 5 points per correct answer
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(20); // Reset timer
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Score is already updated in state by handleOptionClick
    saveResult({
      username: user.username,
      score: score,
      totalQuestions: questions.length,
      date: new Date().toISOString()
    });
    setQuizFinished(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-gray-600 animate-pulse">Génération des questions par IA...</p>
        <p className="text-xs text-gray-400 mt-2">Cela peut prendre quelques secondes.</p>
      </div>
    );
  }

  if (quizFinished) {
    const maxScore = questions.length * 5;
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AwardIcon score={score} maxScore={maxScore} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Terminé !</h2>
        <p className="text-gray-600 mb-6">Barakallahu fik pour votre participation.</p>
        
        <div className="text-5xl font-bold text-emerald-600 mb-2">{score}/{maxScore}</div>
        <p className="text-sm text-gray-500 mb-8">Votre score final</p>

        <button 
          onClick={onComplete}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
        >
          Voir le classement
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top Bar: Progress and Timer */}
      <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col flex-1 mr-4">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Question {currentIndex + 1}/{questions.length}</span>
                <span className="font-semibold text-emerald-700">Score: {score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
          </div>
          
          {/* Timer Display */}
          <div className={`flex items-center gap-1 font-bold rounded-lg px-3 py-1.5 shadow-sm border ${timeLeft <= 5 && !isAnswered ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-white text-gray-700 border-gray-200'}`}>
              <Timer size={18} />
              <span>{timeLeft}s</span>
          </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-6 leading-relaxed">
            {currentQuestion.questionText}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let optionClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ";
              
              if (!isAnswered) {
                optionClass += "border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer";
              } else {
                 if (idx === currentQuestion.correctAnswerIndex) {
                    optionClass += "border-emerald-500 bg-emerald-50 text-emerald-900";
                 } else if (idx === selectedOption) {
                    optionClass += "border-red-500 bg-red-50 text-red-900";
                 } else {
                    optionClass += "border-gray-100 text-gray-400 opacity-60";
                 }
              }

              return (
                <button 
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={optionClass}
                >
                  <span className="font-medium">{option}</span>
                  {isAnswered && idx === currentQuestion.correctAnswerIndex && <CheckCircle className="text-emerald-500" size={20} />}
                  {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && <XCircle className="text-red-500" size={20} />}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button */}
          {isAnswered && (
            <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-bottom-2 fade-in">
              {selectedOption === null && (
                  <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md mb-4 text-sm font-bold border border-red-100 text-center">
                      Temps écoulé !
                  </div>
              )}
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-md">
                <p className="font-bold text-amber-800 text-sm mb-1">Explication :</p>
                <p className="text-amber-900 text-sm">{currentQuestion.explanation || "Réponse correcte."}</p>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handleNext}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition shadow-lg hover:shadow-xl"
                >
                  {currentIndex < questions.length - 1 ? 'Question Suivante' : 'Voir les résultats'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AwardIcon = ({ score, maxScore }: { score: number, maxScore: number }) => {
  if (score === maxScore) return <span className="text-4xl">🏆</span>;
  if (score >= maxScore / 2) return <span className="text-4xl">🌟</span>;
  return <span className="text-4xl">📚</span>;
};