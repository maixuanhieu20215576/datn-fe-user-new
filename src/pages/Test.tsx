import { useState, useEffect } from "react";
import axios from "axios";
import Button from "./../components/ui/button/Button";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Language, QuestionMark, TimeIcon } from "../icons";
import Modal from "../components/ui/modal";
import { getUserIdFromLocalStorage } from "../components/common/utils";

interface Test {
  _id: string;
  name: string;
  numberOfQuestions: number;
  language: string;
  maxGrade: number;
  timeLimitByMinutes: number;
  thumbnail: string;
}

interface TestHistoryItem {
  testResultId: string;
  startIsoDate: string; // ISO date string
  grade: number;
  createdAt: string;
  testId: {
    name: string;
    maxGrade: number;
  };
}

export default function Test() {
  const [tests, setTests] = useState<Test[]>([]);
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState<TestHistoryItem[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/test/get-tests`)
      .then((res) => setTests(res.data));
  }, []);

  const handleStartTestClick = (testId: string) => {
    setSelectedTestId(testId);
    setShowStartModal(true);
  };

  const confirmStartTest = () => {
    if (selectedTestId) {
      navigate(`/tests/${selectedTestId}`);
    }
    setShowStartModal(false);
    setSelectedTestId(null);
  };

  const cancelStartTest = () => {
    setShowStartModal(false);
    setSelectedTestId(null);
  };

  const openHistoryModal = async (testId: string) => {
    try {
      const userId = getUserIdFromLocalStorage();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/test/get-test-history`,
        {
          testId,
          userId,
        }
      );
      setHistoryData(res.data || []);
      setShowHistoryModal(true);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Lỗi khi tải lịch sử thi. ${error.message}`);
      } else {
        alert("Lỗi khi tải lịch sử thi.");
      }
    }
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setHistoryData([]);
  };

  return (
    <>
      <PageMeta title="EzLearn - Thi thử" description="EzLearn - Thi thử" />
      <PageBreadcrumb pageTitle="Bài thi thử có sẵn" />

      {/* Modal xác nhận bắt đầu bài thi */}
      <Modal isOpen={showStartModal} onClose={cancelStartTest}>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Xác nhận bắt đầu bài thi
        </h2>
        <p className="mb-6 dark:text-gray-300">
          Bạn có chắc chắn muốn bắt đầu bài thi này không?
        </p>
        <div className="flex justify-end gap-4">
          <Button onClick={cancelStartTest} variant="outline">
            Hủy
          </Button>
          <Button onClick={confirmStartTest} variant="primary">
            Bắt đầu
          </Button>
        </div>
      </Modal>

      {/* Modal lịch sử thi */}
      <Modal isOpen={showHistoryModal} onClose={closeHistoryModal}>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Lịch sử thi
        </h2>
        {historyData.length === 0 ? (
          <p className="dark:text-gray-300">Chưa có lịch sử thi cho bài này.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 px-2 py-1 dark:text-white">
                  Ngày thi
                </th>
                <th className="border-b border-gray-300 px-2 py-1 dark:text-white">
                  Điểm số
                </th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr
                  key={item.testResultId}
                  className="odd:bg-gray-100 dark:odd:bg-gray-700"
                >
                  <td className="border-b border-gray-300 px-2 py-1 dark:text-gray-300">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="border-b border-gray-300 px-2 py-1 dark:text-gray-300">
                    {Math.round(item.grade)} / {item.testId.maxGrade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-end mt-4">
          <Button variant="primary" onClick={closeHistoryModal}>
            Đóng
          </Button>
        </div>
      </Modal>

      <div className="space-y-4 overflow-hidden">
        {tests.map((test) => (
          <div
            key={test._id}
            className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl shadow border dark:bg-gray-700 dark:border-gray-700 transition-transform transform hover:scale-102 dark:text-white"
          >
            <img
              src={test.thumbnail}
              alt={test.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium ml-2">{test.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                <Language />
                Ngôn ngữ: {test.language}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                <QuestionMark className="mr-2" />
                Số câu hỏi: {test.numberOfQuestions}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                <TimeIcon className="mr-2" />
                Thời gian: {test.timeLimitByMinutes} phút
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => handleStartTestClick(test._id)}
              >
                Vào thi
              </Button>
              <Button
                variant="outline"
                onClick={() => openHistoryModal(test._id)}
              >
                Xem lịch sử thi
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
