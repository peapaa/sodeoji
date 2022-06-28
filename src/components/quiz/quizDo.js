import { useState, useEffect, useContext } from "react";
import FirebaseContext from '../../context/firebase';
import useUser from '../../hooks/use-user';
import UserContext from '../../context/user';
import $ from 'jquery';
import QuizRank from './quizRank'

import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import * as ROUTES from '../../constants/routes'
import "../../styles/countdown.css"

export default function Quiz({ content }) {
    const [state, setState] = useState("loading");
    const [questNum, setQuestNum] = useState(0);
    const [quests, setQuests] = useState([]);
    const [correct, setCorrect] = useState(false);
    const [counter, setCounter] = useState(content?.time);
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const { database } = useContext(FirebaseContext);
    const [score, setScore] = useState(0);
    const [doneUser, setDoneUser] = useState();

    const circle_icon_style = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex'
    }

    const handleAnswerA = () => {
        if (quests[questNum].right_answer === "A") {
            setCorrect(true);
            setScore(score + 1);
        } else {
            setCorrect(false);
        }
        setState("explain");
    };

    const handleAnswerB = () => {
        if (quests[questNum].right_answer === "B") {
            setCorrect(true);
            setScore(score + 1);
        } else {
            setCorrect(false);
        }
        setState("explain");
    };

    const handleAnswerC = () => {
        if (quests[questNum].right_answer === "C") {
            setCorrect(true);
            setScore(score + 1);
        } else {
            setCorrect(false);
        }
        setState("explain");
    };

    const handleNext = () => {
        setState("doing");
        setQuestNum(questNum + 1);
    };

    const handleComplete = () => {
        database.ref(`Quizs/${content?.key}/done_user/${user?.username}`).set({
            corrected: score,
            date: new Date(),
            result: score * content?.score / quests.length,
            time: content?.time - counter,
        });

        setState("complete");
    };

    useEffect(() => {
        var questions = [];

        if (content?.questions) {
            Object.keys(content['questions']).map((key) => {
                var item = content['questions'][key];
                item.user_name = key;
                questions.push(item);
            });
            setQuests(questions);
        }
        database.ref(`Quizs/${content?.key}/done_user`)
            .on('value', (snapshot) => {
                if (snapshot.exists()) {
                    setDoneUser(snapshot.val());
                }
            });
        console.log(content?.key, doneUser);
    }, []);



    useEffect(() => {
        if (state !== "complete") {
            var progressBarWidth = counter *6;
            console.log($('#progressBar').width())
            $("#progressBar")?.find("div")?.animate({ width: progressBarWidth }, 500).html(Math.floor(counter / 60) + ":" + counter % 60);
            const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
            if (!timer) handleComplete();
            return () => clearInterval(timer);
        }
    }, [counter]);

    useEffect(() => {
        if (quests.length !== 0) setState("doing");
    }, [quests]);

    return (
        <div className="rounded border bg-white border-gray-primary h-full">
            {state === "loading" ? null :
                state === "complete" ?
                    (
                        <div className="grid grid-do-quiz h-full items-center">
                            <div className="bg-green-light h-full flex items-center">
                                <div className="ml-10-per bg-green-light" style={circle_icon_style}>
                                    <SentimentSatisfiedAltIcon fontSize="large" className="m-auto text-white bg-green-light" />
                                </div>
                            </div>
                            <div className="text-3xl ml-10-per text-center">
                                <strong className="text-green-primary">Hoàn thành!</strong>
                            </div>
                            <div className="grid grid-cols-2 h-70">
                                <div className="p-4 pt-2 pb-1 grid grid-do-quiz-result items-end" style={{ borderRight: '1px solid rgba(0, 0, 0, 1)' }}>
                                    <div>
                                        Đáp án:
                                    </div>
                                    <div className='text-end'>
                                        {doneUser[`${user?.username}`].corrected}
                                    </div>
                                    <div>
                                        Thời gian:
                                    </div>
                                    <div className='text-end'>
                                        {doneUser[`${user?.username}`].time}
                                    </div>
                                    <div>
                                        <strong className="text-2xl">Điểm: </strong>
                                    </div>
                                    <div className='text-end'>
                                        {doneUser[`${user?.username}`].result}
                                    </div>
                                </div>
                                <div>
                                    <QuizRank doneUser={doneUser} />
                                </div>
                            </div>
                            <div className="text-end pr-5 text-2xl">
                                <a href={ROUTES.QUIZ}>
                                    <strong>Trở lại</strong>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-do-quiz h-full items-center">
                            {state === "doing" ? (
                                <>
                                    <div className="bg-blue-light h-full flex items-center">
                                        <div className="circle ml-10-per">
                                            <strong className="m-auto text-blue-light">{questNum + 1}/{quests.length}</strong>
                                        </div>
                                    </div>
                                    <div className="text-3xl ml-10-per">
                                        {quests[questNum].question}
                                    </div>
                                    <div className="text-2xl h-full flex flex-col justify-evenly ml-10-per">
                                        <text>
                                            <strong>A.</strong>
                                            <button className="ml-10-per" onClick={handleAnswerA}>{quests[questNum].answer.A}</button>
                                        </text>

                                        <text>
                                            <strong>B.</strong>
                                            <button className="ml-10-per" onClick={handleAnswerB}>{quests[questNum].answer.B}</button>
                                        </text>

                                        <text>
                                            <strong>C.</strong>
                                            <button className="ml-10-per" onClick={handleAnswerC}>{quests[questNum].answer.C}</button>
                                        </text>
                                    </div>
                                </>
                            ) : (
                                <>

                                    {correct === true ? (
                                        <div className="bg-green-light h-full flex items-center">
                                            <div className="ml-10-per bg-green-light" style={circle_icon_style}>
                                                <SentimentSatisfiedAltIcon fontSize="large" className="m-auto text-white bg-green-light" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-red-light h-full flex items-center">
                                            <div className="ml-10-per bg-red-light" style={circle_icon_style}>
                                                <SentimentVeryDissatisfiedIcon fontSize="large" className="m-auto text-white bg-red-light" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-3xl ml-10-per">
                                        {correct === true ? (
                                            <text className="text-green-primary">Tuyệt vời!</text>
                                        ) : (
                                            <text className="text-red-primary">Đáng tiếc!</text>
                                        )}
                                    </div>

                                    <div className="grid h-full" style={{ gridTemplateRows: 'auto 15%' }}>
                                        {quests[questNum].explain ? (<div className="text-center text-2xl mx-auto h-full">{quests[questNum].explain}</div>) : (<div></div>)}
                                        <div className="text-end pr-5 text-2xl">
                                            {quests.length === questNum + 1 ? (
                                                <button className="" onClick={handleComplete}>
                                                    <strong>Hoàn thành</strong>
                                                </button>
                                            ) : (
                                                <button onClick={handleNext}>
                                                    <strong>Tiếp</strong>
                                                    <ArrowRightAltIcon />
                                                </button>

                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div id="progressBar">
                                <div class="bar" className="pt-1 text-xl"></div>
                            </div>
                        </div>
                    )
            }
        </div >
    );
}