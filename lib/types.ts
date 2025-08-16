
// lib/types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaApiResponse {
  response_code: number;
  results: QuizQuestion[];
}

// Environment variables type
export interface EnvironmentVariables {
  MONGODB_URI: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  EMAIL_FROM: string;
}