import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import moment from "moment";
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../actions/posts";
import { styled } from "@mui/material/styles";

// ============ STYLED COMPONENTS ============

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "16px",
  height: "100%",
  width: "100%",
  position: "relative",
  background: "rgba(20, 20, 35, 0.9)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 40px rgba(99, 102, 241, 0.2)",
    borderColor: "rgba(99, 102, 241, 0.3)",
    "& .media-zoom": {
      transform: "scale(1.05)",
    },
    "& .edit-btn": {
      opacity: 1,
    },
  },
}));

const MediaWrapper = styled(Box)(() => ({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  aspectRatio: "16 / 10",
  backgroundColor: "rgba(0,0,0,0.3)",
}));

const StyledMedia = styled("img")(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  transition: "transform 0.5s ease",
  display: "block",
}));

const Overlay = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background:
    "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)",
  pointerEvents: "none",
  zIndex: 1,
}));

const HeaderContent = styled(Box)(() => ({
  position: "absolute",
  top: "12px",
  left: "12px",
  color: "white",
  zIndex: 2,
}));

const EditButton = styled(IconButton)(() => ({
  position: "absolute",
  top: "8px",
  right: "8px",
  color: "white",
  zIndex: 2,
  backgroundColor: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(4px)",
  opacity: 0,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(99, 102, 241, 0.6)",
  },
}));

const TagsBox = styled(Box)(() => ({
  padding: "10px 14px 0",
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
}));

const TagChip = styled(Typography)(() => ({
  fontSize: "0.7rem",
  color: "#a5b4fc",
  background: "rgba(99, 102, 241, 0.15)",
  padding: "3px 10px",
  borderRadius: "6px",
  border: "1px solid rgba(99, 102, 241, 0.25)",
  fontWeight: 500,
}));

const StyledContent = styled(CardContent)(() => ({
  padding: "14px",
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: "14px",
  },
}));

const Footer = styled(CardActions)(() => ({
  padding: "10px 14px",
  display: "flex",
  justifyContent: "space-between",
  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
}));

const ActionBtn = styled(Button, {
  shouldForwardProp: (prop) => prop !== "colorType",
})(({ colorType }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.8rem",
  minWidth: "auto",
  padding: "6px 10px",
  borderRadius: "8px",
  color: colorType === "delete" ? "#ef4444" : "#6366f1",
  "&:hover": {
    background:
      colorType === "delete"
        ? "rgba(239, 68, 68, 0.15)"
        : "rgba(99, 102, 241, 0.15)",
  },
  "&:disabled": {
    color: "rgba(255, 255, 255, 0.3)",
  },
}));

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    background: "rgba(20, 20, 35, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    color: "#fff",
    minWidth: "350px",
  },
}));

const DeleteConfirmButton = styled(Button)(() => ({
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  color: "#fff",
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 20px",
  "&:hover": {
    background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
  },
}));

const CancelButton = styled(Button)(() => ({
  color: "rgba(255,255,255,0.6)",
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 500,
  padding: "8px 20px",
  "&:hover": {
    background: "rgba(255,255,255,0.05)",
  },
}));

// ============ MAIN COMPONENT ============

