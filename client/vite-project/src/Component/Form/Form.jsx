import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  IconButton,
  Chip,
  LinearProgress,
  Fade,
  Grow,
} from "@mui/material";
import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatedPost } from "../../actions/posts";
import { styled, keyframes } from "@mui/material/styles";

// Icons
import TitleIcon from "@mui/icons-material/Title";
import MessageIcon from "@mui/icons-material/Message";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

// ============ ANIMATIONS ============
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

// ============ STYLED COMPONENTS ============

const FormCard = styled(Paper)(({ theme }) => ({
  padding: "28px",
  borderRadius: "24px",
  background: "linear-gradient(145deg, rgba(20, 20, 35, 0.95) 0%, rgba(15, 15, 25, 0.98) 100%)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  boxShadow: "0 20px 50px -15px rgba(0, 0, 0, 0.4)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #6366f1)",
    backgroundSize: "200% 100%",
    animation: `${shimmer} 3s linear infinite`,
  },
}));

const SignInCard = styled(Paper)(({ theme }) => ({
  padding: "40px 28px",
  borderRadius: "24px",
  background: "linear-gradient(145deg, rgba(20, 20, 35, 0.95) 0%, rgba(15, 15, 25, 0.98) 100%)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  boxShadow: "0 20px 50px -15px rgba(0, 0, 0, 0.4)",
  textAlign: "center",
}));

const HeaderBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  marginBottom: "24px",
}));

// ✅ Fixed: Added shouldForwardProp to filtering 'editing'
const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "editing",
})(({ editing }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background: editing
    ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: editing
    ? "0 8px 25px -5px rgba(245, 158, 11, 0.4)"
    : "0 8px 25px -5px rgba(99, 102, 241, 0.4)",
  animation: `${float} 4s ease-in-out infinite`,
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.08)",
      transition: "all 0.3s ease",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.15)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6366f1",
      borderWidth: "2px",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(99, 102, 241, 0.04)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.4)",
    "&.Mui-focused": {
      color: "#6366f1",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#fff",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.3)",
    },
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "rgba(255, 255, 255, 0.35)",
    fontSize: "20px",
  },
}));

// ✅ Fixed: Added shouldForwardProp to filter 'hasFile'
const FileUploadBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "hasFile",
})(({ hasFile }) => ({
  border: `2px dashed ${hasFile ? "#22c55e" : "rgba(255, 255, 255, 0.1)"}`,
  borderRadius: "16px",
  padding: "24px",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  background: hasFile
    ? "rgba(34, 197, 94, 0.05)"
    : "rgba(255, 255, 255, 0.01)",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    borderColor: hasFile ? "#22c55e" : "rgba(99, 102, 241, 0.4)",
    background: hasFile
      ? "rgba(34, 197, 94, 0.08)"
      : "rgba(99, 102, 241, 0.05)",
  },
}));

const ImagePreview = styled(Box)(() => ({
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
  marginTop: "16px",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)",
    pointerEvents: "none",
  },
}));

const DeleteImageButton = styled(IconButton)(() => ({
  position: "absolute",
  top: "8px",
  right: "8px",
  backgroundColor: "rgba(239, 68, 68, 0.9)",
  color: "#fff",
  zIndex: 10,
  "&:hover": {
    backgroundColor: "#ef4444",
    transform: "scale(1.1)",
  },
}));

// ✅ Fixed: Added shouldForwardProp to filter 'editing'
const SubmitButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "editing",
})(({ editing }) => ({
  borderRadius: "14px",
  padding: "14px 28px",
  fontSize: "0.95rem",
  fontWeight: 600,
  textTransform: "none",
  background: editing
    ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  color: "#fff",
  boxShadow: editing
    ? "0 10px 30px -8px rgba(245, 158, 11, 0.5)"
    : "0 10px 30px -8px rgba(99, 102, 241, 0.5)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: editing
      ? "0 15px 35px -8px rgba(245, 158, 11, 0.6)"
      : "0 15px 35px -8px rgba(99, 102, 241, 0.6)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:disabled": {
    background: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.3)",
  },
}));

const ClearButton = styled(Button)(() => ({
  borderRadius: "14px",
  padding: "12px 24px",
  fontSize: "0.9rem",
  fontWeight: 500,
  textTransform: "none",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  color: "rgba(255, 255, 255, 0.6)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    color: "#ef4444",
  },
}));

