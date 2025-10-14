import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Avatar, Button, Toolbar, Typography } from "@mui/material";
import memories from "../../Images/memories.jpeg";
import {
  AppBarStyled,
  Heading,
  Image,
  BrandContainer,
  Profile,
  PurpleAvatar,
} from "./style";

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/"); // ✅ replaced history.push("/")
    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;
    // optional: you can verify token expiry here if needed

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <AppBarStyled position="static" color="inherit">
      <BrandContainer>
        <Heading component={Link} to="/" variant="h2" align="center">
          Memories
        </Heading>
        <Image src={memories} alt="memories" height={60} />
      </BrandContainer>

      <Toolbar>
        {user ? (
          <Profile>
            <PurpleAvatar alt={user.result.name} src={user.result.imageUrl}>
              {user.result.name.charAt(0)}
            </PurpleAvatar>
            <Typography variant="h6">{user.result.name}</Typography>
            <Button variant="contained" color="secondary" onClick={logout}>
              Log Out
            </Button>
          </Profile>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBarStyled>
  );
};

export default Navbar;
