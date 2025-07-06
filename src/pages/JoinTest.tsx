import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import {
  getUserIdFromLocalStorage,
  useAccessToken,
} from "../components/common/utils";
import Button from "../components/ui/button/Button";
import Modal from "../components/ui/modal";

interface Question {
  _id: string;
  question: string;
  choice_1: string;
  choice_2: string;
  choice_3: string;
  choice_4: string;
  currentAnswer: number;
}

interface QuestionWithSubQuestions {
  _id: string;
  readingText: string;
  audioUrl: string;
  childQuestionIds: string[];
  questionType: string;
}


interface Test {
  name: string;
  timeLimitByMinutes: number;
}

export default function JoinTest() {
  const navigate = useNavigate();
  const token = useAccessToken();
  const [test, setTest] = useState<Test>();
  const [questions, setQuestions] = useState<any[]>();
  const [singleQuestions, setSingleQuestions] = useState<[Question] | undefined>(undefined);
  const [subQuestions, setSubQuestions] = useState<[Question] | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState<number | undefined>();
  const [questionWithSubQuestions, setQuestionWithSubQuestions] = useState<any[]>()
  const [answers, setAnswers] = useState<{
    [questionId: string]: number;
  }>({});
  const [draftAnswers, setDraftAnswers] = useState<{
    [questionId: string]: number;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [testResultId, setTestResultId] = useState<string>();

  const userId = getUserIdFromLocalStorage();
  const { testId } = useParams();

  const hasFetchedRef = useRef(false);

  const getTestInfo = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/test/get-test-question`,
      { testId, userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setTest(response.data.test);
    setSingleQuestions(response.data.questions);
    setSubQuestions(response.data.subQuestions);
    const tempQuestions = [...response.data.questions, ...response.data.subQuestions]
    setQuestions(tempQuestions);
    setQuestionWithSubQuestions(response.data.questionWithSubQuestions)
    setTimeLeft(response.data.timeLeft);
    const initialAnswers: { [questionId: string]: number } = {};
    tempQuestions.forEach((q: any) => {
      initialAnswers[q._id] = q.currentAnswer || 0;
    });
    setDraftAnswers(initialAnswers);
    console.log(answers)
    setAnswers(initialAnswers);
    setTestResultId(response.data.testResultId);
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getTestInfo();
    }
  }, [testId]);

  const formatTime = (seconds: number | undefined) => {
    if (typeof seconds !== "number") return "00:00";

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSubmit = async (questionId: string) => {
    const selectedAnswer = draftAnswers[questionId];

    if (!selectedAnswer) {
      alert("Bạn chưa chọn đáp án!");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/test/submit-answer`,
        {
          testResultId,
          questionId,
          selectedAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnswers(draftAnswers);
    } catch (error) {
      console.error("❌ Lỗi khi nộp bài:", error);
      alert("Đã xảy ra lỗi.");
    }
  };

  const handleSubmitTest = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/test/submit-test`,
        {
          testResultId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Nộp bài thành công!");
      setShowModal(false);
      navigate(`/test-result/${testResultId}`);
    } catch (error) {
      console.error("❌ Lỗi khi nộp bài:", error);
      alert("Đã xảy ra lỗi.");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const value = prev ?? 1;
        if (value <= 1) {
          clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof timeLeft === "number" && timeLeft <= 1) handleSubmitTest();
    return;
  }, [timeLeft]);

  const renderSubQuestions = (childQuestionIds: string[]) => {
    const filteredSubQuestions = subQuestions?.filter((sq) =>
      childQuestionIds.includes(sq._id)
    );
    return filteredSubQuestions?.map((subQuestion, index) => (
      <div key={subQuestion._id} id={`question-${subQuestion._id}`}
        className="mb-6 border border-gray-300 dark:border-gray-600 rounded-lg p-4 mt-2">
        <h2 className="font-semibold mb-3 dark:text-white">
          Câu hỏi con {index + 1}: {subQuestion.question}
        </h2>

        <div className="space-y-2 ml-2">
          {["choice_1", "choice_2", "choice_3", "choice_4"].map((key, idx) => (
            <label key={key} className="block dark:text-white">
              <input
                type="radio"
                name={`subQuestion-${subQuestion._id}`}
                value={idx + 1}
                className="mr-2"
                checked={draftAnswers[subQuestion._id] === idx + 1}
                onChange={() => {
                  setDraftAnswers({ ...draftAnswers, [subQuestion._id]: idx + 1 });
                }}
              />
              {String.fromCharCode(65 + idx)}.{" "}
              {subQuestion[key as "choice_1" | "choice_2" | "choice_3" | "choice_4"]}
            </label>
          ))}
        </div>
        <Button
          onClick={() => handleSubmit(subQuestion._id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded m-3"
        >
          Nộp câu trả lời
        </Button>
      </div>
    ));
  };


  return (
    <div className="flex max-w-6xl mx-auto p-6 gap-6">
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Xác nhận kết thúc bài thi
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Bạn có chắc chắn muốn kết thúc bài thi này trước hạn hay không?
        </p>
        <div className="flex justify-end gap-4">
          <Button onClick={() => setShowModal(false)} variant="outline">
            Hủy
          </Button>
          <Button onClick={() => handleSubmitTest()} variant="primary">
            Xác nhận
          </Button>
        </div>
      </Modal>
      <div className="w-1/4 hidden md:block">
        <div className="sticky top-25">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">
            📋 Câu hỏi
          </h2>

          {/* ✅ Thêm vùng có thể scroll */}
          <div className="max-h-[calc(100vh-100px)] overflow-y-auto pr-1">
            <div className="grid grid-cols-5 gap-2">
              {questions?.map((q, index) => (
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
                  variant={answers[q._id] !== 0 ? "primary" : "outline"}
                  className="w-full text-sm text-center font-medium"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-3/4">
        <div className="flex justify-end mb-4">
          <span className="text-lg font-semibold px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white fixed">
            🕒 {formatTime(timeLeft)}
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-6 dark:text-white text-center">
          📝 {test?.name}
        </h1>

        {singleQuestions?.map((q, index) => (
          <div
            key={q._id}
            id={`question-${q._id}`}
            className="mb-6 border border-gray-300 dark:border-gray-600 rounded-lg p-4"
          >
            <h2 className="font-semibold mb-3 dark:text-white">
              Question {index + 1}: {q.question}
            </h2>

            <div className="space-y-2 ml-2">
              {["choice_1", "choice_2", "choice_3", "choice_4"].map(
                (key, idx) => (
                  <label key={key} className="block dark:text-white">
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      value={idx + 1}
                      className="mr-2"
                      checked={draftAnswers[q._id] === idx + 1}
                      onChange={() => {
                        setDraftAnswers({ ...draftAnswers, [q._id]: idx + 1 });
                      }}
                    />
                    {String.fromCharCode(65 + idx)}.{" "}
                    {
                      q[
                      key as "choice_1" | "choice_2" | "choice_3" | "choice_4"
                      ]
                    }
                  </label>
                )
              )}
            </div>
            <Button
              onClick={() => handleSubmit(q._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded m-3"
            >
              Nộp câu trả lời
            </Button>
          </div>
        ))}

        {questionWithSubQuestions?.map((qws, index) => (
          <div
            key={qws._id}
            id={`question-${qws._id}`}
            className="mb-6 border border-gray-300 dark:border-gray-600 rounded-lg p-4"
          >
            <h3 className="font-semibold mb-3 dark:text-white">{index + 1}. {qws.questionType === "Listening" ? "Câu hỏi nghe" : "Câu hỏi đọc"}</h3>

            {qws.audioUrl && <audio controls className="w-full mt-4">
              <source src={qws.audioUrl} type="audio/mp3" />
              Trình duyệt của bạn không hỗ trợ phát âm thanh.
            </audio>}
            {qws.readingText && <p className="mt-4 dark:text-white">{qws.readingText}</p>}
            {renderSubQuestions(qws.childQuestionIds)}

          </div>
        ))}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded m-3"
          >
            Kết thúc bài thi
          </Button>
        </div>
      </div>
    </div>
  );
}
