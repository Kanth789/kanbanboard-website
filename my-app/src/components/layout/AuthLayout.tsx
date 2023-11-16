import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import authUtils from "../../util/AuthUtil";
import Loading from "../common/Loading";
import { Container, Box } from "@mui/material";
const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated();
      {console.log(isAuth)}
      if (!isAuth) {
        setLoading(false);
      } else {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);
  return loading ? (
    <Loading fullHeight={true} />
  ) : (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <span>Kanban </span>
        <Outlet/>
      </Box>
    </Container>
  );
};

export default AuthLayout;
