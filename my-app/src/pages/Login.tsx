import { useState } from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingButton } from "@mui/lab";
import { Box, TextField, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authClient";
import UI from "../constants/ui";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [usernameErr, setUserNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserNameErr("");
    setPasswordErr("");
    const formElement = e.target as HTMLFormElement;
    const data = new FormData(formElement);
    const username = (data.get("username") as string).trim();
    const password = (data.get("password") as string).trim();
    let err = false;

    if (username === "") {
      err = true;
      setUserNameErr(UI.PLEASE_ENTER_THE_USER);
    }

    if (password === "") {
      err = true;
      setPasswordErr(UI.PLEASE_ENTER_THE_PASSWORD);
    }

    if (err) {
      return;
    }

    try {
      const res = await authApi.login({ username, password });
      setLoading(false);

      const token = res.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        navigate("/");
        toast.success(UI.LOGIN_SUCCESSFUL, {
          position: "bottom-center",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error: any) {
      const errors = error.data.errors;

      if (Array.isArray(errors)) {
        errors.forEach((e) => {
          if (e.param === "username") {
            setUserNameErr(e.msg);
          }
          if (e.param === "password") {
            setPasswordErr(e.msg);
          }
        });
      }
      setLoading(false);
    }
  };
  return (
    <>
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          name="username"
          disabled={loading}
          error={usernameErr !== ""}
          helperText={usernameErr}
          label="UserName"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          name="password"
          disabled={loading}
          type="password"
          label="Password"
          error={passwordErr !== ""}
          helperText={passwordErr}
        />
        <LoadingButton
          sx={{ mt: 3 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          {UI.LOGIN}
        </LoadingButton>
        <Button component={Link} to="/signup" sx={{ textTransform: "none" }}>
          {UI.DONT_HAVE_ACCOUNT}
        </Button>
      </Box>
    </>
  );
};

export default Login;
