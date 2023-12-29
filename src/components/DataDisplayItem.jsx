import { Typography, Box, Grid, Avatar } from "@mui/material";
const statusColors = {
  available: "bg-green-400", // Green for available
  "casual leave": "bg-orange-400", // Orange for casual leave
  "sick leave": "bg-red-400", // Red for sick leave
  "without pay leave": "bg-purple-400", // Purple for without pay leave
  "at work": "bg-blue-400", // Blue for at work
  "study leave": "bg-orange-400", // Yellow for study leave
};

const DataDisplayItem = ({ label, value, icon }) => {
  let content;
  let noInfo = false;
  let statusColor;

  if (label === "Status") {
    statusColor = statusColors[value];
  }

  if (value === "undefined" || value === "undefined undefined") {
    content = "Details unavailable";
    noInfo = true;
  } else {
    content = value;
  }

  return (
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
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            color={noInfo ? "#fca5a5" : "primary.contrastText"}
            variant="body1"
          >
            {statusColor && (
              <>
                <span className="relative flex h-3 w-3">
                  <span
                    className={`absolute inline-flex h-full w-full ${
                      statusColor === "bg-green-400" ? "animate-ping" : ""
                    }  rounded-full ${statusColor} opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${statusColor}`}
                  ></span>
                </span>
              </>
            )}
            {content}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DataDisplayItem;
