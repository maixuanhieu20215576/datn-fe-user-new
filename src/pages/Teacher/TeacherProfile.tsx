import { useEffect, useState } from "react";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  getUserIdFromLocalStorage,
  useAccessToken,
} from "../../components/common/utils";
import { Link, useParams } from "react-router";
import Alert from "../../components/ui/alert/Alert";
import CommentSection from "../UiElements/CommentSection";

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  rating: number;
  createdAt: string;
}

interface TeacherProfileData {
  _id: string;
  teacherName: string;
  phoneNumber: string;
  email: string;
  avatar: string;
  teachingLanguage: string[];
  teacherSkills: {
    languageSkills: string;
    teachingLanguage: string[];
  }[];
  teachingClass: {
    classId: string;
    className: string;
  }[];
  startWorkAt: string;
}

export default function TeacherProfile() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [profileData, setProfileData] = useState<TeacherProfileData | null>(
    null
  );
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = getUserIdFromLocalStorage();
  const token = useAccessToken();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!teacherId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/teacher/profile/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(response.data);
        setError(null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              "Có lỗi xảy ra khi tải thông tin giáo viên"
          );
        } else {
          setError("Có lỗi xảy ra khi tải thông tin giáo viên");
        }
      }
    };

    fetchProfileData();
  }, [teacherId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!teacherId) return;

      setIsLoadingComments(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/teacher/comments/${teacherId}`,
          {
            params: {
              page: currentPage,
              limit: 5,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComments(response.data.comments);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message || "Có lỗi xảy ra khi tải bình luận"
          );
        } else {
          setError("Có lỗi xảy ra khi tải bình luận");
        }
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [teacherId, currentPage]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/post-comment`,
        {
          content: newComment,
          rating: rating,
          teacherId: teacherId,
          userId,
          teacherProfile: profileData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setNewComment("");
        setRating(5);
        setCurrentPage(1);
        setError(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Có lỗi xảy ra khi gửi bình luận"
        );
      } else {
        setError("Có lỗi xảy ra khi gửi bình luận");
      }
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageMeta
        title="EzLearn - Hồ sơ giáo viên"
        description="Xem hồ sơ giáo viên"
      />
      <PageBreadcrumb pageTitle="Hồ sơ giáo viên" />

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mt-20">
          <Alert variant="error" title="Lỗi" message={error} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <img
            src={profileData.avatar}
            alt="Teacher Avatar"
            className="w-24 h-24 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              {profileData.teacherName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {profileData.email}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Bắt đầu giảng dạy từ:{" "}
              {new Date(profileData.startWorkAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Ngôn ngữ giảng dạy
          </h3>
          <div className="flex flex-wrap gap-2">
            {profileData.teachingLanguage?.map((language, index) => (
              <span
                key={index}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
              >
                {language}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Kỹ năng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.teacherSkills.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              >
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {skill.languageSkills}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skill.teachingLanguage.map((lang, langIndex) => (
                    <span
                      key={langIndex}
                      className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Lớp học đang giảng dạy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileData.teachingClass.map((classItem) => (
              <div
                key={classItem.classId}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              >
                <Link
                  to={`/class/${classItem.classId}`}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {classItem.className}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Đánh giá và nhận xét
          </h3>

          <CommentSection
            comments={comments}
            isLoadingComments={isLoadingComments}
            newComment={newComment}
            setNewComment={setNewComment}
            rating={rating}
            setRating={setRating}
            handleSubmitComment={handleSubmitComment}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}
