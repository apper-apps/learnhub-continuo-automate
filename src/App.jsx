import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import HomePage from "@/components/pages/HomePage";
import ProgramHubPage from "@/components/pages/ProgramHubPage";
import ProgramDetailPage from "@/components/pages/ProgramDetailPage";
import InsightPage from "@/components/pages/InsightPage";
import PostDetailPage from "@/components/pages/PostDetailPage";
import ReviewsPage from "@/components/pages/ReviewsPage";
import ProfilePage from "@/components/pages/ProfilePage";
import AdminPage from "@/components/pages/AdminPage";
import AdminUsersPage from "@/components/pages/AdminUsersPage";
import AdminProgramsPage from "@/components/pages/AdminProgramsPage";
import AdminLecturesPage from "@/components/pages/AdminLecturesPage";
import AdminPostsPage from "@/components/pages/AdminPostsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="program" element={<ProgramHubPage />} />
            <Route path="program/:slug" element={<ProgramDetailPage />} />
            <Route path="insight" element={<InsightPage />} />
            <Route path="insight/:slug" element={<PostDetailPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="admin/users" element={<AdminUsersPage />} />
            <Route path="admin/programs" element={<AdminProgramsPage />} />
            <Route path="admin/lectures" element={<AdminLecturesPage />} />
            <Route path="admin/posts" element={<AdminPostsPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;