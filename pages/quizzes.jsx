// QuizApp component
function Quizzes() {
const [quizzes, setQuizzes] = React.useState([]);

React.useEffect(async () => {
    const response = await fetch(`/quizzes`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    });

    const data = await response.json();
    setQuizzes(data.quizzes);
}, []);

return (
    <div>
    {quizzes.map((quiz) => (
        <blockquote>
        <a href={`quiz.html?quizname=${quiz}`}>{quiz}</a>
        </blockquote>
    ))}
    </div>
);
}

// Render the QuizApp component into the root div
ReactDOM.render(<Quizzes />, document.getElementById("root"));