function Post({ post, setCurrentId }) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [openDialog, setOpenDialog] = useState(false);

  if (!post) return null;

  // Safe data extraction
  const title = post.title || "Untitled";
  const message = post.message || "";
  const name = post.name || "Unknown";
  const image = post.selectedFile || "https://via.placeholder.com/400x250?text=No+Image";
  const createdAt = post.createdAt ? moment(post.createdAt).fromNow() : "";
  const tags = post.tags ? post.tags.slice(0, 3) : [];

  // ✅ FIXED: Check Permissions Properly
  const userId = user?.result?.googleId || user?.result?._id;
  
  // Check if user is the creator (multiple ways to match)
  const isCreator = 
    post?.creator === userId ||           // If creator ID matches
    post?.creator === user?.result?.googleId ||  // Google ID match
    post?.creator === user?.result?._id ||       // MongoDB ID match
    post?.name === user?.result?.name;           // Name match (fallback for old posts)

  // ✅ User can delete if they are logged in AND are the creator
  const canDelete = user?.result && isCreator;

  // Handle Delete
  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    dispatch(deletePost(post._id));
    setOpenDialog(false);
  };
  

  const Likes = () => {
    // 1. Get the array correctly
    const likes = post.likeCount || post.likes || [];
    
    // 2. Check if current user has liked it
    // We convert both to string to be safe against type mismatches
    const hasLikedPost = likes.find((like) => String(like) === String(userId));

    if (likes.length > 0) {
      return hasLikedPost ? (
        // ✅ USER HAS LIKED -> FILLED ICON (Solid)
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6366f1' }}>
          <ThumbUpAltIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {likes.length > 2 
              ? `You and ${likes.length - 1} others` 
              : `${likes.length} like${likes.length > 1 ? 's' : ''}` }
          </Typography>
        </Box>
      ) : (
        // ✅ USER HAS NOT LIKED -> OUTLINED ICON (Hollow)
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.7)' }}>
          <ThumbUpAltOutlinedIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
          </Typography>
        </Box>
      );
    }

    // NO LIKES YET -> OUTLINED ICON
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.7)' }}>
        <ThumbUpAltOutlinedIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Like
        </Typography>
      </Box>
    );
  };


  return (
    <>
      <StyledCard elevation={0}>
        {/* Image Section */}
        <MediaWrapper>
          <Overlay />
          <StyledMedia
            className="media-zoom"
            src={image}
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x250?text=Image+Not+Found";
            }}
          />
          
          <HeaderContent>
            <Typography 
              variant="subtitle2" 
              sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: "0.9rem" }}
            >
              {name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ opacity: 0.8, fontSize: "0.7rem" }}
            >
              {createdAt}
            </Typography>
          </HeaderContent>

          {/* ✅ Edit Button - Only for creator */}
          {canDelete && (
            <Tooltip title="Edit" arrow>
              <EditButton
                className="edit-btn"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentId(post._id);
                }}
              >
                <MoreHorizIcon fontSize="small" />
              </EditButton>
            </Tooltip>
          )}
        </MediaWrapper>

        {/* Tags */}
        {tags.length > 0 && (
          <TagsBox>
            {tags.map((tag, index) => (
              <TagChip key={index}>#{tag}</TagChip>
            ))}
          </TagsBox>
        )}

        <StyledContent>
          <Typography
            variant="h6"
            component="h2"
            sx={{ 
              color: "#fff", 
              fontWeight: 700, 
              fontSize: "1rem",
              mb: 0.5,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{ 
              color: "rgba(255,255,255,0.55)", 
              fontSize: "0.85rem",
              lineHeight: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {message}
          </Typography>
        </StyledContent>

        <Footer>
          {/* Like Button */}
          <ActionBtn
          size="small"
          // ✅ Pass a prop to style the button color
          // If the user has liked it, pass 'active={true}'
          sx={{ 
             color: (post.likeCount || []).find((id) => String(id) === String(userId)) 
                    ? '#6366f1' // Active Color (Purple/Blue)
                    : 'rgba(255, 255, 255, 0.7)' // Inactive Color (Gray)
          }}
          disabled={!user?.result}
          onClick={() => dispatch(likePost(post._id))}
        >
          <Likes />
        </ActionBtn>

          {/* ✅ Delete Button - Only for creator */}
          {canDelete && (
            <ActionBtn
              size="small"
              colorType="delete"
              onClick={handleDeleteClick}
            >
              <DeleteIcon sx={{ fontSize: "16px", mr: 0.5 }} />
              Delete
            </ActionBtn>
          )}
        </Footer>
      </StyledCard>

      {/* Delete Confirmation Dialog */}
      <StyledDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
          <WarningAmberIcon sx={{ color: "#ef4444" }} />
          Delete Memory?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255,255,255,0.6)" }}>
            Are you sure you want to delete "<strong style={{ color: "#fff" }}>{title}</strong>"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <CancelButton onClick={handleCloseDialog}>
            Cancel
          </CancelButton>
          <DeleteConfirmButton onClick={handleConfirmDelete}>
            Yes, Delete
          </DeleteConfirmButton>
        </DialogActions>
      </StyledDialog>
    </>
  );
}

export default Post;