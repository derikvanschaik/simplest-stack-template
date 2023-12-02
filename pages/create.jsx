function CreateQuiz() {
    const [quizName, setQuizName] = React.useState("");
    const [success, setSuccess] = React.useState(false);

    async function createQuiz() {
      const response = await fetch(`/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ quiz_name: quizName }),
      });

      if (response.status == 200) {
        setSuccess(true);
      }
    }

    return (
      <div>
        <input type="text" onInput={(e) => setQuizName(e.target.value)} />
        <button onClick={createQuiz}>Create Quiz</button>
        {success && (
          <a href={`quiz.html?quizname=${quizName}`}>Go to {quizName} </a>
        )}
      </div>
    );
  }

  // Render the QuizApp component into the root div
  ReactDOM.render(<CreateQuiz />, document.getElementById("root"));