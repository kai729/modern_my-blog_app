import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCreatePost } from "../hooks/usePosts";
import { Box, TextField, Typography, Snackbar, Alert, CircularProgress, Button } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./PostDetail.module.css";

const MotionButton = motion(Button);

const PostNew = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("タイトルと本文は必須です。");
      return;
    }

    try {
      const newPost = await mutateAsync({ title, body: content });
      setOpen(true);
      setTimeout(() => navigate(`/posts/${newPost.id}`), 1500);
    } catch (err) {
      console.error(err);
      setError("投稿エラーが発生しました。");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        新規投稿
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField label="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
        <TextField
          label="本文"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={8}
          required
          fullWidth
        />

        <MotionButton
          variant="contained"
          color="primary"
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isPending}
        >
          {isPending ? "投稿中..." : "投稿"}
        </MotionButton>
        <Link to="/" className={styles.backLink}>
          ← 戻る
        </Link>
      </Box>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: "100%" }}>
          投稿が完了しました！
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default PostNew;
