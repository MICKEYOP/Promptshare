import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePrompt from "./pages/CreatePrompt";
import Explore from "./pages/Explore";
import PromptDetail from "./pages/PromptDetail";
import EditPrompt from "./pages/EditPrompt";
import AdminDashboard from "./pages/AdminDashboard";
import SavedPrompts from "./pages/SavedPrompts";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import ImageStudio from "./pages/ImageStudio";   
import Trending from "./pages/Trending";  
import TopContributors from "./pages/TopContributors";

function App() {
  return (
    <Router>
      {/* Navbar should NOT have bg-white */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/prompt/:id" element={<PromptDetail />} />
        <Route path="/image-studio" element={<ImageStudio />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/top-contributors" element={<TopContributors />} />
        {/* 🔐 Protected Routes */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePrompt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditPrompt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedPrompts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/user/:id"  
          element={
            <ProtectedRoute>
              <PublicProfile />
            </ProtectedRoute>
          } 
          />
        
        <Route 
          path="/image-studio" 
          element={  
          <ProtectedRoute>
              <ImageStudio />
            </ProtectedRoute>
          } />
          
      </Routes>
    </Router>

    
  );
}

export default App;
