import React, { useState, useEffect } from "react";
import { Grow, Box } from "@mui/material";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import { useDispatch } from "react-redux";
import { getPosts } from "../../actions/posts";
import { styled, keyframes } from "@mui/material/styles";

// ============ ANIMATIONS ============
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
`;

// ============ STYLED COMPONENTS ============
const HomeWrapper = styled(Box)(() => ({
  width: "100%",
  minHeight: "100vh",
  position: "relative",
  background: "#0a0a0f",
  paddingBottom: "60px",
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
  borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
  background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
  border: `1px solid ${color}10`,
  animation: `${float} 10s ease-in-out infinite`,
  animationDelay: delay,
}));

const GlowOrb = styled(Box)(({ top, right, color }) => ({
  position: "absolute",
  top: top,
  right: right,
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
  filter: "blur(60px)",
  animation: `${pulse} 8s ease-in-out infinite`,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  padding: "30px",
  width: "100%",
  boxSizing: "border-box",
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

const MainLayout = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: "30px",
  alignItems: "flex-start",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column-reverse",
  },
}));

// ✅ Posts takes ALL remaining space (flex: 1)
const PostsSection = styled(Box)(({ theme }) => ({
  flex: 1, // Takes all available width
  minWidth: 0, // Prevents flex item from overflowing
}));

// ✅ Form has fixed width
const FormSection = styled(Box)(({ theme }) => ({
  width: "380px",
  flexShrink: 0, // Prevents shrinking
  position: "sticky",
  top: "100px",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    position: "relative",
    top: 0,
  },
}));

function Home() {
  const dispatch = useDispatch();
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    dispatch(getPosts());
  }, [currentId, dispatch]);

  return (
    <HomeWrapper>
      {/* Background Elements */}
      <BackgroundDecor>
        <FloatingShape top="10%" left="5%" size="150px" delay="0s" color="#6366f1" />
        <FloatingShape top="40%" left="80%" size="100px" delay="2s" color="#ec4899" />
        <FloatingShape top="70%" left="10%" size="120px" delay="4s" color="#8b5cf6" />
        <GlowOrb top="20%" right="20%" color="#6366f1" />
        <GlowOrb top="60%" right="80%" color="#ec4899" />
      </BackgroundDecor>

      <Grow in>
        <ContentWrapper>
          <MainLayout>
            {/* ✅ Posts Section - Takes full remaining width */}
            <PostsSection>
              <Posts setCurrentId={setCurrentId} />
            </PostsSection>

            {/* ✅ Form Section - Fixed width on right */}
            <FormSection>
              <Form currentId={currentId} setCurrentId={setCurrentId} />
            </FormSection>
          </MainLayout>
        </ContentWrapper>
      </Grow>
    </HomeWrapper>
  );
}

export default Home;