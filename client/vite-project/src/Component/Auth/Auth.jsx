import React, { useState } from "react";
import {
  Grid,
  Typography,
  Container,
  Button,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Divider,
  Fade,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import DevicesIcon from "@mui/icons-material/Devices";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled, keyframes } from "@mui/material/styles";

import { signin, signup } from "../../actions/auth";

// ============ ANIMATIONS ============
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.02); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ============ STYLED COMPONENTS ============
const AuthWrapper = styled(Box)(() => ({
  minHeight: "100vh",
  display: "flex",
  background: "linear-gradient(135deg, #0c0c14 0%, #1a1a2e 50%, #0c0c14 100%)",
  position: "relative",
  overflow: "hidden",
}));

const BackgroundDecor = styled(Box)(() => ({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: 0,
}));

const FloatingShape = styled(Box)(({ top, left, size, delay, color }) => ({
  position: "absolute",
  top: top,
  left: left,
  width: size,
  height: size,
  borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%",
  background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
  border: `1px solid ${color}10`,
  animation: `${float} 10s ease-in-out infinite`,
  animationDelay: delay,
}));

const GlowOrb = styled(Box)(({ top, left, color }) => ({
  position: "absolute",
  top: top,
  left: left,
  width: "350px",
  height: "350px",
  borderRadius: "50%",
  background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
  filter: "blur(60px)",
  animation: `${pulse} 8s ease-in-out infinite`,
}));

