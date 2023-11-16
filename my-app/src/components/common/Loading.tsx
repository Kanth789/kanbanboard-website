import React from "react";
import { Box, CircularProgress } from "@mui/material";

interface Props {
  fullHeight?: boolean;
}

const Loading = ({ fullHeight }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: fullHeight ? "100vh" : "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
