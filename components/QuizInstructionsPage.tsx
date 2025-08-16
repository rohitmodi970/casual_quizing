"use client"
import React, { useState } from 'react';
import { Clock, Target, Trophy, AlertCircle, CheckCircle, ArrowRight, BookOpen, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuizInstructionsPageProps {
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const QuizInstructionsPage = ({ isDarkMode = true, onToggleTheme }: QuizInstructionsPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartQuiz = async () => {
    setIsLoading(true);
    
    // Simulate loading/navigation delay
    setTimeout(() => {
      console.log('Starting quiz...');
      router.push('/quiz/challenge');
      setIsLoading(false);
    }, 1500);
  };

  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    cardSecondary: isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500'
    },
    button: {
      primary: isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600',
      secondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-4`}>
      {/* Theme Toggle */}
      {onToggleTheme && (
        <button
          onClick={onToggleTheme}
          className={`fixed top-4 right-4 p-3 rounded-lg ${themeClasses.button.secondary} transition-colors z-10 shadow-lg`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      )}

      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-3xl">
          {/* Main Card */}
          <div className={`${themeClasses.card} border rounded-2xl p-8 shadow-xl`}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-3`}>
                Quiz Instructions
              </h1>
              <p className={`${themeClasses.text.secondary} text-lg`}>
                Read carefully before you begin your challenge!
              </p>
            </div>

            {/* Quiz Details */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className={`${themeClasses.cardSecondary} border rounded-xl p-6 text-center`}>
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className={`${themeClasses.text.primary} font-semibold mb-2`}>Time Limit</h3>
                <p className={`${themeClasses.text.secondary} text-sm`}>15 minutes total</p>
              </div>
              <div className={`${themeClasses.cardSecondary} border rounded-xl p-6 text-center`}>
                <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className={`${themeClasses.text.primary} font-semibold mb-2`}>Questions</h3>
                <p className={`${themeClasses.text.secondary} text-sm`}>15 mixed format</p>
              </div>
              <div className={`${themeClasses.cardSecondary} border rounded-xl p-6 text-center`}>
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h3 className={`${themeClasses.text.primary} font-semibold mb-2`}>Scoring</h3>
                <p className={`${themeClasses.text.secondary} text-sm`}>100 points max</p>
              </div>
            </div>

            {/* Rules */}
            <div className="mb-8">
              <h2 className={`text-xl font-bold ${themeClasses.text.primary} mb-4 flex items-center`}>
                <AlertCircle className="w-6 h-6 mr-2 text-yellow-500" />
                Quiz Rules
              </h2>
              <div className="space-y-3">
                <div className={`flex items-start ${themeClasses.text.secondary}`}>
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You have <strong className={themeClasses.text.primary}>15 minutes</strong> to complete all 15 questions</span>
                </div>
                <div className={`flex items-start ${themeClasses.text.secondary}`}>
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Each question is worth <strong className={themeClasses.text.primary}>6.67 points</strong> (rounded)</span>
                </div>
                <div className={`flex items-start ${themeClasses.text.secondary}`}>
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Questions include <strong className={themeClasses.text.primary}>multiple choice & true/false</strong> formats</span>
                </div>
                <div className={`flex items-start ${themeClasses.text.secondary}`}>
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You can <strong className={themeClasses.text.primary}>navigate back</strong> to previous questions</span>
                </div>
                <div className={`flex items-start ${themeClasses.text.secondary}`}>
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Your results will be <strong className={themeClasses.text.primary}>emailed</strong> to you after completion</span>
                </div>
                <div className={`flex items-start ${themeClasses.text.secondary}`}>
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Once submitted, answers <strong className={themeClasses.text.primary}>cannot be changed</strong></span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mb-8"></div>
              <h2 className={`text-xl font-bold ${themeClasses.text.primary} mb-4 flex items-center`}>
                <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                Tips for Success
              </h2>
              <div className={`${themeClasses.cardSecondary} border rounded-xl p-4`}>
                <ul className={`${themeClasses.text.secondary} space-y-2 text-sm`}>
                  <li>• Read each question carefully before selecting your answer</li>
                  <li>• Don't spend too much time on difficult questions - you can come back</li>
                  <li>• Trust your first instinct if you're unsure</li>
                  <li>• Keep an eye on the timer to manage your time effectively</li>
                  <li>• Make sure you answer all questions before submitting</li>
                  <li>• Questions are fetched from Open Trivia Database for variety</li>
                </ul>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={handleStartQuiz}
                disabled={isLoading}
                className={`${themeClasses.button.primary} text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 mx-auto text-lg shadow-lg`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Loading Quiz...</span>
                  </>
                ) : (
                  <>
                    <span>Start Quiz Now</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
              
              <p className={`${themeClasses.text.muted} text-sm mt-4`}>
                Good luck! Do your best and have fun! 🎯
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default QuizInstructionsPage;