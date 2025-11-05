import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";

// Pages
import Home from "./Pages/Home";
import Contact from "./components/Contact";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse";
import RefundPolicy from "./components/RefundPolicy";
import CourseDetails from "@/Pages/CourseDetails";
import UserProfile from "./Pages/UserProfile";
import MyCourses from "./Pages/MyCourses";
import CourseLearning from "./Pages/CourseLearning";
import MockTest from "./Pages/MockTest";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Wrap all pages in Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfUse />} />
          <Route path="refund-policy" element={<RefundPolicy />} />

          <Route path="courses/:id" element={<CourseDetails />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="my-courses/:id" element={<CourseLearning />} />
          <Route path="my-courses/:id/mock-test" element={<MockTest />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
