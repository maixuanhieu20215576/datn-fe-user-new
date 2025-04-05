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
import Home from "./pages/Dashboard/Home";
import ApplicationForms from "./pages/Forms/ApplicationForms";
import ApplicationForm from "./pages/ApplicationForm";
import Course from "./pages/Course";
import CourseDetail from "./pages/Course/CourseDetail";
import YourCourse from "./pages/Course/YourCourse";
import Class from "./pages/Class/Class";
import ClassDetail from "./pages/Class/ClassDetail";
import YourClass from "./pages/Class/YourClass";
import TeacherStatistics from "./pages/Teacher/TeacherStatistics";
import TeacherProfile from "./pages/Teacher/TeacherProfile";
import ClassCalendar from "./pages/Class/ClassCalendar";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

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

            <Route path="/course" element={<Course />} />
            <Route path="/course/:id" element={<CourseDetail />} />

            <Route path='/your-course' element={<YourCourse />} />
            <Route path="/class" element={<Class />} />
            <Route path="/class-detail/:id" element={<ClassDetail />} />
            <Route path="/your-class" element={<YourClass />} />
            <Route path="/teacher-statistics" element={<TeacherStatistics />} />
            <Route path="/teacher-profile/:teacherId" element={<TeacherProfile />} />
            <Route path="/class-calendar" element={<ClassCalendar />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
