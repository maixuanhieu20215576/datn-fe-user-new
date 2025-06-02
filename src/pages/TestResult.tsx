import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import Button from "../components/ui/button/Button";
import { useAccessToken } from "../components/common/utils";

interface Question {
  _id: string;
  question: string;
  choice_1: string;
  choice_2: string;
  choice_3: string;
  choice_4: string;
  answer: number; // ✅ Bổ sung trường đáp án đúng
}

interface Test {
  name: string;
  maxGrade: number;
}

interface QuestionLog {
  questionId: string;
  answer: number;
}

export default function TestResult() {
  const token = useAccessToken();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionLogs, setQuestionLogs] = useState<QuestionLog[]>([]);
  const [grade, setGrade] = useState<number>(0);

  const { testResultId } = useParams();

  const getTestResult = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/test/get-test-result`,
      { testResultId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setTest(response.data.test);
    setQuestions(response.data.questions);
    setQuestionLogs(response.data.questionLogs);
    setGrade(response.data.grade);
  };

  useEffect(() => {
    getTestResult();
  }, [testResultId]);

  const getAnswer = (questionId: string) => {
    return (
      questionLogs.find((log) => log.questionId === questionId)?.answer ?? 0
    );
  };

  return (
    <div>
      <div className="flex max-w-6xl mx-auto p-6 gap-6">
        {/* Sidebar chỉ mục câu hỏi */}
        <div className="w-1/4 hidden md:block">
          <div className="sticky top-25">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">
              📋 Câu hỏi
            </h2>
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto pr-1">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => {
                  const selected = getAnswer(q._id);
                  const correct = q.answer;

                  const isCorrect = selected === correct && selected !== 0;
                  const bgColor = isCorrect ? "bg-green-500" : "bg-red-500";

                  return (
                    <Button
                      key={q._id}
                      onClick={() => {
                        const element = document.getElementById(
                          `question-${q._id}`
                        );
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                      size="sm"
                      className={`w-full text-sm font-medium ${bgColor}`}
                    >
                      {index + 1}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung câu hỏi */}
        <div className="w-3/4">
          <h1 className="text-2xl font-bold mb-6 dark:text-white text-center">
            ✅ Kết quả bài thi: {test?.name}
          </h1>
          <h2 className="text-2xl font-bold mb-6 dark:text-white text-center">
            Tổng điểm: {Math.round(grade)} / {test?.maxGrade}
          </h2>
          {questions.map((q, index) => {
            const selected = getAnswer(q._id);
            const correct = q.answer;
            console.log(correct);
            const correctText =
              q[`choice_${correct}` as keyof Question] || "(Không rõ)";
            const selectedText =
              selected > 0
                ? q[`choice_${selected}` as keyof Question]
                : "(Chưa chọn)";

            const bgColor =
              selected === 0
                ? "bg-red-100 dark:bg-red-700"
                : selected === correct
                ? "bg-green-100 dark:bg-green-700"
                : "bg-red-100 dark:bg-red-700";

            return (
              <div
                key={q._id}
                id={`question-${q._id}`}
                className={`mb-6 border border-gray-300 dark:border-gray-600 rounded-lg p-4 ${bgColor}`}
              >
                <h2 className="font-semibold mb-3 dark:text-white">
                  Question {index + 1}: {q.question}
                </h2>
                <ul className="ml-4 space-y-2 dark:text-white">
                  {[1, 2, 3, 4].map((choiceNumber) => {
                    const text =
                      q[`choice_${choiceNumber}` as keyof Question] ?? "";
                    return (
                      <li key={choiceNumber}>
                        <input
                          type="radio"
                          name={`question-${q._id}`}
                          value={choiceNumber}
                          checked={selected === choiceNumber}
                          disabled
                          className="mr-2"
                        />
                        {String.fromCharCode(64 + choiceNumber)}. {text}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  <strong>Đáp án đúng:</strong> {correctText}
                  <br />
                  <strong>Học sinh chọn:</strong>{" "}
                  {selected === correct ? (
                    <span className="text-white-600 font-semibold">Đúng</span>
                  ) : (
                    <span className="text-white-600 font-semibold">
                      {selectedText}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex justify-center mt-6">
        <Button
          variant="primary"
          onClick={() => navigate("/test")}
          className="px-6 py-3"
        >
          Quay lại
        </Button>
      </div>
    </div>
  );
}
