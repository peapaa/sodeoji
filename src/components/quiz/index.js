import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import useQuizs from '../../hooks/use-quizs'
import Quiz from './quiz';
import QuizDo from './quizDo'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Quizs({ type, param2 }) {
    var { quizs } = useQuizs(type, param2);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (quizs) setLoading(true);
    })
    return (
        <>
            {!loading ? (
                <div className="container mb-12">
                    <Skeleton count={2} height={500} className="mb-5" />
                </div>
            ) : type && type === "do" ? (
                <div className="container min-height-quiz-do" style={{marginTop: '10%', height: '50%'}}>
                    <QuizDo content={quizs[0]} />
                </div>
            ) : (
                quizs.map((quiz) => {
                    return (
                        <div key={quiz.key} className="container mb-12 min-height-quiz-present">
                            <Quiz content={quiz} />
                        </div>
                    )
                })
            )}
        </>
    );
}
