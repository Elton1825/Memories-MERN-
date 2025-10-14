import { styled } from "@mui/material/styles";

export const PaperStyled = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
}));

export const FormRoot = styled("form")(({ theme }) => ({
  width: "100%", // Fix IE 11 issue
  marginTop: theme.spacing(3),
  "& .MuiTextField-root": {
    margin: theme.spacing(1),
  },
}));

export const AvatarStyled = styled("div")(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

export const SubmitButton = styled("button")(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

export const GoogleButtonWrapper = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
