import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  AppBar,
  Avatar,
  Button,
  Typography,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Fade
} from "@mui/material";
import { styled, keyframes, alpha } from "@mui/material/styles";

// Icons
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import CameraIcon from "@mui/icons-material/Camera";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";

// ============ ANIMATIONS ============
const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ============ STYLED COMPONENTS ============
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "rgba(10, 10, 18, 0.95)", // Deep dark glass
  backdropFilter: "blur(20px)",
  boxShadow: "none",
  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  position: "sticky",
  top: 0,
  zIndex: 100,
  width: "100%",
  left: 0,
  right: 0,
}));

const GlowLine = styled(Box)(() => ({
  height: "2px",
  width: "100%",
  background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)",
  backgroundSize: "200% 200%",
  animation: `${gradientFlow} 4s linear infinite`,
}));

const NavContent = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  padding: "12px 24px",
  [theme.breakpoints.up("lg")]: {
    padding: "15px 40px",
  },
}));

// --- LOGO STYLES ---
const LogoLink = styled(Link)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  textDecoration: "none",
}));

const LogoIconWrapper = styled(Box)(() => ({
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "rotate(-5deg) scale(1.05)",
    boxShadow: "0 0 25px rgba(99, 102, 241, 0.6)",
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "1.6rem",
  color: "#fff",
  letterSpacing: "-0.5px",
  display: "flex",
  flexDirection: "column",
  lineHeight: 1,
  "& span": {
    fontSize: "0.7rem",
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginTop: "2px",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

// --- SEARCH BAR ---
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "12px",
  backgroundColor: alpha(theme.palette.common.white, 0.04),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.08),
  },
  margin: "0 20px",
  width: "100%",
  maxWidth: "500px",
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
  border: "1px solid rgba(255, 255, 255, 0.05)",
  transition: "all 0.3s ease",
  "&:focus-within": {
    borderColor: "#6366f1",
    backgroundColor: alpha(theme.palette.common.white, 0.08),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255, 255, 255, 0.4)",
  zIndex: 1,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#fff",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.3)",
    },
  },
}));

// --- PROFILE SECTION ---
const ProfileSection = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
}));

const UserChip = styled(Button)(() => ({
  padding: "4px 12px 4px 4px",
  borderRadius: "50px",
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  color: "#fff",
  textTransform: "none",
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  "& .MuiAvatar-root": {
    width: "34px",
    height: "34px",
    marginRight: "10px",
    background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    fontSize: "0.95rem",
    fontWeight: 700,
    border: "2px solid rgba(20, 20, 35, 0.5)",
  },
}));

const ActionButton = styled(Button)(({ variant }) => ({
  borderRadius: "10px",
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
  boxShadow: "none",
  ...(variant === "login" && {
    background: "#fff",
    color: "#000",
    "&:hover": {
      background: "#f0f0f0",
      transform: "translateY(-1px)",
    },
  }),
}));

// ============ MAIN COMPONENT ============
const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const logout = () => {
    handleCloseMenu();
    dispatch({ type: "LOGOUT" });
    navigate("/");
    setUser(null);
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleProfileClick = () => {
    handleCloseMenu();
    navigate("/profile");
  };

  return (
    <StyledAppBar position="static">
      <NavContent>
        {/* 1. BRANDING (Left) */}
        <LogoLink to="/">
          <LogoIconWrapper>
            <CameraIcon sx={{ color: "#fff", fontSize: "24px" }} />
          </LogoIconWrapper>
          <LogoText>
            Memories
            <span>Capture Life</span>
          </LogoText>
        </LogoLink>

        {/* 2. SEARCH BAR (Center) */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search memories..."
            inputProps={{ "aria-label": "search" }}
          />
        </Search>

        {/* 3. USER ACTIONS (Right) */}
        <ProfileSection>
          {user ? (
            <>
              {/* Notification Bell (Visual Only) */}
              <IconButton sx={{ color: "rgba(255,255,255,0.6)", display: { xs: 'none', md: 'flex' } }}>
                <NotificationsIcon />
              </IconButton>

              {/* User Chip */}
              <UserChip onClick={handleMenu}>
                <Avatar alt={user.result.name} src={user.result.imageUrl}>
                  {user.result.name.charAt(0)}
                </Avatar>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {user.result.name}
                  </Typography>
                </Box>
                <KeyboardArrowDownIcon sx={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", ml: 1 }} />
              </UserChip>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                TransitionComponent={Fade}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    bgcolor: "#1a1a2e",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    minWidth: "180px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    "& .MuiMenuItem-root": {
                      fontSize: "0.9rem",
                      py: 1.5,
                      gap: 1.5,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                    },
                  },
                }}
              >
                {/* ✅ REMOVED 'Saved Memories', KEPT 'My Profile' */}
                <MenuItem onClick={handleProfileClick}>
                  <PersonIcon sx={{ fontSize: "20px", color: "#a5b4fc" }} />
                  My Profile
                </MenuItem>
                
                <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.1)", my: 1 }} />
                
                <MenuItem onClick={logout} sx={{ color: "#ff4757 !important" }}>
                  <LogoutIcon sx={{ fontSize: "20px" }} />
                  Log Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <ActionButton
              component={Link}
              to="/auth"
              variant="login"
              startIcon={<LoginIcon />}
            >
              Sign In
            </ActionButton>
          )}
        </ProfileSection>
      </NavContent>

      {/* Animated Bottom Line */}
      <GlowLine />
    </StyledAppBar>
  );
};

export default Navbar;