import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { FiLogOut, FiUser, FiPlusCircle, FiLayers } from "react-icons/fi";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use navigate hook to redirect

  // Extracting user data from Redux state
  const user = useSelector((state: RootState) => state.auth.user);

  // Handle logout action
  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    localStorage.removeItem("accessToken"); // Remove token from localStorage

    navigate("/"); // Redirect to login page after logout
  };

  return (
    <nav className="w-64 h-screen bg-white dark:bg-gray-700 shadow-lg p-6 flex flex-col justify-between transition-all duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-6">
          {user ? `Welcome, ${user.username}` : "Dashboard"}
        </h2>
        <ul className="space-y-4">
          <li>
            <Link to="/shared-boards" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-all duration-300">
              <FiLayers className="mr-2" /> Shared Boards
            </Link>
          </li>
          <li>
            <Link to="/create-board" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-all duration-300">
              <FiPlusCircle className="mr-2" /> Create Your Own Board
            </Link>
          </li>
          <li>
            <Link to={`/user-profile/${user?.id}`} className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-all duration-300">
              <FiUser className="mr-2" /> Profile
            </Link>
          </li>
          <li>
            <Link to="/users-all-boards" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-all duration-300">
              <FiLayers className="mr-2" /> All Boards
            </Link>
          </li>
        </ul>
      </div>

      {/* Logout Button at the Bottom */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-red-600 transition-all duration-300 w-full py-3 border-t border-gray-300 dark:border-gray-600 mt-6"
      >
        <FiLogOut className="mr-2" />
        Logout
      </button>
    </nav>
  );
};

export default Sidebar;
