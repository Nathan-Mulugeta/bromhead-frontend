import { GridLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div>
      <div className="fixed top-0 z-50 flex h-full w-full items-center justify-center bg-white opacity-50">
        <GridLoader color="#3085FE" size={30} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
