// src/pages/PostList.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Stack, Typography, Button, Box, Pagination, CircularProgress } from "@mui/material";
import PostCard from "../components/PostCard";
import { usePosts } from "../hooks/usePosts";
import styles from "./PostList.module.css";

const MotionDiv = motion.div;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PostList() {
  const [page, setPage] = useState(1);
  const limit = 10; // ← 表示数を変更

  const { posts, pagination, isLoading, isError, refetch } = usePosts(page, limit); // ← 正しく構造を受け取る

  if (isLoading) {
    return (
      <Box
        sx={{
          position: "relative",
          minHeight: "400px", // スピナー表示に必要な高さ
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column", // スケルトンとスピナーを縦に並べる
        }}
      >
        {/* スケルトンUI */}
        <Box
          className={styles.skeletonWrapper}
          sx={{ width: "100%", position: "static" }} // ここで干渉を防ぐ
        >
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonBody}></div>
            </div>
          ))}
        </Box>

        {/* スピナー */}
        <CircularProgress sx={{ mt: 4 }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <div className={styles.error}>
        記事の取得に失敗しました。
        <br />
        <button className={styles.retryButton} onClick={refetch}>
          再試行
        </button>
      </div>
    );
  }

  return (
    <MotionDiv
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          component="h2"
          sx={{
            color: "#333",
            fontSize: "1.6em",
            fontWeight: "bold",
            mb: 0,
          }}
        >
          記事一覧
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            component={motion(Link)}
            to="/posts/search"
            variant="outlined"
            aria-label="検索"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔍 検索
          </Button>
          <Button
            component={motion(Link)}
            to="/posts/new"
            variant="contained"
            color="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            新規作成
          </Button>
        </Stack>
      </Stack>

      <MotionDiv
        className={styles.card_content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={posts.length}
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={itemVariants} className={styles.cardItem}>
            <PostCard post={post} />
          </motion.div>
        ))}
      </MotionDiv>
      <Typography variant="body2" color="text.secondary" align="right" mb={2}>
        {(page - 1) * limit + 1}〜{Math.min(page * limit, pagination.totalItems)}件を表示中（全
        {pagination.totalItems}
        件）
      </Typography>
      {pagination.totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </MotionDiv>
  );
}
