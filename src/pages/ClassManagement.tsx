import { useEffect, useState } from "react";
import axios from "axios";
import {
  getUserIdFromLocalStorage,
  useAccessToken,
  useDeviceQueries,
} from "../components/common/utils";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { constants } from "../components/common/constants";
import { ArrowRightIcon, CheckBadgeIcon, ClockIcon } from "../icons";
import Button from "../components/ui/button/Button";
import { useNavigate } from "react-router";

const ClassCard = ({
  image,
  title,

  language,
  currentStudent,
  classUrl,
  followingClassTime,
  canJoinClass,
  classId,
  token,
  classIsEnded = false,
}: {
  image: string | undefined;
  title: string | undefined;
  language: string | undefined;
  currentStudent: number | undefined;
  classId: string | undefined;
  classUrl: string;
  followingClassTime: string;
  canJoinClass: boolean;
  token: string;
  classIsEnded?: boolean;
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

  const handleCreateTest = () => {
    const userId = getUserIdFromLocalStorage();
    navigate("/create-test/teacher/" + userId + "/class/" + classId);
  };

  return (
    <div className="flex items-center bg-white rounded-xl shadow p-4 mb-4 dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:scale-102 dark:text-white">
      <img
        src={image}
        alt="class"
        className="w-36 h-24 object-cover rounded-md mr-4"
      />

      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-1 ">{title}</h2>

        <div className="text-sm text-gray-500 flex items-center gap-2 mb-2 dark:text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
            />
          </svg>
          {language}
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-2 mb-2 dark:text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
          Số học viên đã đăng ký: {currentStudent}
        </div>
        <div
          className={
            classIsEnded
              ? "text-sm text-red-500 flex items-center gap-2 mb-2 dark:text-red-400"
              : "text-sm text-green-500 flex items-center gap-2 mb-2 dark:text-green-300"
          }
        >
          {classIsEnded ? <ClockIcon /> : <CheckBadgeIcon />}
          {classIsEnded
            ? `Buổi học sắp tới: ${followingClassTime}`
            : "Đã hoàn thành việc giảng dạy"}
        </div>
        <Button onClick={handleClickClass} disabled={!canJoinClass}>
          Vào lớp <ArrowRightIcon />
        </Button>
        <Button
          onClick={handleCreateTest}
          disabled={!classIsEnded}
          variant="success"
          className="ml-3"
        >
          Tạo bài thi
        </Button>
      </div>
    </div>
  );
};

interface Class {
  _id: string;
  teacherId: string;
  currentStudent?: number;
  language: string;
  classUrl: string;
  thumbnail?: string;
  className?: string;
  followingClassTime: string;
  canJoinClass: boolean;
  classIsEnded?: boolean;
}

export default function ClassManagement() {
  const token = useAccessToken();

  const { isDesktop } = useDeviceQueries();
  const [classes, setClasses] = useState<Class[]>([]);
  const userId = getUserIdFromLocalStorage();

  const fetchClass = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/teacher/get-classes/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setClasses(data);
  };

  useEffect(() => {
    fetchClass();
  }, [userId]);

  return (
    <>
      <PageMeta
        title="EzLearn - Quản lý Lớp học của bạn"
        description="EzLearn - Quản lý lớp học của bạn"
      />
      <PageBreadcrumb pageTitle="Quản lý lớp học của bạn" />
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
              classIsEnded={cls.classIsEnded}
            />
          ))}
        </div>
      </div>
    </>
  );
}
