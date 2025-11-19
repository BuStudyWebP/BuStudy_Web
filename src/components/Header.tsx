import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo/BuStudy.svg";

const MAIN_COLOR = "#FF7413";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm relative z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="BuStudy logo" className="h-10 w-auto" />
            <div>
              <h1
                className="text-lg font-semibold"
                style={{ color: MAIN_COLOR }}
              >
                BuStudy
              </h1>
              <p className="text-xs text-gray-500">Study smarter, together</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex gap-4 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm px-3 py-1 rounded-md ${
                  isActive ? "text-white" : "text-gray-700"
                }`
              }
              style={{ background: MAIN_COLOR }}
              end
            >
              시작하기
            </NavLink>

            <NavLink
              to="/help"
              className="text-sm px-3 py-1 rounded-md border"
              style={{ borderColor: "#eee" }}
            >
              도움말
            </NavLink>
          </nav>

          {/* Mobile hamburger */}
          <div className="sm:hidden">
            <button
              aria-label="메뉴 열기"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
              className="p-2 rounded-md inline-flex items-center justify-center text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="sm:hidden absolute left-0 right-0 bg-white shadow-md border-t">
          <div className="max-w-5xl mx-auto px-4 py-3 space-y-2">
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block text-base font-medium text-gray-700 px-2 py-2 rounded"
              style={{ background: MAIN_COLOR, color: "#fff" }}
            >
              시작하기
            </NavLink>
            <NavLink
              to="/help"
              onClick={() => setMobileOpen(false)}
              className="block text-base font-medium text-gray-700 px-2 py-2 rounded border"
              style={{ borderColor: "#eee" }}
            >
              도움말
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
