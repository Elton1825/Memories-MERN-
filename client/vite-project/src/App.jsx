import React from "react";
import { Box } from "@mui/material"; // Use Box instead of Container
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar/Navbar";
import Home from "./Component/Home/Home";
import Auth from "./Component/Auth/Auth";
import UserProfile from "./Component/UserProfile/UserProfile";

const App = () => {
  return (
    <BrowserRouter>
      {/* Box ensures full width without margins */}
      <Box sx={{ width: "100%", overflowX: "hidden" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
           <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default App;