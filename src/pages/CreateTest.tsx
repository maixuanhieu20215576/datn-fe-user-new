import { useState } from "react";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Flatpickr from "react-flatpickr";
import { CalenderIcon, TimeIcon } from "../icons";
import { useAccessToken } from "../components/common/utils";
import axios from "axios";
import { useParams } from "react-router";

interface QuestionInput {
  question: string;
  choices: string[];
  correctAnswer: number;
}

export default function CreateTest() {
  const token = useAccessToken();
  const classId = useParams().classId;

  const [testName, setTestName] = useState("");
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [questions, setQuestions] = useState<QuestionInput[]>([
    { question: "", choices: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [examDate, setExamDate] = useState<string>("");
  const [examTime, setExamTime] = useState<string>("");

  const isCurrentQuestionComplete = (): boolean => {
    const current = questions[activeIndex];
    if (!current.question.trim()) return false;
    for (const choice of current.choices) {
      if (!choice.trim()) return false;
    }
    return true;
  };

  // Thêm câu hỏi mới
  const addQuestion = () => {
    if (!isCurrentQuestionComplete()) {
      alert(
        "Vui lòng điền đầy đủ câu hỏi và tất cả 4 đáp án trước khi thêm câu hỏi mới!"
      );
      return;
    }
    setQuestions([
      ...questions,
      { question: "", choices: ["", "", "", ""], correctAnswer: 0 },
    ]);
    setActiveIndex(questions.length);
  };
  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    if (activeIndex >= newQuestions.length) {
      setActiveIndex(newQuestions.length - 1);
    }
  };
  const updateCorrectAnswer = (index: number, choiceIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = choiceIndex + 1; // 1-based index
    setQuestions(newQuestions);
  };
  const updateQuestion = (
    index: number,
    field: "question" | "choice",
    value: string,
    choiceIndex?: number
  ) => {
    const newQuestions = [...questions];
    if (field === "question") {
      newQuestions[index].question = value;
    } else if (field === "choice" && choiceIndex !== undefined) {
      newQuestions[index].choices[choiceIndex] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    console.log({ testName, timeLimit, questions, examDate, examTime });
    if (!testName) {
      alert("Vui lòng nhập tên bài thi!");
      return;
    }
    if (timeLimit <= 0 || !timeLimit) {
      alert("Thời gian làm bài không hợp lệ!");
      return;
    }
    if (!examDate) {
      alert("Vui lòng chọn ngày thi!");
      return;
    }
    if (!examTime) {
      alert("Vui lòng chọn giờ vào thi!");
      return;
    }
    alert("Submit data logged in console!");

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/teacher/create-test`,
      {
        testName,
        timeLimit,
        questions,
        examDate,
        examTime,
        classId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      alert("Tạo bài thi thành công!");
      setTestName("");
      setTimeLimit(30);
      setQuestions([
        { question: "", choices: ["", "", "", ""], correctAnswer: 0 },
      ]);
      setActiveIndex(0);
      setExamDate("");
      setExamTime("");
    } else {
      alert("Đã xảy ra lỗi khi tạo bài thi. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Tạo bài thi mới
      </h1>

      {/* Thông tin bài thi */}
      <div className="mb-6 space-y-4">
        <div>
          <Label className="block mb-1 font-medium dark:text-white">
            Tên bài thi
          </Label>
          <Input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
        </div>
        <div>
          <Label className="block mb-1 font-medium dark:text-white">
            Thời gian làm bài (phút)
          </Label>
          <Input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="datePicker">Chọn ngày thi</Label>
          <div className="relative w-full flatpickr-wrapper">
            <Flatpickr
              onChange={(dates) =>
                setExamDate(dates[0]?.toLocaleDateString("en-GB"))
              }
              options={{
                dateFormat: "d-m-Y",
              }}
              placeholder="Ngày thi"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon className="size-6" />
            </span>
          </div>
        </div>
        <div>
          <Label htmlFor="tm">Giờ vào thi (giờ:phút:SA/CH)</Label>

          <div
            className="relative"
            onFocus={(e) =>
              (e.target as HTMLDivElement).querySelector("input")?.showPicker()
            }
          >
            <Input
              type="time"
              id="tm"
              name="tm"
              onChange={(e) => setExamTime(e.target.value)}
              className="w-full"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400 z-10">
              <TimeIcon />
            </span>
          </div>
        </div>
      </div>

      {/* Tabs điều hướng câu hỏi */}
      <div className="mb-6 border-b border-gray-300 dark:border-gray-600">
        <nav className="flex gap-2 overflow-x-auto">
          {questions.map((_, idx) => (
            <Button
              key={idx}
              className={`rounded-t-lg `}
              variant={activeIndex === idx ? "primary" : "outline"}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Câu hỏi ${idx + 1}`}
            >
              Câu {idx + 1}
            </Button>
          ))}

          <Button
            onClick={addQuestion}
            aria-label="Thêm câu hỏi"
            variant="success"
          >
            + Thêm câu hỏi
          </Button>
        </nav>
      </div>

      {/* Nội dung câu hỏi đang chọn */}
      {questions.length > 0 && (
        <div className="mb-8 border border-gray-300 rounded p-6 dark:border-gray-600 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white">
              Câu hỏi {activeIndex + 1}
            </h2>
            <Button
              onClick={() => removeQuestion(activeIndex)}
              aria-label="Xóa câu hỏi"
              variant="error"
            >
              Xóa câu hỏi
            </Button>
          </div>

          <Label className="block mb-2 font-medium dark:text-white">
            Nội dung câu hỏi
          </Label>
          <textarea
            value={questions[activeIndex].question}
            onChange={(e) =>
              updateQuestion(activeIndex, "question", e.target.value)
            }
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-6 resize-none focus:outline-none focus:ring dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <div>
            <Label className="block mb-2 font-medium dark:text-white">
              Đáp án
            </Label>
            {questions[activeIndex].choices.map((choice, idx) => (
              <Label key={idx} className="flex mb-3 space-x-3 dark:text-white">
                <input
                  type="radio"
                  name={`correct-answer-${activeIndex}`}
                  checked={questions[activeIndex].correctAnswer === idx + 1}
                  onChange={() => updateCorrectAnswer(activeIndex, idx)}
                />
                <Input
                  type="text"
                  value={choice}
                  onChange={(e) =>
                    updateQuestion(activeIndex, "choice", e.target.value, idx)
                  }
                  placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                  className="w-full "
                />
              </Label>
            ))}
          </div>
        </div>
      )}

      {/* Nút submit */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="px-10 py-3 text-lg"
        >
          Lưu bài thi
        </Button>
      </div>
    </div>
  );
}
