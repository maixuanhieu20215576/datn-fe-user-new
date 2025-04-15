import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getUserIdFromLocalStorage } from "../../components/common/utils";

interface UnitContent {
  childUnitName: string;
  unitOverview: string;
  unitLecture: string;
  lectureType: "video" | "pdf";
}

export default function UnitPage() {
  const navigate = useNavigate();
  const { unitId, id } = useParams();
  const [currentUnitId, setCurrentUnitId] = useState<string | undefined>(unitId)
  const [content, setContent] = useState<UnitContent | undefined>(undefined);
  const [parentUnit, setParentUnit] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"overview" | "lecture">("overview");
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [nextLectureId, setNextLectureId] = useState<string | undefined>(undefined);
  const [lastLectureId, setLastLectureId] = useState<string | undefined>(undefined);
  const [learningProcessStatus, setLearningProcessStatus] = useState<string | undefined>(undefined)

  const userId = getUserIdFromLocalStorage()
  useEffect(() => {
    const fetchUnitContent = async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/course/get-unit-content`,
        {
          lectureId: currentUnitId,
          courseId: id,
          userId,
        }
      );
      setContent(response.data.lectureContent);
      setParentUnit(response.data.parentUnit);
      setNextLectureId(response.data.nextLectureId);
      setLastLectureId(response.data.lastLectureId);
      setLearningProcessStatus(response.data.status)
    };
    fetchUnitContent();
  }, [currentUnitId]);

  const handleTabChange = (tab: "overview" | "lecture") => {
    setActiveTab(tab);
    if (tab === "lecture") {
      setIsPdfLoading(true);
    }
  };

  {/* useEffect(() => {
    const updateCourseLearningProcessStatus = async () => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/course/update-course-learning-process-status`,
        {
          courseId: id,
          unitId: currentUnitId,
        })
    }
  })
     */ }
  function convertYoutubeLink(url: string) {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w-]+)/);
    const videoId = match ? match[1] : "";
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Title */}
      <div className="flex items-center text-xl mb-2 space-x-2 dark:text-white">
        <Link to={`/your-course/${id}`} className="hover:none text-gray-900 dark:text-white">
          Khóa học
        </Link>
        <span>›</span>
        <span>{parentUnit}</span>
        <span>›</span>
        <span className="text-blue-500 dark:text-blue-500 font-bold">{content?.childUnitName}</span>
      </div>

      {/* Tab Buttons */}
      <div className="flex space-x-4 my-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "overview"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
          onClick={() => handleTabChange("overview")}
        >
          Tổng quan
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "lecture"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
          onClick={() => handleTabChange("lecture")}
        >
          Bài giảng
        </button>
      </div>

      {/* Content */}
      {activeTab === "overview" && content && (
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          {content.unitOverview}
        </div>
      )}

      {activeTab === "lecture" && (
        <div className="relative w-full h-[800px] flex justify-center items-center">
          {/* Loading Spinner */}
          {isPdfLoading && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          )}

          {/* PDF Viewer */}
          {content?.lectureType === "pdf" && (
            <object
              data={`${import.meta.env.VITE_API_URL}/api/proxy-pdf?fileId=19qbg_zUsw28PyY__Qfzt_oATeP2A8iNL`}
              type="application/pdf"
              width="100%"
              height="800px"
              onLoad={() => setIsPdfLoading(false)}
            >
              <p>PDF không load được.</p>
            </object>
          )}

          {/* Video Viewer */}
          {content?.lectureType === "video" && (
            <iframe
              width="100%"
              height="800px"
              src={convertYoutubeLink(content.unitLecture)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setIsPdfLoading(false)}
            ></iframe>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        {/* Bài trước */}
        <button
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          onClick={() => {
            navigate(`/your-course/${id}/unit/${lastLectureId}`);
            setCurrentUnitId(lastLectureId);
          }} >
          Bài trước
        </button>

        {/* Đánh dấu đã học */}
        <button
          className={`px-6 py-2 font-semibold rounded transition 
    ${learningProcessStatus === "done"
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"}
  `}
          onClick={() => {
            if (learningProcessStatus !== "done") {
              console.log("Đánh dấu đã học xong");
              // Ở đây bạn có thể gọi thêm API hoặc set trạng thái mới
            }
          }}
          disabled={learningProcessStatus === "done"}
        >
          {learningProcessStatus === "done"
            ? "Đã học xong ✔"
            : "Đánh dấu là đã học xong ✔"}
        </button>


        {/* Bài sau */}
        <button
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          onClick={() => {
            navigate(`/your-course/${id}/unit/${nextLectureId}`);
            setCurrentUnitId(nextLectureId);
          }}
        >
          Bài sau
        </button>
      </div>
    </div >
  );
}
