import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import CreateMovie from "./components/Movie/CreateMovie/CreateMovie";
import MovieCatalog from "./components/Movie/MovieCatalog/MovieCatalog";
import MovieDetails from "./components/Movie/MovieDetails/MovieDetails";
import Profile from "./components/Profile/Profile";

import { AuthProvider } from "./Contexts/AuthContext";
import AuthGuard from "./components/guards/AuthGuard";

import appStyles from "./App.module.css";

function App() {
  return (
    <AuthProvider>
      <div className={appStyles.container}>
        <Header />

        <div className={appStyles.content}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MovieCatalog />} />
            <Route path="/movies/:movieId" element={<MovieDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route path="/create-movie" element={<CreateMovie />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
