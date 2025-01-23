import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <nav className="w-64 bg-white dark:bg-gray-700 p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/shared-boards" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            Shared Boards
          </Link>
        </li>
        <li>
          <Link to="/create-board" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            Create Your Own Board
          </Link>
        </li>
        <li>
          <Link to="/profile" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
