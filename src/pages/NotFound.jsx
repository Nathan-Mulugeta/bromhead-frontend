import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="mb-4 text-5xl font-bold text-gray-800">
        404 - Not Found
      </div>
      <div className="mb-8 text-lg text-gray-600">
        Sorry, the page you are looking for does not exist.
      </div>
      <Link
        to="/"
        className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-blue-400 focus:border-blue-300 focus:outline-none focus:ring"
      >
        <FaHome className="mr-2" />
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;
