import { useState, Fragment, React, useContext, useEffect } from 'react';
import FirebaseContext from '../../context/firebase';
import useUser from '../../hooks/use-user';
import UserContext from '../../context/user';
import { KeyboardDatePicker, MuiPickersUtilsProvider  } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';


export default function MakeQuiz({ type, data, handleClose }) {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [minute, setMinute] = useState('0');
    const [second, setSecond] = useState('0');
    // const [imgPost, setImgPost] = useState('');
    const [score, setScore] = useState('');
    const [active, setActive] = useState(1);
    const [explain, setExplain] = useState('');
    const { database, storage } = useContext(FirebaseContext);
    const [selectedDate, handleDateChange] = useState(new Date());
    const today = new Date();
    const [question, setQuestion] = useState([]);


    const addQuestion = (type, i, value) => {
        switch (type){
            case 'question': 
                setQuestion((s) => {
                    s[`question`+(i+1)] = {
                        question: value,
                        answer: {
                            A: s[`question`+(i+1)]?.answer?.A,
                            B: s[`question`+(i+1)]?.answer?.B,
                            C: s[`question`+(i+1)]?.answer?.C
                        },
                        right_answer: s[`question`+(i+1)]?.right_answer? s[`question`+(i+1)]?.right_answer: "A",
                        explain: s[`question`+(i+1)]?.explain
                    };
                    return s;
                });
                // console.log(question);
                break;
            case 'A':
                setQuestion((s) => {
                    s[`question`+(i+1)] = {
                        question: s[`question`+(i+1)]?.question,
                        answer: {
                            A: value,
                            B: s[`question`+(i+1)]?.answer?.B,
                            C: s[`question`+(i+1)]?.answer?.C
                        },
                        right_answer: s[`question`+(i+1)]?.right_answer,
                        explain: s[`question`+(i+1)]?.explain
                    };
                    return s;
                });
                // console.log(question);
                break;
            case 'B':
                setQuestion((s) => {
                    s[`question`+(i+1)] = {
                        question: s[`question`+(i+1)]?.question,
                        answer: {
                            A: s[`question`+(i+1)]?.answer?.A,
                            B: value,
                            C: s[`question`+(i+1)]?.answer?.C
                        },
                        right_answer: s[`question`+(i+1)]?.right_answer,
                        explain: s[`question`+(i+1)]?.explain
                    };
                    return s;
                });
                // console.log(question);
                break;
            case 'C':
                setQuestion((s) => {
                    s[`question`+(i+1)] = {
                        question: s[`question`+(i+1)]?.question,
                        answer: {
                            A: s[`question`+(i+1)]?.answer?.A,
                            B: s[`question`+(i+1)]?.answer?.B,
                            C: value
                        },
                        right_answer: s[`question`+(i+1)]?.right_answer,
                        explain: s[`question`+(i+1)]?.explain
                    };
                    return s;
                });
                // console.log(question);
                break;
            case 'right_answer':
                setQuestion((s) => {
                    s[`question`+(i+1)] = {
                        question: s[`question`+(i+1)]?.question,
                        answer: {
                            A: s[`question`+(i+1)]?.answer?.A,
                            B: s[`question`+(i+1)]?.answer?.B,
                            C: s[`question`+(i+1)]?.answer?.C
                        },
                        right_answer: value,
                        explain: s[`question`+(i+1)]?.explain
                    };
                    return s;
                });
                // console.log(question);
                break;
            default:
                setQuestion((s) => {
                    s[`question`+(i+1)] = {
                        question: s[`question`+(i+1)]?.question,
                        answer: {
                            A: s[`question`+(i+1)]?.answer?.A,
                            B: s[`question`+(i+1)]?.answer?.B,
                            C: s[`question`+(i+1)]?.answer?.C
                        },
                        right_answer: s[`question`+(i+1)]?.right_answer,
                        explain: value
                    };
                    return s;
                });
                // console.log(question);
                break;
        }
    }
    
    function convertDate(date){
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        date = yyyy + '/' + mm + '/' + dd;
        return date;
    }

    const inputArr = [
        {
          type: "text"
        },
        {
            type: "text"
          },
          {
            type: "text"
          }
      ];
    const [arr, setArr] = useState(inputArr);

    const addInput = () => {
        setArr(s => {
            return [
            ...s,
            {
                type: "text"
            }
            ];
        });
    };

    const inputTime = (type, value) => {
        console.log(type, value);
        if (type == 'minute') {
            setMinute(value);
            setTime(parseInt(value)*60+parseInt(second));
        }
        else {
            setSecond(value);            
            setTime(parseInt(minute)*60+parseInt(value));
        }
    }


    const handleChange = e => {
        e.preventDefault();

        const index = e.target.id;
        setArr(s => {
            const newArr = s.slice();
            newArr[index].value = e.target.value;

            return newArr;
        });
    };
    const isInvalid = explain === '' && title === '';

    useEffect(() => {
        if (data) {
            console.log(data.val());
            setTitle(data.val().title);
            setTime(data.val().time);
            setMinute(Math.floor(parseInt(data.val().time)/60));
            setSecond(parseInt(data.val().time)%60);
            setScore(data.val().score);
            handleDateChange(new Date(data.val().end_date.replaceAll('/', '-')));
            for (let i=3 ; i<Object.keys(data.val().questions).length; i++ ){
                addInput();
            }
            for (const key in data.val().questions){
                var i  = parseInt(key.slice(8))-1;
                console.log(i, data.val().questions[key]);
                addQuestion('question', i, data.val().questions[key].question);
                addQuestion('A', i, data.val().questions[key].answer.A);
                addQuestion('B', i, data.val().questions[key].answer.B);
                addQuestion('C', i, data.val().questions[key].answer.C);
                addQuestion('right_answer', i, data.val().questions[key].right_answer);
                addQuestion('explain', i, data.val().questions[key].explain);
            }
            console.log(question);
        }
    }, [data])

    const handleUpdate = async (event) => {
        event.preventDefault();
        console.log(question);
        await database
            .ref('Quizs')
            .child(data.key)
            .set({
                active: active,
                create_date: convertDate(today),
                done_user: '',
                end_date: convertDate(selectedDate),
                questions: question,
                score: score,
                time: time,
                title: title
            });
        
        handleClose();
    };

    const handlePost = async (event) => {
        console.log('title:', title);
        console.log('time: ', time);
        console.log('score: ', score);
        console.log('active: ', active);
        console.log('deadline: ', convertDate(selectedDate));
        event.preventDefault();

        await database
        .ref('Quizs')
        .push({
            active: active,
            create_date: convertDate(today),
            done_user: '',
            end_date: convertDate(selectedDate),
            questions: question,
            score: score,
            time: time,
            title: title
        })
        
        handleClose();
    };

    

    

    const handleCloseEvent =  () => {
        handleClose();
    };

    return (
        <>
            <div className="flex flex-col w-full item-center bg-white p-4 rounded width-post">
                <label className="h3 fw-bold">
                    Tiêu đề:
                    <input
                        type="text"
                        value={title}
                        className="form-control text-sm text-gray-base w-full mr-3  px-4  border border-gray-primary rounded mb-2"
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </label>
                <div>
                <label className="h5">
                    Thời gian(mm:ss):
                    <div className='flex flex-row'>
                        <input
                            type="number"
                            value={minute}
                            className="form-control text-sm text-gray-base w-25 mr-3  px-4  border border-gray-primary rounded mb-2"
                            onChange={({ target }) => inputTime('minute', target.value)}
                        />:
                        <input
                            type="number"
                            value={second}
                            className="form-control text-sm text-gray-base w-25 mx-3  px-4  border border-gray-primary rounded mb-2"
                            onChange={({ target }) => inputTime('second',target.value)}
                        />
                    </div>
                    
                </label>
                <label className="h5">
                    Điểm số:
                    <input
                        type="number"
                        value={score}
                        className="form-control text-sm text-gray-base w-50 mr-3  px-4  border border-gray-primary rounded mb-2"
                        onChange={({ target }) => setScore(target.value)}
                    />
                </label>
                <label className="h5">
                    Tình trạng:
                    <select class="form-select" aria-label="Default select example"
                    
                        value={data?.val().active}
                        onChange={({ target }) => setActive(target.value)}>
                    <option selected value="1" className='text-success'>アクティブ</option>
                    <option value="0" className='text-danger'>ストップ</option>
                    </select>
                </label>
                
                </div>
                <label className="h5">
                    Ngày nộp:
                    <br className='mb-2'/>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            autoOk
                            variant="inline"
                            inputVariant="outlined"
                            format="MM/dd/yyyy"
                            value={selectedDate}
                            InputAdornmentProps={{ position: "start" }}
                            onChange={date => handleDateChange(date)}
                            className="my-2"
                        />
                    </MuiPickersUtilsProvider>
                </label>
                    {arr.map((item, i) => {
                        return (
                            <>
                            <hr className='mb-2'/>
                            <label className="h3 fw-bold">
                                {`質問`+(i+1)+`:`}
                                <input
                                    type="text"
                                    value={question['question'+(i+1)]?.question}
                                    className="form-control text-sm text-gray-base w-full mr-3  px-4  border border-gray-primary rounded mb-2"
                                    onChange={({ target }) => addQuestion('question',i, target.value)}
                                />
                            </label>
                            <div className='flex flex-row'>
                                <div className='col-md-4 '>
                                    <label className="h5">
                                        A:
                                        <input
                                            type="text"
                                            value={question['question'+(i+1)]?.answer.A}
                                            className="form-control text-sm text-gray-base w-full mr-3  px-4  border border-gray-primary rounded mb-2"
                                            onChange={({ target }) => addQuestion('A',i, target.value)}
                                        />
                                    </label>
                                </div>
                                <div className='col-md-4 '>
                                    <label className="h5">
                                        B:
                                        <input
                                            type="text"
                                            value={question['question'+(i+1)]?.answer.B}
                                            className="form-control text-sm text-gray-base w-full mr-3  px-4  border border-gray-primary rounded mb-2"
                                            onChange={({ target }) => addQuestion('B', i, target.value)}
                                        />
                                    </label>
                                </div>
                                <div className='col-md-4 '>
                                    <label className="h5">
                                        C:
                                        <input
                                            type="text"
                                            value={question['question'+(i+1)]?.answer.C}
                                            className="form-control text-sm text-gray-base w-full mr-3  px-4  border border-gray-primary rounded mb-2"
                                            onChange={({ target }) => addQuestion('C', i, target.value)}
                                        />
                                    </label>
                                </div>
                            </div>
                            <label className="h5">
                                Đáp án:
                                <select class="form-select w-20" aria-label="Default select example" 
                                    value={question['question'+(i+1)]?.right_answer}
                                    onChange={({ target }) => addQuestion('right_answer',i,target.value)}>
                                <option selected value="A" >A</option>
                                <option value="B" >B</option>
                                <option value="C" >C</option>
                                </select>
                            </label>
                            <label className="h5">
                                Xác minh:
                                <textarea
                                    value={question['question'+(i+1)]?.explain}
                                    className="form-controltext-sm text-gray-base w-full mr-3 p-4 h-20 border border-gray-primary rounded mb-2"
                                    onChange={({ target }) => addQuestion('explain', i, target.value)}
                                />
                            </label>
                            </>
                        );
                    })}
                    
                    <button type="button" className='btn btn-primary w-20 mb-3' onClick={addInput}>Thêm mới</button>
                
                <div>
                    <button className={`bg-green-medium text-white w-45 rounded h-8 font-bold ${isInvalid && 'opacity-50'} `}
                        disabled={isInvalid}
                        onClick={type === "編集" ? (handleUpdate) : (handlePost)}> {type}
                    </button>
                    <a className={`pt-1`}> </a>

                    <button className={`bg-red-medium text-white w-45 rounded h-8 font-bold`}
                        onClick={handleCloseEvent}
                    > Hủy
                    </button>
                </div>
            </div>
        </>
    );
}
