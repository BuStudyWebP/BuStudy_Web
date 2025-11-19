import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import {
  HomeView,
  SearchStation,
  SolveProblem,
  CreateProblem,
  TravelTimeCalc,
  SubjectRegister,
} from "./pages";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다 (404)</h2>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/search" element={<SearchStation />} />
        <Route path="/solve" element={<SolveProblem />} />
        <Route path="/create" element={<CreateProblem />} />
        <Route path="/travel" element={<TravelTimeCalc />} />
        <Route path="/subjects" element={<SubjectRegister />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
