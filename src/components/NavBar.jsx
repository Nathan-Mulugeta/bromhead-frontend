import NavbarProfile from "./NavbarProfile";
import Logo from "../assets/bromhead-logo.svg";
import { MdOutlineMenu } from "react-icons/md";
import { useContext } from "react";
import { SidebarContext } from "./DashLayout";
import { Autocomplete, Button, Paper, TextField } from "@mui/material";

const statusList = [
  "Available",
  "Casual Leave",
  "Sick Leave",
  "Without Pay Leave",
  "At Work",
  "Study Leave",
  "Administration",
  "Staff Training",
  "General Promotion",
  "Public Holidays",
  "Annual Leave",
  "Mourning Leave",
  "Maternity Leave",
  "Others",
];

const NavBar = () => {
  const { expanded, setExpanded } = useContext(SidebarContext);
  const sidebarToggle = (e) => {
    e.stopPropagation(); // Prevents event propagation to ClickAwayListener
    setExpanded(!expanded);
  };

  return (
    <div className="sticky left-0 right-0 top-0 z-20 flex bg-backgroundLight">
      <nav className="container mx-auto flex items-center justify-between p-1 ">
        <Button onClick={sidebarToggle}>
          <MdOutlineMenu color="#fff" fontSize={25} />
        </Button>
        {/* <img className="h-14 w-14 sm:opacity-0" src={Logo} /> */}
        <div className="flex items-center gap-1">
          <Autocomplete
            disablePortal
            size="small"
            // value={formData.status}
            // onChange={(event, newValue) => {
            //   setFormData({
            //     ...formData,
            //     status: newValue,
            //   });
            // }}
            id="status"
            name="status"
            options={statusList}
            PaperComponent={({ children }) => (
              <Paper
                style={{
                  background: "#124056",
                }}
              >
                {children}
              </Paper>
            )}
            sx={{ width: 150 }}
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
          <NavbarProfile />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
