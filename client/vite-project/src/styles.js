// import { makeStyles } from "@mui/styles";

// export default makeStyles((theme) => ({
//   appBar: {
//     borderRadius: 15,
//     margin: "30px 0",
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   heading: {
//     color: "rgba(0,183,255, 1)",
//   },
//   image: {
//     marginLeft: "15px",
//   },
//   mainContainer: {
//     // ✅ Responsive style nested correctly
//     [theme.breakpoints.down("sm")]: {
//       flexDirection: "column-reverse",
//     },
//   },
// }));

// ❌ remove @mui/styles import
// import { makeStyles } from "@mui/styles";

import { styled } from "@mui/material/styles";

export const AppBarStyled = styled('div')(({ theme }) => ({
  borderRadius: 15,
  margin: "30px 0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column-reverse",
  },
}));

export const Heading = styled('h2')({
  color: "rgba(0,183,255, 1)",
});

export const Image = styled('img')({
  marginLeft: "15px",
});

