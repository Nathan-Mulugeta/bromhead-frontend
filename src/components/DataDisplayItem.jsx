import { Typography, Box, Grid, Avatar } from "@mui/material";

const DataDisplayItem = ({ label, value, icon }) => (
  <Grid container alignItems="center" spacing={2}>
    {icon && (
      <Grid item>
        <Avatar style={{ backgroundColor: "#124056" }}>{icon}</Avatar>
      </Grid>
    )}
    <Grid item xs>
      <Box>
        <Typography
          color="primary.contrastText"
          variant="subtitle1"
          style={{ fontWeight: "bold" }}
        >
          {label}
        </Typography>
        <Typography color="primary.contrastText" variant="body1">
          {value}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

export default DataDisplayItem;
