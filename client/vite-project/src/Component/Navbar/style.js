import { styled } from "@mui/material/styles";
import { AppBar, Avatar, Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";

export const AppBarStyled = styled(AppBar)(({ theme }) => ({
  borderRadius: 15,
  margin: "30px 0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 50px",
}));

export const Heading = styled(Typography)(({ theme }) => ({
  color: "rgba(0,183,255, 1)",
  textDecoration: "none",
}));

export const Image = styled("img")(({ theme }) => ({
  marginLeft: "15px",
}));

export const BrandContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

export const Profile = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "400px",
  alignItems: "center",
}));

export const PurpleAvatar = styled(Avatar)(({ theme }) => ({
  color: theme.palette.getContrastText(deepPurple[500]),
  backgroundColor: deepPurple[500],
}));
