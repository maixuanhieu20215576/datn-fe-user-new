import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ApplicationForms from "./pages/Forms/ApplicationForms";
import ApplicationForm from "./pages/ApplicationForm";
import Course from "./pages/Course";
import CourseDetail from "./pages/Course/CourseDetail";
import YourCourse from "./pages/Course/YourCourse";
import Class from "./pages/Class/Class";
import ClassDetail from "./pages/Class/ClassDetail";
import YourClass from "./pages/Class/YourClass";
import RevenueStatistics from "./pages/Teacher/RevenueStatistics";
import TeacherProfile from "./pages/Teacher/TeacherProfile";
import ClassCalendar from "./pages/Class/ClassCalendar";
import { useState } from "react";
import Chat from "./pages/Chat";
import YourCourseDetail from "./pages/Course/YourCourseDetail";
import UnitDetail from "./pages/Course/UnitDetail";
import Test from "./pages/Test";
import JoinTest from "./pages/JoinTest";
import TestResult from "./pages/TestResult";
import ClassManagement from "./pages/ClassManagement";
import CreateTest from "./pages/CreateTest";
import TeachingStatistics from "./pages/Teacher/TeachingStatistics";

export default function App() {
  const [userId, setUserId] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user)._id : null;
  });

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={userId ? <AppLayout /> : <SignIn setUserId={setUserId} />}
          >
            <Route index path="/" element={<UserProfiles />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="application-form" element={<ApplicationForm />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/application-forms" element={<ApplicationForms />} />
            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
            {/* Course For Management */}

            <Route path="/course" element={<Course />} />
            <Route path="/course/:id" element={<CourseDetail />} />

            <Route path="/your-course" element={<YourCourse />} />
            <Route path="/your-course/:id" element={<YourCourseDetail />} />
            <Route
              path="/your-course/:id/unit/:unitId"
              element={<UnitDetail />}
            />
            {/* Class For Student */}
            <Route path="/class" element={<Class />} />
            <Route path="/class-detail/:id" element={<ClassDetail />} />
            <Route path="/your-class" element={<YourClass />} />
            <Route path="/class-calendar" element={<ClassCalendar />} />

            {/* Teaching Management */}

            <Route path="/revenue-statistics" element={<RevenueStatistics />} />
            <Route path="/teaching-statistics" element={<TeachingStatistics />} />

            <Route
              path="/teacher-profile/:teacherId"
              element={<TeacherProfile />}
            />
            <Route path="/class-management" element={<ClassManagement />} />
            <Route
              path="/create-test/teacher/:teacherId/class/:classId"
              element={<CreateTest />}
            />
            {/* Chat */}
            <Route path="/chat" element={<Chat />} />

            {/* Test For Student */}
            <Route path="/test" element={<Test />} />
            <Route path="/tests/:testId" element={<JoinTest />} />
            <Route path="/test-result/:testResultId" element={<TestResult />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn setUserId={setUserId} />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
