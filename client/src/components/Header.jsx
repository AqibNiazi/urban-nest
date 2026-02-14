import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
console.log("Current User in header", currentUser);

const handleSubmit = (e) => {
  e.preventDefault();

  const params = new URLSearchParams(location.search);

  if (searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  } else {
    params.delete("searchTerm");
  }

  navigate(`/search?${params.toString()}`);
};

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const searchTermFromUrl = params.get("searchTerm");

  if (searchTermFromUrl) {
    setSearchTerm(searchTermFromUrl);
  }
}, [location.search]);

return (
  <header className="bg-slate-200 shadow-md">
    <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
      <Link to="/">
        <h1 className="font-bold text-slate-700 text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500 mr-1">Urban</span>
          <span className="text-slate-700">Nest</span>
        </h1>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-100 p-3 rounded-lg flex items-center"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="bg-transparent focus:outline-none w-24 sm:w-64"
        />
        <button type="submit">
          <FaSearch className="text-slate-600" />
        </button>
      </form>

      <ul className="flex gap-4">
        <Link to="/">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            Home
          </li>
        </Link>
        <Link to="/about">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            About
          </li>
        </Link>
        <Link to="/profile">
          {currentUser ? (
            <img
              src={currentUser?.avatar}
              alt="profile"
              className="rounded-full h-7 w-7 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Sign in
            </li>
          )}
        </Link>
      </ul>
    </div>
  </header>
);
};

export default Header;
