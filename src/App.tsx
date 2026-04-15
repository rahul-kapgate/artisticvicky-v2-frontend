import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";

// 🏠 Main Pages
import Home from "@/Pages/Home";
import Contact from "@/components/Contact";
import NotFound from "@/Pages/NotFound";

// ⚙️ Footer Pages
import PrivacyPolicy from "@/components/footer-links/PrivacyPolicy";
import TermsOfUse from "@/components/footer-links/TermsOfUse";
import RefundPolicy from "@/components/footer-links/RefundPolicy";

// 🎓 Course Pages
import CourseDetails from "@/Pages/CourseDetails";
import MyCourses from "@/Pages/MyCourses";
import CourseLearning from "@/Pages/CourseLearning";
import Resources from "@/Pages/Resources";

// 🧑‍🎓 User Pages
import UserProfile from "@/Pages/UserProfile";

// 🧩 Tests
import MockTestPage from "@/Pages/MockTestPage";
import AttemptTestReview from "@/Pages/AttemptTestReview";

// Video Lectures
import VideoLectures from "./Pages/VideoLectures";

// Live Test
import LiveTestPage from "./Pages/LiveTestPage";
import CourseLiveTestsPage from "./Pages/CourseLiveTestsPage";

import WhatsAppWidgetGate from "@/layouts/WhatsAppWidgetGate";
import MasterClassDetails from "./components/MasterClassDetails";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <WhatsAppWidgetGate />

      <Routes>
        {/* ✅ Full-screen route WITHOUT header/footer */}
        <Route path="/live-test/:id" element={<LiveTestPage />} />

        {/* ✅ All normal pages WITH header/footer */}
        <Route path="/" element={<Layout />}>
          {/* 🏠 Public Pages */}
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />

          {/* ⚙️ Footer Links */}
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfUse />} />
          <Route path="refund-policy" element={<RefundPolicy />} />

          {/* 🎓 Course Flow */}
          <Route path="courses/:id" element={<CourseDetails />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="my-courses/:id" element={<CourseLearning />} />
          <Route path="my-courses/:id/resources" element={<Resources />} />
          <Route path="my-courses/:id/videos" element={<VideoLectures />} />

          <Route path="masterclass/:id" element={<MasterClassDetails />} />

          {/* 🧩 Tests & Reviews */}
          <Route
            path="my-courses/:id/mock-test"
            element={<MockTestPage type="mock" />}
          />
          <Route
            path="my-courses/:id/pyq-mock-test"
            element={<MockTestPage type="pyq" />}
          />
          <Route
            path="mock-test/result/:attempt_id"
            element={<AttemptTestReview />}
          />
          <Route
            path="pyq-mock-test/result/:attempt_id"
            element={<AttemptTestReview />}
          />

          {/* ✅ Live Test list page WITH layout */}
          <Route
            path="my-courses/:id/live-test"
            element={<CourseLiveTestsPage />}
          />

          {/* 🧑‍🎓 User */}
          <Route path="profile" element={<UserProfile />} />

          {/* ❌ Fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
