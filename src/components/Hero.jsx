import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      id="landingHero"
      className="flex h-screen items-center justify-center bg-cover bg-center"
    >
      <div className="relative flex max-w-[700px] flex-col items-start rounded-xl  text-white">
        <div className="absolute -left-40 -top-32 h-[30rem] w-[30rem] rounded-full bg-primary/40"></div>
        <h1 className="z-10 mb-10 text-4xl font-bold md:text-6xl">
          Meaningful Financial Investments
        </h1>
        <p className="z-10 mb-8 max-w-sm text-lg md:text-xl">
          Browse vetted investment offerings in communities all over the US.
        </p>
        <Link
          to="/contact"
          className="z-10 rounded-md bg-blue-500 px-6 py-3 font-semibold text-white transition duration-100 hover:bg-blue-600"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Hero;
