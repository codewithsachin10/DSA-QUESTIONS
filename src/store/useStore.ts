import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import questionsData from '../data/questions.json';

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export type QuestionStatus = 'unvisited' | 'answered' | 'unanswered' | 'review';

export interface TestHistory {
  id: string;
  date: string;
  score: number;
  total: number;
  accuracy: number;
  timeTaken: string;
  answered: number;
  wrong: number;
  skipped: number;
  details: { qId: number; question: string; userAnswer: string | null; correctAnswer: string; isCorrect: boolean }[];
}

export interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, string>;
  questionStatus: Record<number, QuestionStatus>;
  timeRemaining: number;
  isExamStarted: boolean;
  isExamFinished: boolean;
  testHistory: TestHistory[];
  
  // Actions
  startExam: (durationMinutes: number) => void;
  submitExam: () => void;
  setAnswer: (questionId: number, answer: string) => void;
  clearAnswer: (questionId: number) => void;
  markForReview: (questionId: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  tickTimer: () => void;
  resetExam: () => void;
  saveTestResult: () => void;
}

export const useStore = create<ExamState>()(
  persist(
    (set, get) => ({
      questions: questionsData,
      currentQuestionIndex: 0,
      answers: {},
      questionStatus: {},
      timeRemaining: 0,
      isExamStarted: false,
      isExamFinished: false,
      testHistory: [],

      startExam: (durationMinutes) => {
        const initialStatus: Record<number, QuestionStatus> = {};
        questionsData.forEach(q => {
          initialStatus[q.id] = 'unvisited';
        });
        if (questionsData.length > 0) {
          initialStatus[questionsData[0].id] = 'unanswered';
        }

        set({
          questions: questionsData,
          isExamStarted: true,
          isExamFinished: false,
          timeRemaining: durationMinutes * 60,
          currentQuestionIndex: 0,
          answers: {},
          questionStatus: initialStatus,
        });
      },

      submitExam: () => {
        set({ isExamFinished: true });
        // Auto-save result after submitting
        setTimeout(() => get().saveTestResult(), 100);
      },

      saveTestResult: () => {
        const { questions, answers, timeRemaining, testHistory } = get();
        let correct = 0;
        const details: TestHistory['details'] = [];
        
        questions.forEach(q => {
          const userAnswer = answers[q.id] || null;
          const isCorrect = userAnswer === q.answer;
          if (isCorrect) correct++;
          details.push({
            qId: q.id,
            question: q.question,
            userAnswer,
            correctAnswer: q.answer,
            isCorrect,
          });
        });

        const attempted = Object.keys(answers).length;
        const wrong = attempted - correct;
        const skipped = questions.length - attempted;
        const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
        const timeTaken = (120 * 60) - timeRemaining;
        const m = Math.floor(timeTaken / 60);
        const s = timeTaken % 60;

        const entry: TestHistory = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          score: correct,
          total: questions.length,
          accuracy,
          timeTaken: `${m}m ${s}s`,
          answered: attempted,
          wrong,
          skipped,
          details,
        };

        set({ testHistory: [entry, ...testHistory].slice(0, 10) });
      },

      setAnswer: (questionId, answer) => set((state) => {
        const newAnswers = { ...state.answers, [questionId]: answer };
        const newStatus = { ...state.questionStatus, [questionId]: 'answered' as QuestionStatus };
        return { answers: newAnswers, questionStatus: newStatus };
      }),

      clearAnswer: (questionId) => set((state) => {
        const newAnswers = { ...state.answers };
        delete newAnswers[questionId];
        const newStatus = { ...state.questionStatus, [questionId]: 'unanswered' as QuestionStatus };
        return { answers: newAnswers, questionStatus: newStatus };
      }),

      markForReview: (questionId) => set((state) => {
        const newStatus = { ...state.questionStatus, [questionId]: 'review' as QuestionStatus };
        return { questionStatus: newStatus };
      }),

      goToQuestion: (index) => set((state) => {
        if (index >= 0 && index < state.questions.length) {
          const currentId = state.questions[index].id;
          const newStatus = { ...state.questionStatus };
          
          if (newStatus[currentId] === 'unvisited') {
            newStatus[currentId] = 'unanswered';
          }
          
          return { currentQuestionIndex: index, questionStatus: newStatus };
        }
        return state;
      }),

      nextQuestion: () => {
        const { currentQuestionIndex, questions, goToQuestion } = get();
        if (currentQuestionIndex < questions.length - 1) {
          goToQuestion(currentQuestionIndex + 1);
        }
      },

      prevQuestion: () => {
        const { currentQuestionIndex, goToQuestion } = get();
        if (currentQuestionIndex > 0) {
          goToQuestion(currentQuestionIndex - 1);
        }
      },

      tickTimer: () => set((state) => {
        if (state.timeRemaining <= 1) {
          return { timeRemaining: 0, isExamFinished: true };
        }
        return { timeRemaining: state.timeRemaining - 1 };
      }),

      resetExam: () => set({
        isExamStarted: false,
        isExamFinished: false,
        timeRemaining: 0,
        currentQuestionIndex: 0,
        answers: {},
        questionStatus: {},
      }),
    }),
    {
      name: 'exam-storage',
      merge: (persistedState: any, currentState: ExamState) => ({
        ...currentState,
        ...persistedState,
        questions: questionsData,
      }),
    }
  )
);
