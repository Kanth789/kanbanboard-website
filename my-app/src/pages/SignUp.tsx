import React from "react";

import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Box, TextField, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authClient";
import { toast } from "react-toastify";
import UI from "../constants/ui";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usernameErr, setUserNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserNameErr("");
    setPasswordErr("");
    setConfirmPasswordErr("");
    const formElement = e.target as HTMLFormElement;
    const data = new FormData(formElement);
    const username = (data.get("username") as string).trim();
    const password = (data.get("password") as string).trim();
    const confirmPassword = (data.get("confirmPassword") as string).trim();
    let err = false;
  
    if (username === "") {
      err = true;
      setUserNameErr(UI.PLEASE_ENTER_THE_USER);
    }
  
    if (password === "") {
      err = true;
      setPasswordErr(UI.PLEASE_ENTER_THE_PASSWORD);
    }
  
    if (confirmPassword === "") {
      err = true;
      setConfirmPasswordErr(UI.PLEASE_ENTER_THE_CONFIRM_PASSWORD);
    }
  
    if (password !== confirmPassword) {
      err = true;
      setConfirmPasswordErr(UI.THE_PASSWORDS_ARE_NOT_MATCHING);
    }
  
    if (err) {
      return;
    }
  
    try {
      const res = await authApi.signup({ username, password, confirmPassword });
      setLoading(false);
      
      const token = res.data?.token;
      
      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
        toast.success(UI.SIGNUP_SUCCESSFUL, {
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
          if (e.param === "confirmPassword") {
            setConfirmPasswordErr(e.msg);
          }
        });
      }
      setLoading(false)
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
          inputProps={{ 'data-testid': 'username-input' }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          name="password"
          disabled={loading}
          type="password"
          error={passwordErr !== ""}
          helperText={passwordErr}
          label="Password"
          inputProps={{ 'data-testid': 'password-input' }}

        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          disabled={loading}
          type="password"
          error={confirmPasswordErr !== ""}
          helperText={confirmPasswordErr}
          label="Confirm Password"
          inputProps={{ 'data-testid': 'confirmPassword-input' }}

        />
        <LoadingButton
          sx={{ mt: 3 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          {UI.SIGNUP}
        </LoadingButton>
        <Button component={Link} to="/login" sx={{ textTransform: "none" }}>
         {UI.ALREADY_HAVE_AN_ACCOUNT}
        </Button>
      </Box>
    </>
  );
};

export default SignUp;
