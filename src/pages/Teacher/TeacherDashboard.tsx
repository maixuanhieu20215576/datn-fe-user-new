import { useEffect, useState } from "react";
import axios from "axios";
import { getUserIdFromLocalStorage } from "../../components/common/utils";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BarChart from "../../components/ui/charts/BarChart";

interface ClassStats {
    _id: string;
    className: string;
    totalRevenue: number;
    rating: number;
    totalStudents: number;
}

interface MonthlyRevenue {
    month: string;
    revenue: number;
}

type TimePeriod = "day" | "month" | "year";

export default function TeacherDashboard() {
    const [classStats, setClassStats] = useState<ClassStats[]>([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
    const userId = getUserIdFromLocalStorage();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/teacher/dashboard/${userId}`,
                    {
                        params: { timePeriod }
                    }
                );
                setClassStats(response.data.classStats);
                setMonthlyRevenue(response.data.monthlyRevenue);
                setTotalRevenue(response.data.totalRevenue);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, [userId, timePeriod]);

    const chartData = {
        labels: monthlyRevenue.map((item) => item.month),
        datasets: [
            {
                label: `Doanh thu theo ${timePeriod === "day" ? "ngày" : timePeriod === "month" ? "tháng" : "năm"}`,
                data: monthlyRevenue.map((item) => item.revenue),
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <>
            <PageMeta
                title="EzLearn - Teacher Dashboard"
                description="Teacher Dashboard with revenue and class statistics"
            />
            <PageBreadcrumb pageTitle="Teacher Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Revenue Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Tổng doanh thu
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {totalRevenue.toLocaleString()}đ
                    </p>
                </div>

                {/* Total Classes Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Tổng số lớp học
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {classStats.length}
                    </p>
                </div>

                {/* Average Rating Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Đánh giá trung bình
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {(classStats.reduce((acc, curr) => acc + curr.rating, 0) / classStats.length).toFixed(1)} ⭐
                    </p>
                </div>
            </div>

            {/* Revenue Chart with Time Period Selector */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                        Biểu đồ doanh thu
                    </h3>
                    <select
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="day">Theo ngày</option>
                        <option value="month">Theo tháng</option>
                        <option value="year">Theo năm</option>
                    </select>
                </div>
                <BarChart data={chartData} />
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
                            {classStats.map((cls) => (
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
                                        {cls.totalStudents}
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