const GridPattern = styled(Box)(() => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
  `,
  backgroundSize: "60px 60px",
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: "1.1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(8),
  position: "relative",
  zIndex: 1,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: "0.9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  position: "relative",
  zIndex: 1,
}));

const AuthCard = styled(Box)(() => ({
  width: "100%",
  maxWidth: "420px",
  padding: "40px",
  borderRadius: "28px",
  background: "rgba(20, 20, 35, 0.7)",
  backdropFilter: "blur(24px)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  boxShadow: "0 30px 60px -20px rgba(0, 0, 0, 0.5)",
}));

const LogoBox = styled(Box)(() => ({
  width: "56px",
  height: "56px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
  backgroundSize: "200% 200%",
  animation: `${gradientMove} 5s ease infinite`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px",
  boxShadow: "0 12px 30px -8px rgba(99, 102, 241, 0.5)",
}));

const TabContainer = styled(Box)(() => ({
  display: "flex",
  gap: "8px",
  padding: "6px",
  borderRadius: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  marginBottom: "28px",
}));

const TabButton = styled(Button)(({ active }) => ({
  flex: 1,
  padding: "12px 16px",
  borderRadius: "12px",
  fontSize: "0.9rem",
  fontWeight: 600,
  textTransform: "none",
  color: active ? "#fff" : "rgba(255, 255, 255, 0.4)",
  backgroundColor: active ? "rgba(99, 102, 241, 0.2)" : "transparent",
  border: active ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid transparent",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: active ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.05)",
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.08)",
      transition: "all 0.3s ease",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.15)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6366f1",
      borderWidth: "2px",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(99, 102, 241, 0.04)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.4)",
    "&.Mui-focused": {
      color: "#6366f1",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#fff",
    padding: "16px",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.3)",
    },
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "rgba(255, 255, 255, 0.35)",
    fontSize: "20px",
  },
}));

const SubmitBtn = styled(Button)(() => ({
  borderRadius: "14px",
  padding: "14px 28px",
  fontSize: "0.95rem",
  fontWeight: 600,
  textTransform: "none",
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  color: "#fff",
  boxShadow: "0 10px 30px -8px rgba(99, 102, 241, 0.5)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 15px 35px -8px rgba(99, 102, 241, 0.6)",
    background: "linear-gradient(135deg, #7c7ff2 0%, #9d6ef7 100%)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

const GoogleButtonWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: "24px",
  "& > div": {
    width: "100% !important",
  },
  "& iframe": {
    borderRadius: "14px !important",
  },
}));

const StyledDivider = styled(Divider)(() => ({
  margin: "24px 0",
  "&::before, &::after": {
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  "& .MuiDivider-wrapper": {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: "0.8rem",
    letterSpacing: "0.5px",
  },
}));

const FeatureCard = styled(Box)(() => ({
  display: "flex",
  alignItems: "flex-start",
  gap: "18px",
  padding: "22px",
  borderRadius: "18px",
  background: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  marginBottom: "16px",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "default",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.04)",
    transform: "translateX(8px)",
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
}));

const FeatureIconBox = styled(Box)(({ gradient }) => ({
  width: "50px",
  height: "50px",
  borderRadius: "14px",
  background: gradient,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}));

const SwitchButton = styled(Button)(() => ({
  color: "#8b5cf6",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
  padding: "4px 8px",
  "&:hover": {
    backgroundColor: "rgba(139, 92, 246, 0.08)",
  },
}));

// ============ INITIAL STATE ============
const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// ============ MAIN COMPONENT ============
function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      dispatch(signup(formData, navigate));
    } else {
      dispatch(signin(formData, navigate));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setShowPassword(false);
  };

  const googleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const result = jwtDecode(token);

      dispatch({ type: "AUTH", data: { result, token } });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const googleFailure = () => {
    console.log("Google Login Failed");
  };

  return (
    <AuthWrapper>
      {/* Background Decorations */}
      <BackgroundDecor>
        <GridPattern />
        <FloatingShape top="8%" left="8%" size="140px" delay="0s" color="#6366f1" />
        <FloatingShape top="65%" left="5%" size="100px" delay="2s" color="#8b5cf6" />
        <FloatingShape top="25%" left="22%" size="70px" delay="4s" color="#a855f7" />
        <FloatingShape top="75%" left="85%" size="90px" delay="1s" color="#6366f1" />
        <FloatingShape top="15%" left="75%" size="60px" delay="3s" color="#8b5cf6" />
        <GlowOrb top="-10%" left="60%" color="#6366f1" />
        <GlowOrb top="50%" left="-5%" color="#8b5cf6" />
        <GlowOrb top="70%" left="70%" color="#a855f7" />
      </BackgroundDecor>

      {/* Left Panel - Features */}
      <LeftPanel>
        <Box sx={{ maxWidth: "520px" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: "#fff",
              mb: 1.5,
              lineHeight: 1.15,
              fontSize: { md: "2.8rem", lg: "3.2rem" },
            }}
          >
            Start your
            <Box
              component="span"
              sx={{
                display: "block",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              journey today
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              mb: 6,
              maxWidth: "440px",
            }}
          >
            Connect with a community of creators and innovators. Your next big idea starts here.
          </Typography>

          <Box>
            <FeatureCard>
              <FeatureIconBox gradient="linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%)">
                <SecurityIcon sx={{ color: "#6366f1", fontSize: "24px" }} />
              </FeatureIconBox>
              <Box>
                <Typography sx={{ color: "#fff", fontWeight: 600, mb: 0.5, fontSize: "1rem" }}>
                  Bank-level Security
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Your data is encrypted and protected with industry-leading security protocols
                </Typography>
              </Box>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconBox gradient="linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)">
                <SpeedIcon sx={{ color: "#22c55e", fontSize: "24px" }} />
              </FeatureIconBox>
              <Box>
                <Typography sx={{ color: "#fff", fontWeight: 600, mb: 0.5, fontSize: "1rem" }}>
                  Lightning Fast
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Optimized performance that keeps up with your workflow
                </Typography>
              </Box>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconBox gradient="linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(251, 146, 60, 0.1) 100%)">
                <DevicesIcon sx={{ color: "#fb923c", fontSize: "24px" }} />
              </FeatureIconBox>
              <Box>
                <Typography sx={{ color: "#fff", fontWeight: 600, mb: 0.5, fontSize: "1rem" }}>
                  Access Anywhere
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Seamlessly sync across all your devices automatically
                </Typography>
              </Box>
            </FeatureCard>
          </Box>
        </Box>
      </LeftPanel>

      {/* Right Panel - Auth Form */}
      <RightPanel>
        <Fade in timeout={600}>
          <AuthCard>
            {/* Logo */}
            <LogoBox>
              <LockOutlinedIcon sx={{ color: "#fff", fontSize: "26px" }} />
            </LogoBox>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                fontWeight: 700,
                textAlign: "center",
                mb: 0.5,
              }}
            >
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.45)",
                textAlign: "center",
                mb: 3,
                fontSize: "0.9rem",
              }}
            >
              {isSignUp
                ? "Fill in your details to get started"
                : "Sign in to continue to your account"}
            </Typography>

            {/* Tab Switcher */}
            <TabContainer>
              <TabButton active={!isSignUp} onClick={() => setIsSignUp(false)}>
                Sign In
              </TabButton>
              <TabButton active={isSignUp} onClick={() => setIsSignUp(true)}>
                Sign Up
              </TabButton>
            </TabContainer>

            {/* Google Login */}
            <GoogleButtonWrapper>
              <GoogleLogin
                onSuccess={googleSuccess}
                onError={googleFailure}
                theme="filled_black"
                size="large"
                width="100%"
                text={isSignUp ? "signup_with" : "signin_with"}
              />
            </GoogleButtonWrapper>

            <StyledDivider>OR CONTINUE WITH EMAIL</StyledDivider>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {isSignUp && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Fade in={isSignUp} timeout={400}>
                        <StyledTextField
                          name="firstName"
                          label="First Name"
                          fullWidth
                          onChange={handleChange}
                          autoFocus
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Fade>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Fade in={isSignUp} timeout={400}>
                        <StyledTextField
                          name="lastName"
                          label="Last Name"
                          fullWidth
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Fade>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <StyledTextField
                    name="email"
                    label="Email Address"
                    fullWidth
                    type="email"
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <StyledTextField
                    name="password"
                    label="Password"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleShowPassword}
                            edge="end"
                            sx={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {isSignUp && (
                  <Grid item xs={12}>
                    <Fade in={isSignUp} timeout={400}>
                      <StyledTextField
                        name="confirmPassword"
                        label="Confirm Password"
                        fullWidth
                        type="password"
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Fade>
                  </Grid>
                )}
              </Grid>

              <SubmitBtn
                type="submit"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </SubmitBtn>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  component="span"
                  sx={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.9rem" }}
                >
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                </Typography>
                <SwitchButton onClick={switchMode}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </SwitchButton>
              </Box>
            </Box>
          </AuthCard>
        </Fade>
      </RightPanel>
    </AuthWrapper>
  );
}

export default Auth;