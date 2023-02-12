import React from "react"
import StartQuiz from "./StartQuiz"
import QuizQuestions from "./QuizQuestions"
import QuizAnswers from "./QuizAnswers"
import { nanoid } from "nanoid"
import "./index.css"

export default function App() {
    const [questions, setQuestions] = React.useState(null)
    const [startedQuiz, setStartedQuiz] = React.useState(false)
    const [newQuiz, setNewQuiz] = React.useState(0)
    const [quizFinished, setQuizFinished] = React.useState(false)
    const [score, setScore] = React.useState(0)
    
    //fetch the data from api, set questions equal to create questions => then create questions will map the data into objects
    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&category=22&type=multiple")
        .then(response => response.json())
        .then(data => {
            setQuestions(createQuestions(data))
          })
    },[newQuiz])

    function createQuestions(data) {
      return data.results.map(obj => {
        return {
          id: nanoid(),
          question: obj.question,
          difficulty: obj.difficulty,
          answers: createAnswers(obj)
        }
      })
    }

    //creating answers into a new array: shuffling correct and incorrect answers while implementing selected property.

    function createAnswers(data) {
      let answersArray = []
      data.incorrect_answers.map(answer => {
        answersArray.push({
          id: nanoid(),
          value: answer,
          selected: false,
          correct: false,
          finished: false
        })
      })
      answersArray.push({
          id: nanoid(),
          value: data.correct_answer,
          selected: false,
          correct: true,
          finished:false
      })
      return shuffleArray(answersArray) 
    }
    
    function start() {
        setStartedQuiz(true)
        setQuizFinished(false)
        setNewQuiz("new game" + nanoid())
    }
    
    function shuffleArray(array) {
        let shuffledArray = []
        for (let i = array.length - 1; i >= 0; i--) {
            let index = Math.floor(Math.random() * (i + 1));
            shuffledArray.push(array[index])
            array.splice(index, 1)
        }
        return shuffledArray
    }

    function select(answersArray, id) {
      setQuestions(prevQuestions => prevQuestions.map(question => {
        return answersArray === question.answers ? 
            {...question, answers: question.answers.map(answer =>{
              return {
                ...answer, 
                selected: answer.id === id ? true : false}
              }
            )} : question 
          })) 
      }

      function updateScore() {
        let score = 0;
        questions.map(question => {
          question.answers.map(answer => {
            console.log(answer)
            if (answer.correct && answer.selected) {
              score = score + 1
            }
          })
        })

        setScore(score)


      }

      function newGame() {
        setQuizFinished(false)
        setScore(0)
        setNewQuiz("new game" + nanoid())
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      }

      function checkAnswers() {
        setQuizFinished(true)
        updateScore()
        setQuestions(prevQuestions => prevQuestions.map(question => {
          return {
            ...question,
            answers: question.answers.map(answer => {
            return {...answer, isFinished: true} 
            })
          } 
        }))
      }
    
      function getClassName(answer) {
        let className = ""
        if (answer.isFinished) {
          if (answer.correct && answer.selected) {
              className = "quiz-answer-correct--after"
          } else if (!answer.correct && answer.selected) {
              className="quiz-answer-incorrect--after"
          } else if (answer.correct && !answer.selected) {
              className="quiz-answer-correct--after"
          } else {
              className = "quiz-answer-not-selected--after" 
          }
      } else {
          if (answer.selected) {
              className= "quiz-answer-selected--before"
          } else {
              className= "quiz-answer-not-selected--before"
          }
      }
      return className;
      }

    let quiz;
    if (questions === null) {
      return 
    } else {
      quiz = questions.map(question => {
        return (
          <div key={nanoid()} className="quiz">
            <QuizQuestions
            key={question.id} 
            id={question.id}
            question={question.question}
            difficulty={question.difficulty}
            />
            <div key={nanoid()}  className="quiz-answers">
              {question.answers.map(answer => {
                    const className = getClassName(answer)
                return (
                  <QuizAnswers
                  className={className}
                  key={answer.id}
                  id={answer.id}
                  answer={answer.value}
                  correct={answer.correct}
                  selected={answer.selected}
                  isFinished={quizFinished}
                  select={() => select(question.answers, answer.id)}
                  />
                )
              })}
            </div>
            <div className="hr-line"></div>
          </div>
        )
      })
    }

    

    return (
        <main>
            <img src="/yellowblob.png" className="image-large top-image"/>  
            {!startedQuiz && <StartQuiz start={start}/>}
            {startedQuiz && quiz}
            <div className="footer">
              <img src="/blueblob.png" className="image-large bottom-image"/>
              <div className="footer-info">
                {startedQuiz && !quizFinished &&
                <button 
                  className="check-answers"
                  onClick={checkAnswers}
                  >
                    Check Answers
                </button>}
                {quizFinished && <h3>You answered {score} / 5 correctly</h3>}
                {quizFinished && 
                <button 
                  className="new-game"
                  onClick={newGame}
                  >
                    New Game
                </button>}   
              </div>
            </div>
        </main>
    )
}

