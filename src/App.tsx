import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";

import Home from "./Pages/Home";
import Contact from "./components/Contact";
import PrivacyPolicy from "./components/footer-links/PrivacyPolicy";
import TermsOfUse from "./components/footer-links/TermsOfUse";
import RefundPolicy from "./components/footer-links/RefundPolicy";
import CourseDetails from "@/Pages/CourseDetails";
import UserProfile from "./Pages/UserProfile";
import MyCourses from "./Pages/MyCourses";
import CourseLearning from "./Pages/CourseLearning";
import NotFound from "./Pages/NotFound"
import ScrollToTop from "./components/ScrollToTop";
import AttemptTestReview from "./Pages/AttemptTestReview";
import MockTestPage from "./Pages/MockTestPage";

function App() {
  return (
    <Router>
      <ScrollToTop />
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
          <Route path="/mock-test/result/:attempt_id" element={<AttemptTestReview />} />
          <Route path="/pyq-mock-test/result/:attempt_id" element={<AttemptTestReview />} />

          <Route path="my-courses/:id/mock-test" element={<MockTestPage type="mock" />} />
          <Route path="my-courses/:id/pyq-mock-test" element={<MockTestPage type="pyq" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
