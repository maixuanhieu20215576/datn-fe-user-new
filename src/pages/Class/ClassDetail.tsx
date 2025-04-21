import { useParams, Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { constants } from "../../components/common/constants";
import ResponsiveImage from "../../components/ui/images/ResponsiveImage";
import { formatNumber, getUserIdFromLocalStorage } from "../../components/common/utils";
import ClassDescription from "../../components/common/ClassDescription";
import Modal from "../../components/ui/modal";
interface Schedule {
    date?: string;
    timeFrom: string;
    timeTo: string;
}

interface Class {
    _id: string;
    className: string;
    teacherId: string;
    teacherName: string;
    maxStudent?: number;
    currentStudent: number;
    language: string;
    level?: string;
    price: number;
    priceType: string;
    status: string;
    schedule: Schedule[];
    classUrl: string;
    classType: string;
    thumbnail?: string;
    stringForDisplayScheduleByDayOfWeeks: string[];
}

export default function ClassDetail() {
    const { id } = useParams();
    const [classData, setClassData] = useState<Class | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const navigate = useNavigate();
    const userId = getUserIdFromLocalStorage();

    useEffect(() => {
        const checkRegistration = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/course/check`, {
                    userId,
                    classId: id,
                });
                setIsRegistered(response.data.result);
            } catch (err) {
                console.error("Error checking registration:", err);
            }
        };

        checkRegistration();
    }, [userId, id]);

    useEffect(() => {
        const fetchClassDetail = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/fetch-class/${id}`);
                setClassData(response.data.classInfo);
                setLoading(false);
            } catch (err) {
                setError(err as string);
                setLoading(false);
            }
        };

        fetchClassDetail();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!classData) return <div>No class data found</div>;

    const handleRegister = async () => {
        try {
            setIsRedirecting(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/payment`, {
                price: classData.priceType === constants.priceType.byDay ? classData.price * classData.schedule.length : classData.price,
                userId,
                classId: id,
            });
            if (response.status === 200) {
                window.location.href = response.data.paymentUrl;
                setShowModal(false);
            } else {
                alert("Đăng ký thất bại!");
            }
        } catch (err) {
            alert(err as string);
        } finally {
            setIsRedirecting(false);
        }
    };

    return (
        <>
            <PageMeta
                title={`EzLearn - ${classData.className}`}
                description={`Chi tiết lớp học ${classData.className}`}
            />
            <PageBreadcrumb pageTitle={classData.className} />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <ResponsiveImage
                            src={classData.thumbnail || "/default-class-image.jpg"}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-4 text-blue-500">{classData.className}</h1>

                        <div className="space-y-3">
                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Giảng viên:</span>
                                <Link to={`/teacher-profile/${classData.teacherId}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                                    {classData.teacherName}
                                </Link>
                            </p>

                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Ngôn ngữ:</span>
                                {constants.languages[classData.language as keyof typeof constants.languages]}
                            </p>

                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Học phí:</span>
                                {formatNumber(classData.price)}đ/{classData.priceType === constants.priceType.byDay ? "buổi" : "khóa"}
                            </p>

                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Số học viên đã đăng ký:</span>
                                {formatNumber(classData.currentStudent)}/{classData.maxStudent ? formatNumber(classData.maxStudent) : "Không giới hạn"}
                            </p>

                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Tổng số buổi học:</span>
                                {formatNumber(classData.schedule.length)}
                            </p>
                        </div>
                    </div>
                </div>

                <ClassDescription language={classData.language.charAt(0).toUpperCase() + classData.language.slice(1).toLowerCase()} />

                <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h1 className="text-xl font-semibold mb-4 text-blue-500">Lịch học</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classData.schedule.length > 0 && (
                            <div className="col-span-full text-gray-700 dark:text-gray-300">
                                <p>Bắt đầu từ ngày: {classData.schedule[0].date}</p>
                                <p>Đến ngày: {classData.schedule[classData.schedule.length - 1].date}</p>
                            </div>
                        )}
                        {classData.stringForDisplayScheduleByDayOfWeeks.map((stringForDisplayScheduleByDayOfWeek, index) => (
                            <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                                <p className="text-gray-700 dark:text-gray-300">{stringForDisplayScheduleByDayOfWeek}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => isRegistered ? navigate(`/your-class/${id}`) : setShowModal(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
                        disabled={classData.status !== "open"}
                    >
                        {classData.status === "open"
                            ? isRegistered
                                ? "Đã đăng ký, vào học ngay thôi! 💯"
                                : classData.currentStudent === classData.maxStudent
                                    ? "Lớp đã đầy, không thể đăng ký 😓"
                                    : "Đăng ký ngay"
                            : "Lớp đã đóng"}
                    </button>
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Xác nhận đăng ký</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Bạn có chắc chắn muốn đăng ký lớp học này không?
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                        disabled={isRedirecting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleRegister}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        disabled={isRedirecting}
                    >
                        {isRedirecting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang chuyển hướng...
                            </>
                        ) : (
                            "Xác nhận"
                        )}
                    </button>
                </div>
            </Modal>
        </>
    );
}
