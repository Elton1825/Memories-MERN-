import React, { useState } from "react";
import { Grid, Typography, Container, Button } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { PaperStyled, FormRoot, AvatarStyled, SubmitButton } from "./styles.js";
import Input from "./Input.jsx";
import {signin,signup} from "../../actions/auth"

const initialState={firstName:" ",lastName:" ",email:" ",password:" ",confirmPassword:" "};

function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData,setFormData]=useState(initialState);

  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(isSignUp){
      dispatch(signup(formData,navigate));
    }
    else{
      dispatch(signin(formData,navigate));
    }
  };

  const handleChange = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setShowPassword(false);
  };

  const googleSuccess = async (credentialResponse) => {
  try {
    const token = credentialResponse.credential;
    const result = jwtDecode(token); // decode JWT to get user info

    dispatch({ type: "AUTH", data: { result, token } });
    navigate("/"); // React Router v6
  } catch (error) {
    console.log(error);
  }
};

  const googleFailure = () => {
    console.log("Google Login Failed");
  };

  return (
    <Container component="main" maxWidth="xs">
      <PaperStyled elevation={3}>
        <AvatarStyled>
          <LockOutlinedIcon />
        </AvatarStyled>
        <Typography variant="h5">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Typography>
        <FormRoot onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignUp && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>

          {/* ✅ Fixed Google Login */}
          <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} />

          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </SubmitButton>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </Button>
            </Grid>
          </Grid>
        </FormRoot>
      </PaperStyled>
    </Container>
  );
}

export default Auth;
