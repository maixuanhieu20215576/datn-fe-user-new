import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ReactPlayer from "react-player";
import {
  getUserIdFromLocalStorage,
  useAccessToken,
} from "../../components/common/utils";
import Button from "../../components/ui/button/Button";

interface UnitContent {
  title: string;
  overview: string;
  fileUrl: string;
  lectureType: "mp4" | "pdf";
}

export default function UnitPage() {
  const token = useAccessToken();

  const navigate = useNavigate();
  const { unitId, id } = useParams();

  const [currentUnitId, setCurrentUnitId] = useState<string | undefined>(
    unitId
  );
  const [content, setContent] = useState<UnitContent | undefined>(undefined);
  const [parentUnit, setParentUnit] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"overview" | "lecture">(
    "overview"
  );
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [nextLectureId, setNextLectureId] = useState<string | undefined>(
    undefined
  );
  const [lastLectureId, setLastLectureId] = useState<string | undefined>(
    undefined
  );
  const [learningProcessStatus, setLearningProcessStatus] = useState<
    string | undefined
  >(undefined);

  const [duration, setDuration] = useState(0);
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);

  const userId = getUserIdFromLocalStorage();
  useEffect(() => {
    const fetchUnitContent = async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/course/get-unit-content`,
        {
          lectureId: currentUnitId,
          courseId: id,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent(response.data.lectureContent);
      setParentUnit(response.data.parentUnit);
      setNextLectureId(response.data.nextLectureId);
      setLastLectureId(response.data.lastLectureId);
      setLearningProcessStatus(response.data.status);
    };
    fetchUnitContent();
  }, [unitId]);

  const handleTabChange = (tab: "overview" | "lecture") => {
    setActiveTab(tab);
    if (tab === "lecture") {
      setIsPdfLoading(true);
    }
  };

  {
    /* useEffect(() => {
    const updateCourseLearningProcessStatus = async () => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/course/update-course-learning-process-status`,
        {
          courseId: id,
          unitId: currentUnitId,
        })
    }
  })
     */
  }

  const handleMarkComplete = async () => {
    await axios.post(
      `${
        import.meta.env.VITE_API_URL
      }/course/update-course-learning-process-status`,
      {
        courseId: id,
        unitId: currentUnitId,
        userId,
        status: "done",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLearningProcessStatus("done");
    setHasMarkedComplete(true);
  };
  const handleVideoProgress = (state: { playedSeconds: number }) => {
    if (!hasMarkedComplete) {
      const percentWatched = (state.playedSeconds / duration) * 100;

      if (percentWatched >= 95) {
        handleMarkComplete();
        setLearningProcessStatus("done");
        handleMarkComplete();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Title */}
      <div className="flex items-center text-xl mb-2 space-x-2 dark:text-white">
        <Link
          to={`/your-course/${id}`}
          className="hover:none text-gray-900 dark:text-white"
        >
          Khóa học
        </Link>
        <span>›</span>
        <span>{parentUnit}</span>
        <span>›</span>
        <span className="text-blue-500 dark:text-blue-500 font-bold">
          {content?.title}
        </span>
      </div>

      {/* Tab Buttons */}
      <div className="flex space-x-4 my-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "overview"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-white"
          }`}
          onClick={() => handleTabChange("overview")}
        >
          Tổng quan
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "lecture"
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
          {content.overview}
        </div>
      )}

      {activeTab === "lecture" && (
        <div className="relative w-full h-[800px] flex justify-center items-center">
          {/* Loading Spinner */}
          {content?.lectureType === "pdf" && isPdfLoading && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          )}

          {/* PDF Viewer */}
          {content?.lectureType === "pdf" && (
            <object
              data={content.fileUrl}
              type="application/pdf"
              width="100%"
              height="800px"
              onLoad={() => setIsPdfLoading(false)}
            >
              <p>PDF không load được.</p>
            </object>
          )}

          {content?.lectureType === "mp4" && (
            <ReactPlayer
              width="100%"
              height="800px"
              controls
              url={content.fileUrl}
              onDuration={(d) => setDuration(d)}
              onProgress={handleVideoProgress}
              progressInterval={1000}
            />
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        {/* Bài trước */}
        <Button
          onClick={() => {
            navigate(`/your-course/${id}/unit/${lastLectureId}`);
            setCurrentUnitId(lastLectureId);
          }}
          disabled={lastLectureId === ""}
        >
          Bài trước
        </Button>

        {/* Đánh dấu đã học */}
        {/* Chỉ hiện nút khi không phải video, hoặc video đã xem >= 95% */}
        {(content?.lectureType !== "mp4" ||
          learningProcessStatus === "done") && (
          <Button
            variant={learningProcessStatus === "done" ? "success" : "primary"}
            onClick={() => handleMarkComplete()}
            disabled={learningProcessStatus === "done"}
          >
            {learningProcessStatus === "done"
              ? "Đã học xong ✔"
              : "Đánh dấu là đã học xong ✔"}
          </Button>
        )}

        {/* Bài sau */}

        <Button
          onClick={() => {
            navigate(`/your-course/${id}/unit/${nextLectureId}`);
            setCurrentUnitId(nextLectureId);
          }}
          disabled={nextLectureId === ""}
        >
          Bài sau
        </Button>
      </div>
    </div>
  );
}
