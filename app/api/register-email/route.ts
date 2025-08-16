// api/register-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { User } from "../../../models/User";

interface RegisterEmailRequest {
  email: string;
}

interface RegisterEmailResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    const body: RegisterEmailRequest = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Please enter a valid email address'
      }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      // If user exists but hasn't completed quiz, allow them to proceed
      if (existingUser.status === 'pending') {
        return NextResponse.json({
          success: true,
          message: 'Welcome back! You can continue to the quiz.',
          userId: (existingUser._id as any).toString()
        }, { status: 200 });
      }
      
      // If user has completed quiz, they can retake it
      return NextResponse.json({
        success: true,
        message: 'Ready for another challenge? Let\'s go!',
        userId: (existingUser._id as any).toString()
      }, { status: 200 });
    }

    // Create new user with pending status
    const userData = {
      email: normalizedEmail,
      status: 'pending' as const,
      registeredAt: new Date(),
      totalQuizzesTaken: 0
    };

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Get ready for the quiz.',
      userId: (savedUser._id as any).toString()
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error specifically
    if ((error as any).code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'An account with this email already exists.'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again.'
    }, { status: 500 });
  }
}