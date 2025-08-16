"use client"
import React, { useState } from 'react';
import { Mail, Trophy, Clock, Target, ArrowRight, Moon, Sun } from 'lucide-react';

interface QuizLandingPageProps {
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onStartQuiz?: (email: string) => void;
}

const QuizLandingPage = ({ isDarkMode = true, onToggleTheme, onStartQuiz }: QuizLandingPageProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Email validated! Starting quiz...');
      
      // Pass email to parent component or start quiz directly
      setTimeout(() => {
        if (onStartQuiz) {
          onStartQuiz(email);
        } else {
          // Fallback - store in sessionStorage for the quiz page
          sessionStorage.setItem('quizUserEmail', email);
          window.location.href = '/quiz/challenge';
        }
      }, 1000);
    } catch (error) {
      setMessage('Validation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500'
    },
    button: {
      primary: isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
      secondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
    },
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center p-4`}>
      {/* Theme Toggle */}
      {onToggleTheme && (
        <button
          onClick={onToggleTheme}
          className={`fixed top-4 right-4 p-3 rounded-lg ${themeClasses.button.secondary} transition-colors z-10 shadow-lg`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      )}
      
      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className={`${themeClasses.card} border rounded-2xl p-8 shadow-xl`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-3`}>
              Ultimate Quiz Challenge
            </h1>
            <p className={`${themeClasses.text.secondary}`}>
              Test your knowledge and compete for the top score!
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className={`flex items-center ${themeClasses.text.secondary}`}>
              <Clock className="w-5 h-5 mr-3 text-blue-500" />
              <span>15 challenging questions</span>
            </div>
            <div className={`flex items-center ${themeClasses.text.secondary}`}>
              <Target className="w-5 h-5 mr-3 text-green-500" />
              <span>Multiple choice & True/False format</span>
            </div>
            <div className={`flex items-center ${themeClasses.text.secondary}`}>
              <Mail className="w-5 h-5 mr-3 text-purple-500" />
              <span>Results sent to your email</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className={`block ${themeClasses.text.primary} font-medium mb-3`}>
                Enter your email to get started
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.text.muted}`} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="your.email@example.com"
                  className={`w-full pl-12 pr-4 py-4 ${themeClasses.input} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-xl text-center font-medium border ${
                message.includes('Starting') || message.includes('validated')
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full ${themeClasses.button.primary} text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Start Quiz Challenge</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className={`text-center mt-8 ${themeClasses.text.muted} text-sm`}>
            Ready to challenge yourself? Let's see what you've got! 🚀
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLandingPage;