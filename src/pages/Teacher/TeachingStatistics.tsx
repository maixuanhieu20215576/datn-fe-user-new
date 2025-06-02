import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Modal from "../../components/ui/modal";
import axios from "axios";
import {
  getUserIdFromLocalStorage,
  useAccessToken,
} from "../../components/common/utils";

interface TestAverageScore {
  testId: string;
  testName: string;
  averageScore: number;
}

interface StudentScore {
  studentId: string;
  studentName: string;
  score: number;
}

interface ClassStudentInfo {
  classId: string;
  className: string;
  students: {
    studentId: string;
    fullName: string;
    email?: string;
    phone?: string;
  }[];
}

interface TestHistory {
  id: string;
  name: string;
  date: string;
  score: number;
  maxScore: number;
}

export default function TeachingStatistics() {
  // Mock dữ liệu
  const mockAverageScores: TestAverageScore[] = [
    { testId: "t1", testName: "Bài test Toán", averageScore: 7.8 },
    { testId: "t2", testName: "Bài test Văn", averageScore: 8.5 },
  ];

  const mockTopStudentsByTest: Record<string, StudentScore[]> = {
    t1: [
      { studentId: "s1", studentName: "Nguyễn Sỹ Hưng	", score: 10 },
      { studentId: "s2", studentName: "Trần Thị B", score: 9 },
      { studentId: "s3", studentName: "Lê Văn C", score: 8.5 },
    ],
    t2: [
      { studentId: "s4", studentName: "Phạm Thị D", score: 9.8 },
      { studentId: "s5", studentName: "Hoàng Văn E", score: 9.5 },
    ],
  };


  // State
  const [averageScores, setAverageScores] = useState<TestAverageScore[]>([]);
  const [topStudentsByTest, setTopStudentsByTest] = useState<
    Record<string, StudentScore[]>
  >({});
  const [classStudentInfos, setClassStudentInfos] = useState<
    ClassStudentInfo[]
  >([]);
  // Giả lập fetch data
  useEffect(() => {
    const fetchData = async () => {
      const classStudentInfosResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/teacher//get-students-by-class`,
        { teacherId: getUserIdFromLocalStorage() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Mô phỏng fetch API với delay
      const timer = setTimeout(() => {
        setAverageScores(mockAverageScores);
        setTopStudentsByTest(mockTopStudentsByTest);
        setClassStudentInfos(classStudentInfosResponse.data);
      }, 500);

      return () => clearTimeout(timer);
    };

    fetchData();

    // Cleanup function for setTimeout
    return () => {};
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [attendedSessions, setAttendedSessions] = useState(0);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const token = useAccessToken();
  const fetchClassHistory = async (
    classId: string | undefined,
    studentId: string | undefined
  ) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user/get-class-history`,
      {
        classId,
        userId: studentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      setTotalSessions(response.data.totalSessions);
      setAttendedSessions(response.data.attendedSessions);
      setTestHistory(response.data.testResults || []);
    }
  };

  const showHistoryModal = (
    classId: string | undefined,
    studentId: string | undefined
  ) => {
    setIsModalOpen(true);
    fetchClassHistory(classId, studentId);
  };

  return (
    <>
      <PageMeta
        title="EzLearn - Thống kê giảng dạy"
        description="Thống kê điểm bài test và học sinh"
      />
      <PageBreadcrumb pageTitle="Thống kê giảng dạy" />

      <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Điểm trung bình các bài test
        </h2>
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tên bài test
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Điểm trung bình
              </th>
            </tr>
          </thead>
          <tbody>
            {averageScores.map(({ testId, testName, averageScore }) => (
              <tr
                key={testId}
                className="border-b border-gray-200 dark:border-gray-600"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  {testName}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  {averageScore.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Top 5 học sinh điểm cao nhất từng bài test
        </h2>
        {averageScores.map(({ testId, testName }) => (
          <div key={testId} className="mb-8">
            <h3 className="text-xl font-medium mb-2 dark:text-white">
              {testName}
            </h3>
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Điểm
                  </th>
                </tr>
              </thead>
              <tbody>
                {(topStudentsByTest[testId] || []).map(
                  ({ studentId, studentName, score }) => (
                    <tr
                      key={studentId}
                      className="border-b border-gray-200 dark:border-gray-600"
                    >
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                        {studentName}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                        {score}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Thông tin học sinh trong các lớp học
        </h2>
        {classStudentInfos.map(({ classId, className, students }) => (
          <div key={classId} className="mb-8">
            <h3 className="text-xl font-medium mb-2 dark:text-white">
              {className}
            </h3>
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tên học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Số điện thoại
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.map(({ studentId, fullName, email, phone }) => (
                  <tr
                    key={studentId}
                    className="border-b border-gray-200 dark:border-gray-600"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {fullName}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {email || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      <Button
                        onClick={() => showHistoryModal(classId, studentId)}
                      >
                        {" "}
                        Xem chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Thống kê lịch sử
        </h2>

        <div className="mb-6">
          <h3 className="font-semibold mb-2 dark:text-white">
            Lịch sử các bài thi:
          </h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 max-h-48 overflow-y-auto">
            {testHistory.map((test) => (
              <li key={test.id}>
                {test.name} - {test.date} - Điểm: {test.score} / {test.maxScore}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4 dark:text-white">
          <strong>Số buổi học đã diễn ra:</strong> {totalSessions}
        </div>

        <div className="mb-4 dark:text-white">
          <strong>Số buổi học đã điểm danh:</strong> {attendedSessions}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>
        </div>
      </Modal>
    </>
  );
}
