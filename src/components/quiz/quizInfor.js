import Button from 'react-bootstrap/Button';
import * as ROUTES from '../../constants/routes';

export default function QuizInfor({ quizID, active, title, content, time, create_date, end_date, score }) {

  return (
    <div className="p-4 pt-2 pb-1 grid grid-infor-pre" style={{ borderRight: '1px solid rgba(0, 0, 0, 1)' }}>
      <div className='my-auto h-full'>
        <strong className="text-black-light text-2xl" >
          {title}
        </strong>
      </div>
      <div>
        <p className="text-xl">{content}</p>
      </div>
      <div className='grid grid-infor h-full text-sm'>
        <strong className="">Ngày đầu: </strong>
        <strong className='text-end'>{create_date}</strong>
        <strong className="">Ngày cuối: </strong>
        <strong className='text-end'>{end_date}</strong>
        <strong className="">Thời gian: </strong>
        <strong className='text-end'>{time}</strong>
        <strong className="">Điểm: </strong>
        <strong className='text-end'>{score}</strong>
      </div>
      <div className="h-full">
        {active === 1 ? (<Button size="sm" variant="primary" href={`${ROUTES.QUIZ}/do/${quizID}`}>Làm Quiz</Button>) : (<div> </div>)}
      </div>
    </div>
  );
}