import { useState } from "react";
import Logo from "../../assets/logo/BuStudy.svg";


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
            </div>
          </div>

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
    </header>
  );
};

export default Header;
