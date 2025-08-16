// app\api\quiz\routes.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import nodemailer from 'nodemailer';
import { User, QuizResult, IQuizAnswer } from '@/models/User'; // Adjust path as needed

// MongoDB connection
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app', {
      bufferCommands: false,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Email transporter setup
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_APP_PASSWORD, // Your app password
    },
    // Alternative for other SMTP services:
    // host: process.env.SMTP_HOST,
    // port: parseInt(process.env.SMTP_PORT || '587'),
    // secure: false,
  });
};

// Email template for quiz results
const generateEmailTemplate = (
  email: string,
  score: number,
  totalQuestions: number,
  answers: IQuizAnswer[],
  timeTaken: number
) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const timeFormatted = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}`;
  
  const correctAnswers = answers.filter(a => a.isCorrect);
  const incorrectAnswers = answers.filter(a => !a.isCorrect);
  
  return {
    subject: `Quiz Results - You scored ${percentage}%!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .score-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .score-large { font-size: 3em; font-weight: bold; color: #667eea; margin: 0; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat { text-align: center; }
            .stat-value { font-size: 1.5em; font-weight: bold; color: #667eea; }
            .stat-label { color: #666; font-size: 0.9em; }
            .answers-section { margin-top: 30px; }
            .answer { margin: 10px 0; padding: 10px; border-radius: 5px; }
            .correct { background: #d4edda; border-left: 4px solid #28a745; }
            .incorrect { background: #f8d7da; border-left: 4px solid #dc3545; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Quiz Completed!</h1>
              <p>Congratulations on completing the quiz, ${email}!</p>
            </div>
            
            <div class="content">
              <div class="score-card">
                <div style="text-align: center;">
                  <p class="score-large">${percentage}%</p>
                  <p style="margin: 0; color: #666;">Your Final Score</p>
                </div>
                
                <div class="stats">
                  <div class="stat">
                    <div class="stat-value">${correctAnswers.length}</div>
                    <div class="stat-label">Correct</div>
                  </div>
                  <div class="stat">
                    <div class="stat-value">${incorrectAnswers.length}</div>
                    <div class="stat-label">Incorrect</div>
                  </div>
                  <div class="stat">
                    <div class="stat-value">${timeFormatted}</div>
                    <div class="stat-label">Time Taken</div>
                  </div>
                </div>
              </div>
              
              <div class="answers-section">
                <h3>📋 Detailed Results:</h3>
                ${answers.map((answer, index) => `
                  <div class="answer ${answer.isCorrect ? 'correct' : 'incorrect'}">
                    <strong>Q${index + 1}:</strong> ${answer.question}<br>
                    <strong>Your Answer:</strong> ${answer.userAnswer}<br>
                    ${!answer.isCorrect ? `<strong>Correct Answer:</strong> ${answer.correctAnswer}<br>` : ''}
                    ${answer.category ? `<small><em>Category: ${answer.category} | Difficulty: ${answer.difficulty}</em></small>` : ''}
                  </div>
                `).join('')}
              </div>
              
              <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border-radius: 8px;">
                <h4>🚀 What's Next?</h4>
                <p>Great job on completing the quiz! Here are some ways to improve:</p>
                <ul>
                  <li>Review the questions you got wrong</li>
                  <li>Study the topics you found challenging</li>
                  <li>Take another quiz to test your improved knowledge</li>
                  <li>Share your results with friends and challenge them!</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for using our Quiz Platform!</p>
              <p><small>This email was sent automatically. Please do not reply to this email.</small></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Quiz Results for ${email}

Your Score: ${percentage}% (${correctAnswers.length}/${totalQuestions})
Time Taken: ${timeFormatted}

Detailed Results:
${answers.map((answer, index) => `
Q${index + 1}: ${answer.question}
Your Answer: ${answer.userAnswer}
${!answer.isCorrect ? `Correct Answer: ${answer.correctAnswer}` : '✓ Correct!'}
${answer.category ? `(${answer.category} - ${answer.difficulty})` : ''}
`).join('\n')}

Thank you for using our Quiz Platform!
    `
  };
};

// POST - Submit quiz results
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, score, totalQuestions, answers, timeTaken } = body;
    
    // Validation
    if (!email || score === undefined || !totalQuestions || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: email, score, totalQuestions, answers' },
        { status: 400 }
      );
    }
    
    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers must be an array' },
        { status: 400 }
      );
    }
    
    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email: email.toLowerCase(),
        status: 'pending',
        registeredAt: new Date(),
        totalQuizzesTaken: 0
      });
      await user.save();
    }
    
    // Calculate correct answers
    const correctAnswersCount = answers.filter((answer: IQuizAnswer) => answer.isCorrect).length;
    const finalScore = Math.round((correctAnswersCount / totalQuestions) * 100);
    
    // Create quiz result
    const quizResult = new QuizResult({
      userId: user._id,
      email: email.toLowerCase(),
      score: finalScore,
      totalQuestions,
      answers,
      completedAt: new Date(),
      timeTaken: timeTaken || 0
    });
    
    await quizResult.save();
    
    // Send email notification
    try {
      const transporter = createEmailTransporter();
      const emailTemplate = generateEmailTemplate(
        email,
        correctAnswersCount,
        totalQuestions,
        answers,
        timeTaken || 0
      );
      
      await transporter.sendMail({
        from: `"Quiz Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });
      
      console.log(`Quiz results email sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Quiz results saved successfully',
      data: {
        quizId: quizResult._id,
        finalScore,
        correctAnswers: correctAnswersCount,
        totalQuestions,
        userId: user._id,
        emailSent: true
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error saving quiz results:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: Object.values(error.errors).map(err => err.message) 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve user's quiz history
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Either email or userId is required' },
        { status: 400 }
      );
    }
    
    // Build query
    const query: any = {};
    if (email) query.email = email.toLowerCase();
    if (userId) query.userId = userId;
    
    // Get quiz results with pagination
    const skip = (page - 1) * limit;
    const quizResults = await QuizResult.find(query)
      .populate('userId', 'email registeredAt bestScore totalQuizzesTaken')
      .sort({ completedAt: -1 })
      .limit(limit)
      .skip(skip);
    
    const totalResults = await QuizResult.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);
    
    // Get user stats
    let userStats = null;
    if (email) {
      userStats = await User.findOne({ email: email.toLowerCase() });
    } else if (userId) {
      userStats = await User.findById(userId);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        quizResults,
        userStats,
        pagination: {
          currentPage: page,
          totalPages,
          totalResults,
          hasMore: page < totalPages
        }
      }
    });
    
  } catch (error) {
    console.error('Error retrieving quiz results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update quiz result (if needed)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    
    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { notes, flagged } = body;
    
    const quizResult = await QuizResult.findByIdAndUpdate(
      quizId,
      { 
        ...(notes !== undefined && { notes }),
        ...(flagged !== undefined && { flagged }),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!quizResult) {
      return NextResponse.json(
        { error: 'Quiz result not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Quiz result updated successfully',
      data: quizResult
    });
    
  } catch (error) {
    console.error('Error updating quiz result:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete quiz result (admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    
    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }
    
    const quizResult = await QuizResult.findByIdAndDelete(quizId);
    
    if (!quizResult) {
      return NextResponse.json(
        { error: 'Quiz result not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Quiz result deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting quiz result:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}