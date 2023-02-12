import {decode} from 'html-entities'

export default function QuizQuestions(props) { 
    return(<h2 className="quiz-question">{decode(props.question)}</h2>) 
}
