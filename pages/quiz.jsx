function QuizQuestion({ question }) {
    if (question.type === "basic") {
      return (
        <details>
          <summary>{question.question}</summary>
          <p>{question.answer}</p>
        </details>
      );
    }
    // multiple;
    const [showAnswer, setShowAnswer] = React.useState(false);

    return (
      <div>
        <p>{question.question}</p>
        {question.answers.map((answer) => {
          return (
            <p>
              {answer.answer} {showAnswer && answer.correct && "<---"}
            </p>
          );
        })}
        <button onClick={() => setShowAnswer(true)}>Reveal Answer</button>
      </div>
    );
  }

  function Quiz() {
    const [questions, setQuestions] = React.useState([]);

    const [newQuestion, setNewQueston] = React.useState("");
    const [newAnswer, setNewAnswer] = React.useState("");
    const [quiz, setQuiz] = React.useState("");

    React.useEffect(async () => {
      // Get the query parameters from the current URL
      const urlSearchParams = new URLSearchParams(window.location.search);

      // Get the value of the 'quizname' parameter
      const quizName = urlSearchParams.get("quizname");
      setQuiz(quizName);

      if (quizName) {
        const response = await fetch("/quiz/" + quizName, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status == 200) {
          const data = await response.json();
          setQuestions(data.questions);
        }
      }
    }, []);

    async function createQuestion() {
      const response = await fetch("/quiz/" + quiz, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: newQuestion,
          answer: newAnswer,
        }),
      });

      setQuestions([
        { question: newQuestion, answer: newAnswer },
        ...questions,
      ]);
    }

    return (
      <div>
        <form>
          <p>
            <h3>Create New Question</h3>
            <input
              placeholder="question"
              onInput={(e) => setNewQueston(e.target.value)}
            />
          </p>
          <p>
            <input
              placeholder="answer"
              onInput={(e) => setNewAnswer(e.target.value)}
            />
          </p>
          <button onClick={createQuestion} type="button">
            Create
          </button>
        </form>

        <ul>
          {questions.map((question) => {
            return <QuizQuestion question={question} />;
          })}
        </ul>
      </div>
    );
  }

  // Render the QuizApp component into the root div
  ReactDOM.render(<Quiz />, document.getElementById("root"));