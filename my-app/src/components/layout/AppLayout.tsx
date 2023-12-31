import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import authUtils from "../../util/AuthUtil";
import { Container, Box } from "@mui/material";
import Loading from "../common/Loading";
import Sidebar from "../common/Sidebar";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/userSlice";

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated();
      if (!user) {
        navigate("/login");
      } else {
        dispatch(setUser(user));
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);
  return loading ? (
    <Loading fullHeight={true} />
  ) : (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 1, width: "max-content" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
