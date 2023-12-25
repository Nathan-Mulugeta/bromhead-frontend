import { store } from "../../../store";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { usersApiSlice } from "../../slices/users/usersApiSlice";
import { projectsApiSlice } from "../../slices/projects/projectsApiSlice";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      projectsApiSlice.util.prefetch("getProjects", "projectsList", {
        force: true,
      }),
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true }),
    );
  }, []);

  return <Outlet />;
};
export default Prefetch;
