export default function StartQuiz(props) {
    return (
        <div className="start-quiz">
            <div className="headline">
                <h3>Quiz generated using <strong>Open Trivia Database API </strong>- Created using React</h3>
            </div>
            <h1>Quizzical</h1>
            <p>Take a Quiz - How Knowledgeable Are You?</p>
            <button onClick={props.start}>Start Quiz</button>
        </div> 
    )
}