import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import axios from "axios";
import { getUserIdFromLocalStorage } from "../../components/common/utils";
import Button from "../../components/ui/button/Button";
import { useNavigate } from "react-router";
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

export default function YourCourse() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/course/get-courses`, {
        userId: getUserIdFromLocalStorage(),
      })
      .then((res) => setCourses(res.data.courses));
  }, []);

  return (
    <>
      <PageMeta
        title="EzLearn - Khóa học"
        description="EzLearn - Khoá học của bạn"
      />
      <PageBreadcrumb pageTitle="Khóa học của bạn" />
      <div className="space-y-4  overflow-hidden">
        {courses.map((course) => (
          <div
            key={course._id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow border dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:scale-102 dark:text-white"
          >
            <img
              src={course.thumbnail}
              alt={course.course_name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium">{course.course_name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{course.course_instr || "N/A"}</p>
            </div>
            <Button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" onClick={() => navigate(`/your-course/${course._id}`)}>
              Tiếp tục học
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
