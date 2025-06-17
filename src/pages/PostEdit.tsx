import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "../api/posts";
import { useUpdatePost } from "../hooks/usePosts";
import { TextField, Button, Box, Snackbar, Alert, Typography, CircularProgress } from "@mui/material";

const MotionButton = motion(Button);

const PostEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  const { mutateAsync, isPending, error: submitError } = useUpdatePost(id!);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    try {
      await mutateAsync({ title, body });
      setOpen(true);
      setTimeout(() => navigate(`/posts/${id}`), 1500);
    } catch {
      // エラーは submitError に出る
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !post) {
    return (
      <Box sx={{ color: "error.main", textAlign: "center", py: 4 }}>
        <Typography>{error instanceof Error ? error.message : "記事の読み込みに失敗しました。"}</Typography>
      </Box>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        記事を編集
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError instanceof Error ? submitError.message : "保存に失敗しました。"}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <TextField
          id="title-input"
          name="title"
          label="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <TextField
          id="body-input"
          name="body"
          label="本文"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          multiline
          rows={8}
          required
          fullWidth
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <MotionButton
            variant="contained"
            color="primary"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isPending}
          >
            {isPending ? "保存中..." : "保存"}
          </MotionButton>

          <MotionButton
            variant="outlined"
            color="inherit"
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            キャンセル
          </MotionButton>
        </Box>
      </Box>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: "100%" }}>
          編集が完了しました！
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default PostEdit;
