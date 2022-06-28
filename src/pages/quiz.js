import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/header';
import Sidebar from '../components/sidebar'
import Quizs from '../components/quiz'
import { useParams } from "react-router-dom";

export default function QuizPage() {
  var { type, param2 } = useParams();
  // console.log(type, param2);

  useEffect(() => {
    document.title = 'Quiz';
  }, []);

  return (

    <div className="bg-gray-background">
      <Header />
      <div className="grid grid-cols-3-new">
        <Sidebar />
        <div className="w-70 justify-between mx-auto show">
          <Quizs type={type} param2={param2} />
        </div>
      </div>
    </div>
  );
}

QuizPage.propTypes = {
};
