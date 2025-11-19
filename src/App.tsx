import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import HomeViewPage from "./pages/HomeView/HomeViewPage";
import SearchStationPage from "./pages/SearchStation/SearchStationPage";
import CreateProblemPage from "./pages/CreateProblem/CreateProblemPage";
import TravelTimeCalcPage from "./pages/TravelTimeCalc/TravelTimeCalc";
import SubjectRegisterPage from "./pages/SubjectRegister/SubjectRegisterPage";
import SolveProblemPage from "./pages/SolveProblem/SolveProblemPage";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다 (404)</h2>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomeViewPage />} />
        <Route path="/search" element={<SearchStationPage />} />
        <Route path="/solve" element={<SolveProblemPage />} />
        <Route path="/create" element={<CreateProblemPage />} />
        <Route path="/travel" element={<TravelTimeCalcPage />} />
        <Route path="/subjects" element={<SubjectRegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
