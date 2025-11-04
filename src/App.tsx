import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import Contact from "./components/Contact";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse";
import RefundPolicy from "./components/RefundPolicy";
import CourseDetails from "@/Pages/CourseDetails";
import { Toaster } from "@/components/ui/sonner";
import UserProfile from "./Pages/UserProfile";
import MyCourses from "./Pages/MyCourses";
import CourseLearning from "./Pages/CourseLearning";

function App() {
  return (
    <>

      <Toaster richColors position="top-center" />

      <Router>
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />

            <Route path="/courses/:id" element={<CourseDetails />} />

            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/my-courses/:id" element={<CourseLearning />} />

            {/* <Route path="/my-courses/:id/resources" element={<Resources />} />
            <Route path="/my-courses/:id/videos" element={<VideoLectures />} />
            <Route path="/my-courses/:id/mock-test" element={<MockTest />} />
            <Route path="/my-courses/:id/pyq" element={<PYQ />} /> */}


          </Routes>
        </main>

        <Footer />
      </Router>
    </>
  );
}

export default App