import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import HomeViewPage from "./pages/HomeView/HomeViewPage";
import SubjectRegisterPage from "./pages/SubjectRegister/SubjectRegisterPage";
import SolveProblemPage from "./pages/SolveProblem/SolveProblemPage";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("app.notFound")}</h2>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<HomeViewPage />} />
        <Route path="/solve" element={<SolveProblemPage />} />
        <Route path="/subjects" element={<SubjectRegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
