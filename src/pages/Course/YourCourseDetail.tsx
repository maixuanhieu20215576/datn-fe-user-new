// src/App.js
import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "../../icons";
import { ChevronUpIcon } from "../../icons";
import { useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

interface Course {
  course_name: string;
  lectures: [
    {
      name: string;
      units: [
        {
          _id: string;
          title: string;
          overview: string;
          fileUrl: string;
        }
      ];
    }
  ];
}

const AccordionItem = ({ title, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 dark:border-gray-700 dark:bg-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-3 px-4 bg-gray-200 hover:bg-gray-200 focus:outline-none flex items-center justify-between dark:bg-gray-800"
      >
        <span className="dark:text-white dark:font-bold">{title}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-white" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-white" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-10 overflow-hidden dark:text-white dark:bg-gray-900"
          >
            <div className="py-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const CourseMenu = () => {
  return (
    <div className="flex space-x-4 bg-white p-4 shadow-md">
      <button className="text-blue-500">Khóa học</button>
      <button className="text-gray-700">Tiến độ học tập</button>
      <button className="text-gray-700">Thảo luận</button>
    </div>
  );
};

const CourseContent = () => {
  const [course, setCourse] = useState<Course>();
  const courseId = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourseUnit = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/course/get-course-unit/${courseId.id}`
      );
      const data = await response.json();
      console.log(data);
      setCourse(data);
    };
    fetchCourseUnit();
  }, [courseId]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4 dark:text-white">
        {course?.course_name}
      </h1>
      {course?.lectures.map((lecture, idx) => (
        <AccordionItem key={idx} title={lecture.name}>
          <div className="space-y-2">
            {lecture.units.map((unit, cidx) => (
              <div
                key={cidx}
                className="text-gray-700 hover:text-gray-900 cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md dark:text-white dark:hover:bg-gray-700"
                onClick={() =>
                  navigate(`/your-course/${courseId.id}/unit/${unit._id}`)
                }
              >
                {unit.title}
              </div>
            ))}
          </div>
        </AccordionItem>
      ))}
    </div>
  );
};

const CourseTools = () => {
  return (
    <div className="bg-white shadow-md p-4">
      <h2 className="font-semibold text-xl">Công cụ khóa học</h2>
      <button className="text-blue-500 mt-4">Các bài học đã lưu</button>
      <div className="mt-6">
        <p className="font-semibold">Lưu ý các mốc thời gian</p>
        <p className="text-sm text-gray-600">Kết thúc khóa học: 01/08/2025</p>
        <p className="text-sm text-gray-600">
          Sau thời gian này, khóa học sẽ chuyển sang trạng thái lưu trữ.
        </p>
      </div>
    </div>
  );
};

const YourCourseDetail = () => {
  return (
    <div className="flex space-x-8">
      <div className="w-2/3">
        <CourseMenu />
        <CourseContent />
      </div>
      <div className="w-1/3">
        <CourseTools />
      </div>
    </div>
  );
};

export default YourCourseDetail;
