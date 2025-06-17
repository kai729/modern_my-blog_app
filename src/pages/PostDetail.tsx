import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "../api/posts";
import { useDeletePost } from "../hooks/usePosts";
import { Paper, Typography, Divider, Stack, Snackbar, Alert, Box, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: deletePost, isPending } = useDeletePost();

  const handleDelete = async () => {
    const confirmed = window.confirm("本当に削除してもよろしいですか？");
    if (!confirmed || !post) return;

    try {
      await deletePost(post.id);
      setOpen(true);
      setTimeout(() => navigate("/"), 1500);
    } catch {
      alert("削除に失敗しました");
    }
  };

  if (isLoading) {
    return <Typography>読み込み中...</Typography>;
  }

  if (isError || !post) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">
          {error instanceof Error ? error.message : "記事の読み込みに失敗しました。"}
        </Typography>
        <Button variant="outlined" onClick={() => refetch()} sx={{ mt: 2 }}>
          再試行
        </Button>
      </Box>
    );
  }

  return (
    <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          {post.title}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 4 }}>
          {post.body}
        </Typography>

        <Stack direction="row" spacing={2}>
          <MotionButton
            data-testid="edit-button"
            variant="contained"
            color="info"
            startIcon={<Edit />}
            component={Link}
            to={`/posts/${post.id}/edit`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            編集する
          </MotionButton>

          <MotionButton
            data-testid="delete-button"
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
            disabled={isPending}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPending ? "削除中..." : "削除する"}
          </MotionButton>
        </Stack>

        <Box mt={4}>
          <Button component={Link} to="/" color="inherit">
            ← 戻る
          </Button>
        </Box>
      </Paper>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: "100%" }}>
          削除が完了しました！
        </Alert>
      </Snackbar>
    </MotionBox>
  );
};

export default PostDetail;
