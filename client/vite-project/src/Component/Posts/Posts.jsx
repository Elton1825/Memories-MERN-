import React from "react";
import Post from "./Post/Post";
import { Grid, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

function Posts({ setCurrentId }) {
  const posts = useSelector((state) => state.posts);

  if (!posts) return <CircularProgress />;

  return !posts.length ? (
    <CircularProgress />
  ) : (
    <Grid
      container
      alignItems="stretch"
      spacing={3}
      sx={{ marginTop: 2 }}
    >
      {posts.map((post) => (
        <Grid key={post._id} item xs={12} sm={6}>
          <Post post={post} setCurrentId={setCurrentId} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Posts;
