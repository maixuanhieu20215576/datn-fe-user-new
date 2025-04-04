import { useEffect, useState } from "react";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getUserIdFromLocalStorage } from "../../components/common/utils";
import BarChartOne from "../../components/charts/bar/BarChartOne";


interface TeachingStatisticsByClass {
    _id: string;
    className: string;
    totalRevenue: number;
    rating: number;
    totalStudents: number;
    maxStudents: number;
}

type TimePeriod = "day" | "week" | "month" | "year";



export default function TeacherDashboard() {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
    const [totalClasses, setTotalClasses] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [totalTeachingDays, setTotalTeachingDays] = useState(0);
    const [teachingStatisticsByClass, setTeachingStatisticsByClass] = useState<TeachingStatisticsByClass[]>([]);
    const userId = getUserIdFromLocalStorage();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/teacher/statistics/${userId}?timePeriod=${timePeriod}`
                );
                setTotalRevenue(response.data.totalRevenue);
                setTotalClasses(response.data.totalClass);
                setAverageRating(response.data.averageRatingByUser);
                setTotalTeachingDays(response.data.totalTeachingDay);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, [userId, timePeriod]);

    useEffect(() => {
        const fetchTeachingStatisticsByClass = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/teacher/statistics-by-class/${userId}?timePeriod=${timePeriod}`
                );
                setTeachingStatisticsByClass(response.data);
            } catch (error) {
                console.error("Error fetching teaching statistics by class:", error);
            }
        };

        fetchTeachingStatisticsByClass();
    }, [userId, timePeriod]);

    return (
        <>
            <PageMeta
                title="EzLearn - Thống kê"
                description="Thống kê doanh thu và lớp học"
            />
            <PageBreadcrumb pageTitle="Thống kê" />

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Biểu đồ doanh thu
                </h3>
                <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="week">Theo tuần</option>
                    <option value="month">Theo tháng</option>
                    <option value="year">Theo năm</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Tổng doanh thu
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {totalRevenue.toLocaleString()}đ
                    </p>
                </div>

                {/* Total Classes Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Tổng số lớp học
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {totalClasses}
                    </p>
                </div>

                {/* Average Rating Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Đánh giá trung bình
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {averageRating} ⭐
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Tổng số buổi dạy
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {totalTeachingDays}
                    </p>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    Biểu đồ doanh thu
                </h3>
                <BarChartOne 
                    categories={
                        timePeriod === "month" 
                    ? ["Ngày 1", "Ngày 5", "Ngày 10", "Ngày 15", "Ngày 20", "Ngày 25", "Ngày 30"] 
                    : (timePeriod === "year" 
                    ? ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"] 
                    : (timePeriod === "week" 
                    ? ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"] 
                    : [])) as string[]
                } 
                seriesData={
                    timePeriod === "month"
                    ? Array.from({ length: 7 }, () => Math.floor(Math.random() * 500))
                    : (timePeriod === "year"
                    ? Array.from({ length: 12 }, () => Math.floor(Math.random() * 500))
                    : (timePeriod === "week"
                    ? Array.from({ length: 7 }, () => Math.floor(Math.random() * 500))
                    : [])) as number[]
                }
            />
            </div>

            {/* Class Statistics Table */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    Thống kê lớp học
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Tên lớp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Doanh thu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Đánh giá
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Số học viên
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {teachingStatisticsByClass.map((cls) => (
                                <tr key={cls._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {cls.className}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {cls.totalRevenue.toLocaleString()}đ
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {cls.rating} ⭐
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {cls.totalStudents}/{cls.maxStudents ? cls.maxStudents : "Không giới hạn"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}