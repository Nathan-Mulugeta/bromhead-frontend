import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRefreshMutation } from "../../slices/auth/authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { toast } from "react-toastify";
import { setLoading } from "../../slices/loading/loadingSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);
  const navigate = useNavigate();

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          await refresh();
          setTrueSuccess(true);
        } catch (error) {
          console.log(error);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);
    // eslint-disable-next-line
  }, []);

  let content;

  if (!persist) {
    // persist: no
    content = <Outlet />;
  } else if (isError) {
    //persist: yes, token: no
    toast.error(error?.data?.message);
    navigate("/login");
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
