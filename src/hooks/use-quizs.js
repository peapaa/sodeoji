import { useState, useEffect } from 'react';
import { getQuizs } from '../services/firebase';

export default function useQuizs(type, param2) {
  const [quizs, setQuizs] = useState(null);

  useEffect(() => {
    async function getTimelineQuizs() {
      const QuizList = await getQuizs(type, param2);
      QuizList.sort((a, b) => {
        // if (b.vote_numbers !== a.vote_numbers) return b.vote_numbers - a.vote_numbers;
        return a.create_date - b.create_date;
      });
      setQuizs(QuizList);
    }

    getTimelineQuizs();
  }, [quizs?.length]);

  return { quizs };
}
