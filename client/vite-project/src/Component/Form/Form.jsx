import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatedPost } from "../../actions/posts";

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

    delete newPostData._id; // ensure no conflict during update

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

  // 🔒 If user not signed in — show message
  if (!user?.result?.name) {
    return (
      <Paper elevation={6} sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h6">
          Please sign in to create or like Memories.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={6} sx={{ padding: 2 }}>
      <Box
        component="form"
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h6" textAlign="center">
          {currentId ? "Editing" : "Creating"} a Memory
        </Typography>

        <TextField
          name="title"
          label="Title"
          variant="outlined"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />

        <TextField
          name="message"
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          value={postData.message}
          onChange={(e) => setPostData({ ...postData, message: e.target.value })}
        />

        <TextField
          name="tags"
          label="Tags (comma separated)"
          variant="outlined"
          fullWidth
          value={postData.tags.join(", ")}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        />

        <Box>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </Box>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </Box>
    </Paper>
  );
}

export default Form;
