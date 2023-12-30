import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background">
      <div className="m-4 rounded-md bg-backgroundLight p-6">
        <div className="mb-4 text-3xl font-bold text-text-light sm:text-5xl">
          404 - Not Found
        </div>
        <div className="text-text-dark mb-8 text-lg">
          Sorry, the page you are looking for does not exist.
        </div>
        <Link
          to="/"
          className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-secondary focus:border-blue-300 focus:outline-none focus:ring"
        >
          <FaHome className="mr-2" />
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