const TagChip = styled(Chip)(() => ({
  margin: "4px",
  backgroundColor: "rgba(99, 102, 241, 0.15)",
  border: "1px solid rgba(99, 102, 241, 0.3)",
  color: "#a5b4fc",
  fontWeight: 500,
  "& .MuiChip-deleteIcon": {
    color: "rgba(165, 180, 252, 0.6)",
    "&:hover": {
      color: "#ef4444",
    },
  },
}));

const TagsPreview = styled(Box)(() => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "4px",
  marginTop: "12px",
  padding: "12px",
  borderRadius: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
}));

const LockIconWrapper = styled(Box)(() => ({
  width: "70px",
  height: "70px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
  border: "1px solid rgba(99, 102, 241, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px",
}));

// ✅ Fixed: Added shouldForwardProp to filter 'isNearLimit'
const CharacterCount = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isNearLimit",
})(({ isNearLimit }) => ({
  fontSize: "0.75rem",
  color: isNearLimit ? "#f59e0b" : "rgba(255, 255, 255, 0.3)",
  textAlign: "right",
  marginTop: "4px",
}));

// ============ MAIN COMPONENT ============
function Form({ currentId, setCurrentId }) {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: [],
    selectedFile: "",
  });

  const user = JSON.parse(localStorage.getItem("profile"));

  const post = useSelector((state) =>
    currentId ? state.posts.find((p) => p._id === currentId) : null
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!postData.title || !postData.message) {
      alert("Title and message are required!");
      return;
    }

    const newPostData = {
      ...postData,
      name: user?.result?.name,
      tags: postData.tags || [],
      selectedFile: postData.selectedFile || "",
    };

    delete newPostData._id;

    if (currentId) {
      dispatch(updatedPost(currentId, newPostData));
    } else {
      dispatch(createPost(newPostData));
    }

    clear();
  };

  const clear = () => {
    setCurrentId(null);
    setPostData({
      title: "",
      message: "",
      tags: [],
      selectedFile: "",
    });
  };

  const removeImage = () => {
    setPostData({ ...postData, selectedFile: "" });
  };

  const removeTag = (tagToRemove) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Calculate form completion percentage
  const calculateProgress = () => {
    let progress = 0;
    if (postData.title) progress += 30;
    if (postData.message) progress += 30;
    if (postData.tags.length > 0) progress += 20;
    if (postData.selectedFile) progress += 20;
    return progress;
  };

  // 🔒 If user not signed in — show message
  if (!user?.result?.name) {
    return (
      <Grow in timeout={500}>
        <SignInCard elevation={0}>
          <LockIconWrapper>
            <LockIcon sx={{ color: "#6366f1", fontSize: "32px" }} />
          </LockIconWrapper>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 600,
              mb: 1,
            }}
          >
            Sign In Required
          </Typography>
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            Please sign in to create your own memories and interact with others.
          </Typography>
        </SignInCard>
      </Grow>
    );
  }

  return (
    <Grow in timeout={500}>
      <FormCard elevation={0}>
        {/* Header */}
        <HeaderBox>
          <IconWrapper editing={currentId ? 1 : 0}>
            {currentId ? (
              <EditIcon sx={{ color: "#fff", fontSize: "24px" }} />
            ) : (
              <AutoAwesomeIcon sx={{ color: "#fff", fontSize: "24px" }} />
            )}
          </IconWrapper>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {currentId ? "Edit Memory" : "Create Memory"}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.45)",
                fontSize: "0.85rem",
              }}
            >
              {currentId ? "Update your memory details" : "Share a moment with the world"}
            </Typography>
          </Box>
        </HeaderBox>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
              Completion
            </Typography>
            <Typography sx={{ color: "#6366f1", fontSize: "0.75rem", fontWeight: 600 }}>
              {calculateProgress()}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{
              height: "6px",
              borderRadius: "3px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              "& .MuiLinearProgress-bar": {
                borderRadius: "3px",
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              },
            }}
          />
        </Box>

        {/* Form */}
        <Box
          component="form"
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          {/* Title Field */}
          <Box>
            <StyledTextField
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
              value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              placeholder="Give your memory a title..."
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <TitleIcon sx={{ color: "rgba(255,255,255,0.35)", fontSize: "20px" }} />
                  </Box>
                ),
              }}
              inputProps={{ maxLength: 100 }}
            />
            <CharacterCount isNearLimit={postData.title.length > 80}>
              {postData.title.length}/100
            </CharacterCount>
          </Box>

          {/* Message Field */}
          <Box>
            <StyledTextField
              name="message"
              label="Message"
              variant="outlined"
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              value={postData.message}
              onChange={(e) => setPostData({ ...postData, message: e.target.value })}
              placeholder="Tell the story behind this memory..."
              InputProps={{
                startAdornment: (
                  <Box
                    sx={{
                      mr: 1,
                      display: "flex",
                      alignItems: "flex-start",
                      mt: 1.5,
                    }}
                  >
                    <MessageIcon sx={{ color: "rgba(255,255,255,0.35)", fontSize: "20px" }} />
                  </Box>
                ),
              }}
              inputProps={{ maxLength: 500 }}
            />
            <CharacterCount isNearLimit={postData.message.length > 400}>
              {postData.message.length}/500
            </CharacterCount>
          </Box>

          {/* Tags Field */}
          <Box>
            <StyledTextField
              name="tags"
              label="Tags"
              variant="outlined"
              fullWidth
              value={postData.tags.join(", ")}
              onChange={(e) =>
                setPostData({
                  ...postData,
                  tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean),
                })
              }
              placeholder="travel, nature, adventure..."
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <LocalOfferIcon sx={{ color: "rgba(255,255,255,0.35)", fontSize: "20px" }} />
                  </Box>
                ),
              }}
            />
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.3)",
                fontSize: "0.75rem",
                mt: 0.5,
              }}
            >
              Separate tags with commas
            </Typography>

            {/* Tags Preview */}
            {postData.tags.length > 0 && postData.tags[0] !== "" && (
              <Fade in>
                <TagsPreview>
                  {postData.tags
                    .filter((tag) => tag.trim())
                    .map((tag, index) => (
                      <TagChip
                        key={index}
                        label={`#${tag.trim()}`}
                        size="small"
                        onDelete={() => removeTag(tag)}
                      />
                    ))}
                </TagsPreview>
              </Fade>
            )}
          </Box>

          {/* File Upload */}
          <FileUploadBox hasFile={!!postData.selectedFile}>
            {!postData.selectedFile ? (
              <>
                <CloudUploadIcon
                  sx={{
                    fontSize: "48px",
                    color: "rgba(255, 255, 255, 0.2)",
                    mb: 1,
                  }}
                />
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Upload an image
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.3)",
                    fontSize: "0.8rem",
                  }}
                >
                  Click or drag to upload your memory
                </Typography>
              </>
            ) : (
              <>
                <AddPhotoAlternateIcon
                  sx={{
                    fontSize: "32px",
                    color: "#22c55e",
                    mb: 1,
                  }}
                />
                <Typography
                  sx={{
                    color: "#22c55e",
                    fontWeight: 500,
                  }}
                >
                  Image uploaded successfully!
                </Typography>
              </>
            )}

            {/* Hidden FileBase */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
                "& input": {
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                },
              }}
            >
              <FileBase
                type="file"
                multiple={false}
                onDone={({ base64 }) =>
                  setPostData({ ...postData, selectedFile: base64 })
                }
              />
            </Box>
          </FileUploadBox>

          {/* Image Preview */}
          {postData.selectedFile && (
            <Fade in>
              <ImagePreview>
                <DeleteImageButton size="small" onClick={removeImage}>
                  <DeleteIcon sx={{ fontSize: "18px" }} />
                </DeleteImageButton>
                <img
                  src={postData.selectedFile}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    display: "block",
                  }}
                />
              </ImagePreview>
            </Fade>
          )}

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <ClearButton
              onClick={clear}
              fullWidth
              startIcon={<ClearAllIcon />}
            >
              Clear
            </ClearButton>
            <SubmitButton
              type="submit"
              fullWidth
              editing={currentId ? 1 : 0}
              endIcon={currentId ? <EditIcon /> : <SendIcon />}
              disabled={!postData.title || !postData.message}
            >
              {currentId ? "Update" : "Create"}
            </SubmitButton>
          </Box>
        </Box>
      </FormCard>
    </Grow>
  );
}

export default Form;