import { Backdrop } from "@mui/material";
import { GridLoader } from "react-spinners";
import { selectCurrentLoading } from "../slices/loading/loadingSlice";
import { useSelector } from "react-redux";

const LoadingSpinner = () => {
  const loading = useSelector(selectCurrentLoading);

  return (
    <Backdrop
      sx={{ color: "#3085FE", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <div className="fixed top-0 z-50 flex h-screen w-screen items-center justify-center bg-background opacity-50">
        <GridLoader color="#3085FE" size={30} />
      </div>
    </Backdrop>
  );
};

export default LoadingSpinner;
