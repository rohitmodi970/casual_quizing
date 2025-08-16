// models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  status: 'pending' | 'completed';
  registeredAt: Date;
  lastQuizAt?: Date;
  totalQuizzesTaken: number;
  bestScore?: number;
}

export interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  score: number;
  totalQuestions: number;
  answers: IQuizAnswer[];
  completedAt: Date;
  timeTaken?: number; // in seconds
}

export interface IQuizAnswer {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  category?: string;
  difficulty?: string;
}

// User Schema - Remove duplicate index definitions
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  lastQuizAt: {
    type: Date
  },
  totalQuizzesTaken: {
    type: Number,
    default: 0
  },
  bestScore: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Quiz Answer Schema
const QuizAnswerSchema = new Schema<IQuizAnswer>({
  question: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  category: {
    type: String
  },
  difficulty: {
    type: String
  }
}, { _id: false });

// Quiz Result Schema - Fixed userId field
const QuizResultSchema = new Schema<IQuizResult>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // Remove unique constraint if it's not needed
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 15
  },
  answers: [QuizAnswerSchema],
  completedAt: {
    type: Date,
    default: Date.now
  },
  timeTaken: {
    type: Number, // in seconds
    min: 0
  }
}, {
  timestamps: true
});

// Add indexes only once, and only if models don't exist
if (!mongoose.models.User) {
  // Email is already unique from schema definition, no need to add separate index
  UserSchema.index({ registeredAt: -1 });
  UserSchema.index({ bestScore: -1 });
}

if (!mongoose.models.QuizResult) {
  QuizResultSchema.index({ userId: 1 });
  QuizResultSchema.index({ email: 1 });
  QuizResultSchema.index({ completedAt: -1 });
  QuizResultSchema.index({ score: -1 });
}

// Pre-save middleware to update user stats
QuizResultSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
      const user = await User.findById(this.userId);
      if (user) {
        user.status = 'completed';
        user.lastQuizAt = this.completedAt;
        user.totalQuizzesTaken += 1;
        
        // Update best score if this score is better
        if (!user.bestScore || this.score > user.bestScore) {
          user.bestScore = this.score;
        }
        
        await user.save();
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }
  next();
});

// Create models with proper error handling
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const QuizResult: Model<IQuizResult> = mongoose.models.QuizResult || mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
