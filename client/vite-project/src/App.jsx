// import React,{useEffect} from "react";
// import {Container,AppBar,Grid,Grow,Typography} from'@mui/material'
// import { useDispatch } from "react-redux";

// import { getPosts } from './actions/posts';

// import memories from './Images/memories.jpeg'

// import Posts from "./Component/Posts/Posts";
// import Form from "./Component/Form/Form";

// import useStyles from './styles'

// const App=()=>{
//     const classes=useStyles();
//     const dispatch=useDispatch();


//     // useEffect(()=>{
//     //     dispatch(getPosts());
//     // },[dispatch]);

//     return(
//         <Container maxWidth="lg">
//             <AppBar className={classes.appBar} position="static" color="inherit">
//                 <Typography className={classes.heading} variant="h2" align="center">Memories</Typography>
//                 <img className={classes.image} src={memories} alt="memories" height={60}/>
//             </AppBar>

//             <Grow in>
//                 <Container>
//                     <Grid container justify="space between" alignItems={"stretch"} spacing={3}>
//                         <Grid item xs={12} sm={7}>
//                             <Posts />
//                         </Grid>
//                         <Grid item xs={12} sm={4}>
//                             <Form />
//                         </Grid>
//                     </Grid>
//                 </Container>
//             </Grow>
//         </Container>
//     )
// };

// export default App;

import React from "react";
import { Container } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Navbar from "./Component/Navbar/Navbar";
import Home from "./Component/Home/Home";
import Auth from "./Component/Auth/Auth";

const theme = createTheme();

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;


