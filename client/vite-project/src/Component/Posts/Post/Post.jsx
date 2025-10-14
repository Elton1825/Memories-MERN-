import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import moment from "moment";
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../actions/posts";

function Post({ post, setCurrentId }) {
  const dispatch = useDispatch();

  if (!post || typeof post !== "object") return null;

  const user = JSON.parse(localStorage.getItem("profile"));

  // Safe data extraction with fallback values
  const title = typeof post.title === "string" ? post.title : "Untitled";
  const message = typeof post.message === "string" ? post.message : "";
  const name = typeof post.name === "string" ? post.name : "Unknown";
  const tags = Array.isArray(post.tags) ? post.tags.map((tag) => `#${tag} `).join("") : "";
  const image = typeof post.selectedFile === "string" && post.selectedFile !== "" 
    ? post.selectedFile 
    : "https://via.placeholder.com/400x200?text=No+Image";
  const createdAt = post.createdAt ? moment(post.createdAt).fromNow() : "";

  const Likes = () => {
    if (post.likes && post.likes.length > 0) {
      return post.likes.find(
        (like) => like === (user?.result?.googleId || user?.result?._id)
      ) ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {post.likes.length > 2
            ? `You and ${post.likes.length - 1} others`
            : `${post.likes.length} like${post.likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlinedIcon fontSize="small" />
          &nbsp;{post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlinedIcon fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  return (
    <Card sx={{ marginBottom: 2, position: "relative" }}>
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ objectFit: "cover" }}
      />
      <div style={{ position: "absolute", top: 10, left: 10, color: "white" }}>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2">{createdAt}</Typography>
      </div>
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <Button
          style={{ color: "white" }}
          size="small"
          onClick={() => setCurrentId(post._id)}
        >
          <MoreHorizIcon fontSize="default" />
        </Button>
      </div>
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {tags}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          disabled={!user?.result}
          onClick={() => dispatch(likePost(post._id))}
        >
          <Likes />
        </Button>
        {(user?.result?.googleId===post?.name || user?.result?._id===post?.name)&&(
              <Button
          size="small"
          color="primary"
          onClick={() => dispatch(deletePost(post._id))}
        >
          <DeleteIcon fontSize="small" /> Delete
        </Button>
        )}
        
      </CardActions>
    </Card>
  );
}

export default Post;
