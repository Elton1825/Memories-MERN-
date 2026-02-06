import React from "react";
import Post from "./Post/Post";
import { Grid, CircularProgress, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { styled, keyframes } from "@mui/material/styles";

// ============ ANIMATIONS ============
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============ STYLED COMPONENTS ============
const LoaderWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "300px",
  width: "100%",
  background: "rgba(255, 255, 255, 0.02)",
  borderRadius: "20px",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
}));

const StyledSpinner = styled(CircularProgress)(() => ({
  color: "#6366f1",
  filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))",
  marginBottom: "20px",
}));

// ✅ Using Box instead of styled Grid to avoid prop issues
const AnimatedBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "index",
})(({ index }) => ({
  animation: `${fadeInUp} 0.6s ease-out forwards`,
  animationDelay: `${index * 0.08}s`,
  opacity: 0,
}));

function Posts({ setCurrentId }) {
  const posts = useSelector((state) => state.posts);

  if (!posts || !posts.length) {
    return (
      <LoaderWrapper>
        <StyledSpinner size="3rem" thickness={4} />
        <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.6)" }}>
          Loading Memories...
        </Typography>
      </LoaderWrapper>
    );
  }

  return (
    <Grid 
      container 
      spacing={3}
      alignItems="stretch"
    >
      {posts.map((post, index) => (
        // ✅ NEW MUI v6 GRID SYNTAX - Use 'size' prop
        <Grid 
          key={post._id}
          size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}
        >
          <AnimatedBox index={index}>
            <Post post={post} setCurrentId={setCurrentId} />
          </AnimatedBox>
        </Grid>
      ))}
    </Grid>
  );
}

export default Posts;