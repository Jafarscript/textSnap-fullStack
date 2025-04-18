import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-700">
        TextSnap
      </Link>
      {!isLanding && (
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-600 transition font-medium"
        >
          Home
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
