import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../slices/auth/authApiSlice";
import { setCredentials } from "../slices/auth/authSlice";
import { toast } from "react-toastify";
import usePersist from "../hooks/usePersist";
import { setLoading } from "../slices/loading/loadingSlice";

const Login = () => {
  useTitle("Employee Login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { accessToken } = await login({
        username: username.trim(),
        password: password.trim(),
      }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      toast.success("Login successful");
      navigate("/dash/home  ", { replace: true });
    } catch (err) {
      if (!err.status) {
        toast.error("No Server Response");
      } else if (err.status === 400) {
        toast.error("Missing Username or Password");
      } else if (err.status === 401) {
        toast.error("Wrong credentials");
      } else {
        toast.error("Unable to connect to server");
      }
    }
  };

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleUsernameFocus = () => setUsernameFocused((prev) => !prev);
  const handlePasswordFocus = () => setPasswordFocused((prev) => !prev);
  const handleToggle = () => setPersist((prev) => !prev);

  return (
    <section>
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* <div className="flex flex-1 p-10 text-6xl text-white items-center justify-center bg-gradient-to-r from-[#3C48FF] via-blue-500 to-[#957AFE]">
          Bromhead
        </div> */}
        <div
          id="loginHero"
          className="hidden flex-1 flex-col items-center justify-center p-4 sm:flex"
        >
          <div className="container flex h-full flex-1 flex-col justify-between md:justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-white md:text-xl"
            >
              <IoIosArrowBack color="white" />
              <p>Back to landing page</p>
            </Link>
            <p className="flex flex-1 items-center justify-center text-5xl text-white md:text-7xl lg:text-9xl">
              A.A. Bromhead.
            </p>
          </div>
        </div>
        <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-1 bg-background p-4">
          <header className="text-3xl font-semibold leading-10 text-text-light lg:text-5xl">
            Welcome Back 👋
          </header>
          <p className="mb-4 text-text-light lg:mb-14 lg:text-xl">
            Hello there, login to continue
          </p>
          <main>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="relative mt-2 flex flex-col rounded-xl border border-primary p-2">
                <label
                  htmlFor="username"
                  className={`absolute text-primary transition-all ${
                    usernameFocused || username
                      ? "-top-5 text-xs"
                      : "top-2 text-sm"
                  }`}
                >
                  Username
                </label>
                <input
                  className="bg-transparent text-primary outline-none"
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsername}
                  autoComplete="off"
                  required
                  onFocus={handleUsernameFocus}
                  onBlur={handleUsernameFocus}
                />
              </div>
              <div className="relative mt-2 flex flex-col rounded-xl border border-primary p-2">
                <label
                  htmlFor="password"
                  className={`absolute text-primary transition-all ${
                    passwordFocused || password
                      ? "-top-5 text-xs"
                      : "top-2 text-sm"
                  }`}
                >
                  Password
                </label>
                <input
                  className="bg-transparent text-primary outline-none"
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePassword}
                  required
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordFocus}
                />
              </div>
              <p className="text-primary">Forgot password ?</p>
              <button className="rounded-xl bg-primary p-2 py-3 text-white outline-text-light">
                Login
              </button>
              <label
                htmlFor="persist"
                className="flex items-center gap-2 text-primary"
              >
                <input
                  type="checkbox"
                  id="persist"
                  onChange={handleToggle}
                  checked={persist}
                  className="transition-all hover:scale-110"
                />
                Trust This Device
              </label>

              {/* <p className="my-2 text-center text-text-light">
                Or continue with social account
              </p>

              <button className="rounded-xl border border-gray-200 p-3 text-text-normal">
                Google OAuth
              </button> */}
            </form>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Login;
