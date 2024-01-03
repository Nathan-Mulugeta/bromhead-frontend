import { Skeleton, Typography } from "@mui/material";
import React from "react";

const Card = ({ title, value, Icon }) => {
  return (
    <div className="text-text-darkLight flex cursor-pointer items-center justify-between rounded-lg bg-backgroundLight p-4 transition-all hover:bg-secondary  hover:text-text-light">
      <div>
        <Typography variant="body1" fontSize={14} color="inherit">
          {title}
        </Typography>
        {value ? (
          <Typography
            variant="body2"
            fontWeight={700}
            fontSize={24}
            color="primary.contrastText"
          >
            {value}
          </Typography>
        ) : (
          <Skeleton variant="text" height={34} />
        )}
      </div>
      {/* The icon should be passed as a value not as a component and should be from mui icons */}
      <Icon color="inherit" fontSize="large" />
    </div>
  );
};

export default Card;
