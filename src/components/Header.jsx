import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed left-0 right-0 top-0 z-10">
      <div className="container mx-auto flex items-center justify-between p-6">
        <span className="text-2xl font-bold text-white md:text-4xl">
          A.A. Bromhead.
        </span>
        <div>
          <Link
            to="/login"
            className="bg-white p-2 px-7 text-lg font-bold text-primary transition duration-100 hover:border-2 hover:border-white hover:bg-transparent hover:text-white md:text-2xl"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
