import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo/BuStudy.svg";

const MAIN_COLOR = "#FF7413";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative z-20 w-full bg-white shadow-sm">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="BuStudy logo" className="w-auto h-10" />
            <div>
              <h1 className="text-lg font-semibold">BuStudy</h1>
              <p className="text-xs text-gray-500">Study smarter, together</p>
            </div>
          </div>

          <nav className="items-center hidden gap-4 sm:flex">
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
              className="px-3 py-1 text-sm border rounded-md"
              style={{ borderColor: "#eee" }}
            >
              도움말
            </NavLink>
          </nav>

          <div className="sm:hidden">
            <button
              aria-label="메뉴 열기"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
              className="inline-flex items-center justify-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
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

      {mobileOpen && (
        <div className="absolute left-0 right-0 bg-white border-t shadow-md sm:hidden">
          <div className="max-w-5xl px-4 py-3 mx-auto space-y-2">
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 text-base font-medium text-gray-700 rounded"
              style={{ background: MAIN_COLOR, color: "#fff" }}
            >
              시작하기
            </NavLink>
            <NavLink
              to="/help"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 text-base font-medium text-gray-700 border rounded"
              style={{ borderColor: "#eee" }}
            >
              도움말
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
