import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useAccessToken } from "../../components/common/utils";

interface Course {
  _id: string | null | undefined;
  course_name: string;
  course_instr?: string;
  course_rating?: number;
  course_totalHourse?: number;
  course_lectures?: number;
  course_level?: string;
  price: number;
  price_dis?: number;
  course_enrollmenters?: number;
  language?: string;
  thumbnail?: string;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course>();
  const [loading, setLoading] = useState(false);
  const [isPurchase, setIsPurchase] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "");
    const token = useAccessToken();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/course/${id}`)
      .then((res) => res.json())
      .then((data) => setCourse(data.course));
  }, [id]);

  useEffect(() => {
    const checkPurchase = async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/course/check`,
        {
          userId: user._id,
          courseId: course?._id,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsPurchase(res.data.result);
    };
    checkPurchase();
  }, [user._id, course?._id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const redirectToPayment = async () => {
    setLoading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/payment`,
      {
        price: course ? course.price_dis ?? course.price : 0,
        courseId: course?._id,
        userId: user._id,
      }
    );
    // Mở thanh toán trong một tab mới
    window.open(response.data.paymentUrl, '_blank');
    setLoading(false);
  };
  return (
    <>
      <PageMeta
        title="EzLearn - Khóa học"
        description="EzLearn - Chi tiết khóa học"
      />
      <PageBreadcrumb pageTitle="Chi tiết khóa học" />
      {!loading && (
        <div className="container mx-auto px-4 py-6">
          {course ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thumbnail */}
              <div>
                <img
                  src={
                    course.thumbnail || "https://via.placeholder.com/500x300"
                  }
                  alt={course.course_name}
                  className="w-full h-auto rounded-lg shadow"
                />
              </div>

              <div className="flex flex-col space-y-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                  {course.course_name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">{course.course_instr}</p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
                  <div>
                    <strong>Số giờ học:</strong>{" "}
                    {course.course_totalHourse || 0} giờ
                  </div>
                  <div>
                    <strong>Số bài giảng:</strong> {course.course_lectures || 0}
                  </div>
                  <div>
                    <strong>Cấp độ:</strong>{" "}
                    {course.course_level || "Không xác định"}
                  </div>
                  <div>
                    <strong>Ngôn ngữ:</strong> {course.language || "Không rõ"}
                  </div>
                  <div>
                    <strong>Số người đã đăng ký học:</strong>{" "}
                    {course.course_enrollmenters || 0}
                  </div>
                  <div>
                    <strong>Đánh giá:</strong> ⭐{" "}
                    {course.course_rating?.toFixed(1) || "0.0"}
                  </div>
                </div>

                {/* Giá */}
                <div className="text-xl mt-4">
                  {course.price_dis ? (
                    <>
                      <span className="text-gray-500 line-through mr-2">
                        {formatPrice(course.price)} đ
                      </span>
                      <span className="text-green-600 font-bold text-2xl">
                        {formatPrice(course.price_dis)} đ
                      </span>
                    </>
                  ) : (
                    <span className="text-green-600 font-bold text-2xl">
                      {formatPrice(course.price)} đ
                    </span>
                  )}
                </div>

                {/* Button */}
                <button
                  className={`mt-4 py-2 px-4 rounded-lg transition ${
                    isPurchase
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  disabled={isPurchase}
                  onClick={redirectToPayment}
                >
                  {isPurchase ? "Khóa học đã được thanh toán" : "Đăng ký học"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Đang tải thông tin khóa học...
            </div>
          )}
        </div>
      )}
      {loading && (
        <div className="flex flex-col items-center justify-center h-screen">
          <CircularProgress />
          <p className="mt-4 text-gray-600">
            Đang chuyển hướng màn trang thanh toán, vui lòng không thoát khỏi
            trang...
          </p>
        </div>
      )}
    </>
  );
}
