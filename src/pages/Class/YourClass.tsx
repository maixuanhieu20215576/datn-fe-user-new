import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  getUserIdFromLocalStorage,
  useAccessToken,
  useDeviceQueries,
} from "../../components/common/utils";
import { constants } from "../../components/common/constants";
import {
  AlertIcon,
  CheckBadgeIcon,
  ClockIcon,
  Language,
  MemberIcon,
  UserIcon,
} from "../../icons";
import Button from "../../components/ui/button/Button";
import { useNavigate } from "react-router";
import Modal from "../../components/ui/modal";

interface IncomingTest {
  _id: string;
  name: string;
  examDate: string;
  examTime: string;
  isDoneTest: boolean;
}

interface TestHistory {
  id: string;
  name: string;
  date: string;
  score: number;
  maxScore: number;
}

const ClassCard = ({
  image,
  title,
  teacherName,
  language,
  currentStudent,
  classUrl,
  followingClassTime,
  canJoinClass,
  classId,
  token,
  incomingTest,
}: {
  image: string | undefined;
  title: string | undefined;
  language: string | undefined;
  teacherName: string | undefined;
  currentStudent: number | undefined;
  classId: string | undefined;
  classUrl: string;
  followingClassTime: string;
  canJoinClass: boolean;
  token: string;
  incomingTest?: IncomingTest | string | null;
}) => {
  const navigate = useNavigate();

  const handleClickClass = () => {
    window.open(classUrl, "_blank");
    axios.post(
      `${import.meta.env.VITE_API_URL}/user/attendance-check`,
      {
        classId: classId,
        userId: getUserIdFromLocalStorage(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [attendedSessions, setAttendedSessions] = useState(0);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);


  const fetchClassHistory = async (classId: string | undefined) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user/get-class-history`,
      {
        classId,
        userId: getUserIdFromLocalStorage(),
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

  const showHistoryModal = (classId: string | undefined) => {
    setIsModalOpen(true);
    fetchClassHistory(classId);
  };

  return (
    <div>
      <div className="flex items-center bg-white rounded-xl shadow p-4 mb-4 dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:scale-102 dark:text-white">
        <img
          src={image}
          alt="class"
          className="w-36 h-24 object-cover rounded-md mr-4"
        />

        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-1 ">{title}</h2>
          <div className="text-sm text-gray-500 flex items-center gap-2 mb-1 dark:text-gray-300">
            <UserIcon />
            {teacherName}{" "}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2 mb-2 dark:text-gray-300">
            <Language />
            {language}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2 mb-2 dark:text-gray-300">
            <MemberIcon />
            Số học viên đã đăng ký: {currentStudent}
          </div>
          <div
            className={
              followingClassTime
                ? "text-sm text-red-500 flex items-center gap-2 mb-2 dark:text-red-400"
                : "text-sm text-green-500 flex items-center gap-2 mb-2 dark:text-green-300"
            }
          >
            {followingClassTime ? <ClockIcon /> : <CheckBadgeIcon />}
            {followingClassTime
              ? `Buổi học sắp tới: ${followingClassTime}`
              : "Bạn đã hoàn thành lớp học này"}
          </div>
          {incomingTest &&
            typeof incomingTest !== "string" &&
            incomingTest.isDoneTest && (
              <div className="text-sm text-green-500 flex items-center gap-2 mb-2 dark:text-green-300">
                <CheckBadgeIcon />
                Đã hoàn thành bài thi{" "}
              </div>
            )}
          {incomingTest &&
            typeof incomingTest !== "string" &&
            !incomingTest.isDoneTest && (
              <div className="text-sm text-orange-500 flex items-center gap-2 mb-2 dark:text-orange-300">
                <AlertIcon />
                Chú ý: Có bài thi đang diễn ra!
              </div>
            )}
          <Button
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${
              !canJoinClass ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleClickClass}
            disabled={!canJoinClass}
          >
            Vào lớp
          </Button>
          <Button
            className="ml-3"
            variant="warning"
            onClick={() => {
              if (incomingTest && typeof incomingTest !== "string") {
                navigate("/tests/" + incomingTest._id);
              }
            }}
            disabled={
              !incomingTest ||
              typeof incomingTest === "string" ||
              incomingTest.isDoneTest
            }
          >
            Vào thi
          </Button>
          <Button
            className="ml-3"
            variant="outline"
            onClick={() => showHistoryModal(classId)}
          >
            Xem lịch sử
          </Button>
        </div>
      </div>

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
    </div>
  );
};

interface Class {
  _id: string;
  teacherId: string;
  teacherName: string;
  currentStudent?: number;
  language: string;
  classUrl: string;
  thumbnail?: string;
  className?: string;
  followingClassTime: string;
  canJoinClass: boolean;
  incomingTest?: IncomingTest | string | null;
}

export default function YourClass() {
  const token = useAccessToken();

  const { isDesktop } = useDeviceQueries();
  const [classes, setClasses] = useState<Class[]>([]);
  const userId = getUserIdFromLocalStorage();

  const fetchClass = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/course/get-registered-class`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setClasses(response.data);
  };

  useEffect(() => {
    fetchClass();
  }, []);

  return (
    <>
      <PageMeta
        title="EzLearn - Lớp học của bạn"
        description="EzLearn - Lớp học của bạn"
      />
      <PageBreadcrumb pageTitle="Lớp học của bạn" />
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexDirection: isDesktop ? "row" : "column",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          {classes.map((cls, index) => (
            <ClassCard
              key={index}
              image={cls.thumbnail}
              title={cls.className}
              teacherName={cls.teacherName}
              language={
                constants.languages[
                  (cls.language.charAt(0).toUpperCase() +
                    cls.language
                      .slice(1)
                      .toLowerCase()) as keyof typeof constants.languages
                ] || "Unknown"
              }
              currentStudent={cls.currentStudent}
              classId={cls._id}
              classUrl={cls.classUrl}
              followingClassTime={cls.followingClassTime}
              canJoinClass={cls.canJoinClass}
              token={token}
              incomingTest={
                typeof cls.incomingTest === "string"
                  ? null
                  : cls.incomingTest || undefined
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
