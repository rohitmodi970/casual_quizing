"use client"
import React, { useState, useEffect } from 'react';
import { Mail, Trophy, CheckCircle, Clock, Target, RotateCcw, Home, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ConfirmationPageProps {
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const ConfirmationPage = ({ isDarkMode = true, onToggleTheme }: ConfirmationPageProps) => {
  const [score] = useState(87); // This would come from the quiz submission
  const [email] = useState('user@example.com'); // This would come from localStorage or props
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate email sending delay
    const timer = setTimeout(() => {
      setIsEmailSent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding! 🌟';
    if (score >= 80) return 'Excellent work! 🎉';
    if (score >= 70) return 'Great job! 👏';
    if (score >= 60) return 'Good effort! 👍';
    return 'Keep trying! 💪';
  };

  const handleRetakeQuiz = () => {
    router.push('/quiz/instructions');
  };

  const handleGoHome = () => {
    router.push('/');
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
      primary: isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
      secondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-gray-200 hover:bg-gray-300 border-gray-300',
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-4`}>
      {/* Theme Toggle */}
      {onToggleTheme && (
        <button
          onClick={onToggleTheme}
          className={`fixed top-4 right-4 p-3 rounded-lg ${themeClasses.button.secondary} transition-colors z-10 shadow-lg border`}
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
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-3`}>
                Quiz Completed!
              </h1>
              <p className={`${themeClasses.text.secondary} text-lg`}>
                Congratulations on finishing the challenge!
              </p>
            </div>

            {/* Score Display */}
            <div className={`${themeClasses.cardSecondary} border rounded-2xl p-8 mb-8`}>
              <div className="text-center">
                <div className="mb-4">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <div className="text-6xl font-bold mb-2"></div>
                    <span className={getScoreColor(score)}>{score}%</span>
                  </div>
                  <p className={`text-2xl font-semibold ${themeClasses.text.primary} mb-2`}>
                    {getScoreMessage(score)}
                  </p>
                  <p className={themeClasses.text.secondary}>
                    Your final score out of 100 points
                  </p>
                </div>
              </div>
            </div>

            {/* Quiz Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className={`${themeClasses.cardSecondary} border rounded-xl p-4 text-center`}>
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className={`${themeClasses.text.primary} font-semibold`}>Questions</div>
                <div className={`${themeClasses.text.secondary} text-sm`}>15 answered</div>
              </div>
              <div className={`${themeClasses.cardSecondary} border rounded-xl p-4 text-center`}>
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className={`${themeClasses.text.primary} font-semibold`}>Time Used</div>
                <div className={`${themeClasses.text.secondary} text-sm`}>12:34</div>
              </div>
              <div className={`${themeClasses.cardSecondary} border rounded-xl p-4 text-center`}>
                <CheckCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className={`${themeClasses.text.primary} font-semibold`}>Correct</div>
                <div className={`${themeClasses.text.secondary} text-sm`}>13 out of 15</div>
              </div>
            </div>

            {/* Email Status */}
            <div className="mb-8">
              <div className={`p-6 rounded-xl border transition-all ${
                isEmailSent 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center">
                  <Mail className={`w-8 h-8 mr-4 ${
                    isEmailSent ? 'text-green-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    {isEmailSent ? (
                      <>
                        <h3 className="text-green-700 font-semibold text-lg mb-1">
                          Results Sent! ✅
                        </h3>
                        <p className="text-green-600">
                          Your detailed quiz results have been sent to <strong>{email}</strong>
                        </p>
                        <p className="text-green-500 text-sm mt-2">
                          Check your inbox (and spam folder) for your personalized report.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-blue-700 font-semibold text-lg mb-1">
                          Sending Results... 📧
                        </h3>
                        <p className="text-blue-600">
                          We're preparing your detailed results to send to <strong>{email}</strong>
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                          <span className="text-blue-500 text-sm">Please wait a moment...</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included in Email */}
            <div className="mb-8"></div>
              <h3 className={`${themeClasses.text.primary} font-semibold mb-4`}>📋 Your Email Report Includes:</h3>
              <div className={`${themeClasses.cardSecondary} border rounded-xl p-4`}>
                <ul className={`${themeClasses.text.secondary} space-y-2 text-sm`}>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Your final score and percentage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Breakdown of correct and incorrect answers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Category-wise performance analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Time taken and completion details
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Time taken and completion details
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Tips for improvement (if applicable)
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRetakeQuiz}
                className={`flex-1 ${themeClasses.button.primary} text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg`}
              >
                <RotateCcw className="w-5 h-5" />
                <span>Take Quiz Again</span>
              </button>
              
              <button
                onClick={handleGoHome}
                className={`flex-1 ${themeClasses.button.secondary} ${themeClasses.text.primary} font-bold py-4 px-6 rounded-xl transition-all duration-200 border flex items-center justify-center space-x-2`}
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>

            {/* Footer Message */}
            <div className={`text-center mt-8 ${themeClasses.text.muted} text-sm`}>
              <p className="mb-2">Thank you for taking our Ultimate Quiz Challenge! 🎊</p>
              <p>Share your score with friends and challenge them to beat it!</p>
            </div>
          </div>
        </div>
  );
};

export default ConfirmationPage;