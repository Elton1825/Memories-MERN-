import React, { useEffect } from "react";
import { 
  Box, Typography, Avatar, Grid, Paper, Divider, Button, CircularProgress, Container 
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { styled, keyframes } from "@mui/material/styles";
import { getPosts } from "../../actions/posts";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import Post from "../Posts/Post/Post";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import CameraIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // ✅ Import Arrow Icon

// ============ ANIMATIONS ============
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============ STYLED COMPONENTS ============
const PageWrapper = styled(Box)(() => ({
  width: "100%",
  minHeight: "100vh",
  padding: "30px 0",
  position: "relative",
  background: "#0a0a0f",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    background: "radial-gradient(circle at 50% 0%, #1a1a2e 0%, #0a0a0f 80%)",
    zIndex: 0,
  },
}));

// ✅ NEW: Stylish Back Button
const BackBtn = styled(Button)(() => ({
  color: "rgba(255, 255, 255, 0.6)",
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 600,
  marginBottom: "30px",
  padding: "10px 20px",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
    transform: "translateX(-5px)", // Slight slide left on hover
    color: "#fff",
    borderColor: "rgba(99, 102, 241, 0.5)",
  },
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "24px",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "800px",
  margin: "0 auto 40px auto",
  animation: `${slideUp} 0.6s ease-out`,
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
  },
}));

const BigAvatar = styled(Avatar)(() => ({
  width: "120px",
  height: "120px",
  fontSize: "3rem",
  fontWeight: 700,
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)",
  border: "4px solid rgba(20, 20, 35, 0.8)",
  marginBottom: "20px",
}));

const StatBox = styled(Box)(() => ({
  display: "flex",
  gap: "40px",
  marginTop: "20px",
  textAlign: "center",
}));

const StatNumber = styled(Typography)(() => ({
  fontSize: "1.5rem",
  fontWeight: 800,
  color: "#fff",
}));

const StatLabel = styled(Typography)(() => ({
  fontSize: "0.85rem",
  color: "rgba(255, 255, 255, 0.5)",
  textTransform: "uppercase",
  letterSpacing: "1px",
}));

const SectionTitle = styled(Typography)(() => ({
  color: "#fff",
  fontSize: "1.5rem",
  fontWeight: 700,
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
}));

const PostGrid = styled(Grid)(() => ({
  width: "100%",
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
}));

// ============ MAIN COMPONENT ============
const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Hook to navigate
  
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?.googleId || user?.result?._id;

  const { posts, isLoading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  if (!user) {
    return (
      <PageWrapper sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h5" sx={{ color: "rgba(255,255,255,0.7)" }}>
          Please Sign In to view your profile.
        </Typography>
      </PageWrapper>
    );
  }

  const allPosts = Array.isArray(posts) ? posts : [];
  const myPosts = allPosts.filter((post) => 
    post.creator === userId || post.name === user?.result?.name
  );

  return (
    <PageWrapper>
      <Container maxWidth="xl">
        
        {/* ✅ BACK BUTTON */}
        <BackBtn startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Back to Home
        </BackBtn>

        {/* --- Profile Header Card --- */}
        <ProfileCard elevation={0}>
          <BigAvatar alt={user.result.name} src={user.result.imageUrl}>
            {user.result.name.charAt(0)}
          </BigAvatar>
          
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
            {user.result.name}
          </Typography>
          
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", mt: 1 }}>
            {user.result.email}
          </Typography>

          <StatBox>
            <Box>
              <StatNumber>{myPosts.length}</StatNumber>
              <StatLabel>Memories</StatLabel>
            </Box>
            <Box>
              <StatNumber>0</StatNumber>
              <StatLabel>Followers</StatLabel>
            </Box>
            <Box>
              <StatNumber>0</StatNumber>
              <StatLabel>Following</StatLabel>
            </Box>
          </StatBox>

          {/* <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            sx={{ 
              mt: 4, 
              borderColor: "rgba(99, 102, 241, 0.5)", 
              color: "#a5b4fc",
              borderRadius: "10px",
              textTransform: "none",
              "&:hover": {
                borderColor: "#6366f1",
                background: "rgba(99, 102, 241, 0.1)"
              }
            }}
          >
            Edit Profile
          </Button> */}
        </ProfileCard>

        {/* --- User's Posts Section --- */}
        <Box sx={{ width: "100%" }}>
          <SectionTitle>
            <CameraIcon sx={{ color: "#ec4899" }} />
            My Memories
          </SectionTitle>
          <Divider sx={{ mb: 4, bgcolor: "rgba(255,255,255,0.1)" }} />

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress sx={{ color: "#6366f1" }} />
            </Box>
          ) : myPosts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5, color: "rgba(255,255,255,0.4)" }}>
              <Typography variant="h6">No memories created yet.</Typography>
              <Typography variant="body2">Go ahead and create your first memory!</Typography>
            </Box>
          ) : (
            <PostGrid container spacing={3}>
              {myPosts.map((post) => (
                // Use the new Grid v2 syntax or standard
                <Grid key={post._id} item xs={12} sm={6} md={4} lg={3}>
                  <Post post={post} setCurrentId={() => {}} />
                </Grid>
              ))}
            </PostGrid>
          )}
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default UserProfile;