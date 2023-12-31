import { store } from "../../../store";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { usersApiSlice } from "../../slices/users/usersApiSlice";
import { projectsApiSlice } from "../../slices/projects/projectsApiSlice";
import { clientsApiSlice } from "../../slices/clients/clientsApiSlice";

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

    store.dispatch(
      clientsApiSlice.util.prefetch("getClients", "clientsList", {
        force: true,
      }),
    );
  }, []);

  return <Outlet />;
};
export default Prefetch;
