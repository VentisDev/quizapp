import {decode} from 'html-entities'

export default function QuizAnswers(props) {
    let className
    return(
        <p 
        className={props.className}
        onClick={props.select}
        >
            {decode(props.answer)}
        </p>
    ) 
}