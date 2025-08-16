"use client"
import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Send, Mail, Trophy, Moon, Sun } from 'lucide-react';

// TypeScript interfaces
interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  id?: number;
}

interface Answers {
  [key: number]: string;
}

interface QuizSubmissionData {
  email: string;
  score: number;
  totalQuestions: number;
  answers: Array<{
    question: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    category?: string;
    difficulty?: string;
  }>;
  timeTaken: number;
}

// Helper function to decode HTML entities
const decodeHTML = (html: string) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const QuizPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting && submissionStatus === 'idle') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleAutoSubmit();
    }
  }, [timeLeft, isSubmitting, submissionStatus]);

  // Initialize quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        // Get user email from prompt (not using localStorage as per instructions)
        const email = prompt('Please enter your email address to start the quiz:');
        if (email && validateEmail(email)) {
          setUserEmail(email);
        } else {
          alert('Valid email is required to take the quiz.');
          return;
        }

        // Fetch questions from Open Trivia API (supports both multiple choice and boolean)
        const response = await fetch('https://opentdb.com/api.php?amount=15');
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions from API');
        }
        
        const data = await response.json();
        
        if (data.response_code !== 0) {
          throw new Error(`API returned error code: ${data.response_code}`);
        }

        // Process and decode HTML entities in questions
        const processedQuestions = data.results.map((q: any, index: number) => ({
          ...q,
          id: index,
          question: decodeHTML(q.question),
          correct_answer: decodeHTML(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map((answer: string) => decodeHTML(answer)),
          category: decodeHTML(q.category)
        }));

        setQuestions(processedQuestions);
        
      } catch (error) {
        console.error('Failed to initialize quiz:', error);
        setSubmissionStatus('error');
        setSubmissionMessage('Failed to load quiz questions from server. Please check your internet connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuiz();
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const navigateToQuestion = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
  };

  const handleAutoSubmit = async () => {
    if (submissionStatus === 'idle') {
      await handleSubmitQuiz(true);
    }
  };

  const handleSubmitQuiz = async (autoSubmit = false) => {
    setIsSubmitting(true);
    
    try {
      // Calculate score and prepare submission data
      const submissionData: QuizSubmissionData = {
        email: userEmail,
        score: 0, // Will be calculated on backend
        totalQuestions: questions.length,
        answers: questions.map((question, index) => ({
          question: question.question,
          correctAnswer: question.correct_answer,
          userAnswer: answers[index] || 'Not answered',
          isCorrect: answers[index] === question.correct_answer,
          category: question.category,
          difficulty: question.difficulty
        })),
        timeTaken: (15 * 60) - timeLeft
      };
      
      console.log('Submitting quiz results:', submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmissionStatus('success');
      const correctAnswers = submissionData.answers.filter(a => a.isCorrect).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      
      setSubmissionMessage(
        autoSubmit 
          ? `Time's up! Your quiz has been auto-submitted. Score: ${score}% (${correctAnswers}/${questions.length}). Check your email for detailed results!`
          : `Quiz submitted successfully! Score: ${score}% (${correctAnswers}/${questions.length}). Check your email for detailed results!`
      );
      
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setSubmissionStatus('error');
      setSubmissionMessage(
        'Failed to submit quiz. Please check your internet connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
      setShowConfirmSubmit(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
      success: isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}>
        <div className={`${themeClasses.card} border rounded-xl p-8 text-center shadow-lg`}>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className={`text-2xl font-bold ${themeClasses.text.primary} mb-2`}>Loading Quiz...</h2>
          <p className={themeClasses.text.secondary}>Preparing your questions</p>
        </div>
      </div>
    );
  }

  // Submission result screen
  if (submissionStatus !== 'idle') {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center p-4`}>
        <div className={`${themeClasses.card} border rounded-xl p-8 text-center max-w-md w-full shadow-lg`}>
          {submissionStatus === 'success' ? (
            <>
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className={`text-3xl font-bold ${themeClasses.text.primary} mb-4`}>Quiz Completed! 🎉</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <Mail className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-700 text-sm">Email sent to {userEmail}</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h2 className={`text-3xl font-bold ${themeClasses.text.primary} mb-4`}>Submission Failed</h2>
            </>
          )}
          
          <p className={`${themeClasses.text.secondary} mb-6 leading-relaxed`}>{submissionMessage}</p>
          
          <button
            onClick={() => window.location.reload()}
            className={`px-8 py-3 ${themeClasses.button.primary} text-white font-semibold rounded-lg transition-all`}
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  
  // Handle different question types (multiple choice vs boolean)
  const allAnswers = currentQ ? 
    (currentQ.type === 'boolean' 
      ? ['True', 'False'] 
      : [currentQ.correct_answer, ...currentQ.incorrect_answers].sort()
    ) : [];
    
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  return (
    <div className={`min-h-screen ${themeClasses.background} p-4`}>
      {/* Timer Bar */}
      <div className={`fixed top-0 left-0 right-0 ${themeClasses.card} border-b z-50 shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className={`${themeClasses.text.primary} font-semibold`}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className={`text-sm ${themeClasses.text.secondary}`}>
              {userEmail}
            </div>
            
            <div className={`flex items-center space-x-2 ${timeLeft < 300 ? 'text-red-500 font-bold' : themeClasses.text.primary}`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              {timeLeft < 60 && <span className="text-xs">⚠️ FINAL MINUTE!</span>}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${themeClasses.card} border rounded-xl p-4 shadow-sm sticky top-28`}>
              <h3 className={`${themeClasses.text.primary} font-semibold mb-4`}>Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToQuestion(index)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all border ${
                      index === currentQuestion
                        ? 'bg-blue-500 text-white border-blue-500'
                        : answers[index]
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : `${themeClasses.button.secondary} ${themeClasses.text.secondary} border-gray-300`
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`text-sm ${themeClasses.text.secondary} mb-2`}>Progress</div>
                <div className={`${themeClasses.text.primary} font-semibold`}>{answeredCount}/{questions.length}</div>
                <div className={`text-xs ${themeClasses.text.muted} mt-1`}>
                  {Math.round(progressPercentage)}% Complete
                </div>
              </div>

              {timeLeft < 300 && (
                <div className="mt-4 pt-4 border-t border-red-300">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-red-700 text-sm font-medium">⚠️ Time Warning</div>
                    <div className="text-red-600 text-xs">Less than 5 minutes left!</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className={`${themeClasses.card} border rounded-xl p-8 shadow-sm`}>
              {currentQ && (
                <>
                  {/* Question Header */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm border border-blue-200">
                        {currentQ.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm border ${
                        currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800 border-green-200' :
                        currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {currentQ.difficulty}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm border ${
                        currentQ.type === 'boolean' 
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                      }`}>
                        {currentQ.type === 'boolean' ? 'True/False' : 'Multiple Choice'}
                      </span>
                    </div>
                    
                    <h2 className={`text-2xl font-bold ${themeClasses.text.primary} leading-relaxed`}>
                      {currentQ.question}
                    </h2>
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3 mb-8">
                    {allAnswers.map((answer, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(answer)}
                        className={`w-full text-left p-4 rounded-lg transition-all border-2 ${
                          answers[currentQuestion] === answer
                            ? 'bg-blue-50 border-blue-500 text-blue-900'
                            : `${themeClasses.card} border-gray-300 ${themeClasses.text.primary} hover:border-gray-400`
                        }`}
                      >
                        <div className="flex items-center">
                          <span className={`w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center text-sm font-semibold ${
                            answers[currentQuestion] === answer
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-400'
                          }`}>
                            {currentQ.type === 'boolean' 
                              ? (answer === 'True' ? 'T' : 'F')
                              : String.fromCharCode(65 + index)
                            }
                          </span>
                          <span className="text-lg">{answer}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => navigateToQuestion(currentQuestion - 1)}
                      disabled={currentQuestion === 0}
                      className={`flex items-center space-x-2 px-6 py-3 ${themeClasses.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed rounded-lg ${themeClasses.text.primary} transition-all`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Previous</span>
                    </button>

                    {currentQuestion === questions.length - 1 ? (
                      <button
                        onClick={() => setShowConfirmSubmit(true)}
                        className={`flex items-center space-x-2 px-8 py-3 ${themeClasses.button.success} rounded-lg text-white font-semibold transition-all`}
                      >
                        <Send className="w-5 h-5" />
                        <span>Submit Quiz</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigateToQuestion(currentQuestion + 1)}
                        className={`flex items-center space-x-2 px-6 py-3 ${themeClasses.button.primary} rounded-lg text-white transition-all`}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Quick Stats Card */}
            <div className={`mt-6 ${themeClasses.card} border rounded-xl p-4 shadow-sm`}>
              <div className={`flex justify-between items-center text-sm`}>
                <span className={themeClasses.text.secondary}>Email:</span>
                <span className={`${themeClasses.text.primary} font-medium`}>{userEmail}</span>
              </div>
              <div className={`flex justify-between items-center text-sm mt-2`}>
                <span className={themeClasses.text.secondary}>Time Remaining:</span>
                <span className={`font-mono ${timeLeft < 300 ? 'text-red-500' : themeClasses.text.primary}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className={`flex justify-between items-center text-sm mt-2`}>
                <span className={themeClasses.text.secondary}>Progress:</span>
                <span className={`${themeClasses.text.primary} font-medium`}>{answeredCount}/{questions.length} answered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${themeClasses.card} border rounded-xl p-8 max-w-md w-full shadow-xl`}>
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mb-4`}>Submit Quiz?</h3>
              
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-4`}>
                <div className={`${themeClasses.text.primary} mb-2`}>
                  <strong>Quiz Summary:</strong>
                </div>
                <div className={`${themeClasses.text.secondary} text-sm space-y-1`}>
                  <div>Email: {userEmail}</div>
                  <div>Answered: {answeredCount} / {questions.length}</div>
                  <div>Time Used: {formatTime((15 * 60) - timeLeft)}</div>
                </div>
              </div>

              {answeredCount < questions.length && (
                <p className="text-yellow-600 mb-4 text-sm">
                  ⚠️ You have {questions.length - answeredCount} unanswered question(s).
                  They will be marked as incorrect.
                </p>
              )}
              
              <p className={`${themeClasses.text.secondary} mb-6`}>
                Once submitted, you cannot change your answers. 
                Results will be emailed to you immediately.
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 ${themeClasses.button.secondary} ${themeClasses.text.primary} rounded-lg transition-all disabled:opacity-50`}
                >
                  Review Answers
                </button>
                <button
                  onClick={() => handleSubmitQuiz(false)}
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 ${themeClasses.button.success} text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Submit Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-submit warning */}
      {timeLeft <= 60 && timeLeft > 0 && submissionStatus === 'idle' && (
        <div className="fixed bottom-4 right-4 bg-red-500 rounded-lg p-4 border border-red-600 z-40 shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
            <div>
              <div className="text-white font-semibold text-sm">Auto-submit in {timeLeft}s</div>
              <div className="text-red-100 text-xs">Quiz will submit automatically when time runs out</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;