import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const PostList = lazy(() => import("./pages/PostList"));
const PostNew = lazy(() => import("./pages/PostNew"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const PostEdit = lazy(() => import("./pages/PostEdit"));
const PostSearchPage = lazy(() => import("./pages/PostSearchPage"));

function App() {
  const location = useLocation(); // ルーティング用の場所を取得

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          My Blog
        </Typography>

        {/* <Box mt={1}>
          <Typography variant="body2" component="div">
            <Link to="/posts/search" style={{ textDecoration: "none", color: "#1976d2", fontWeight: 500 }}>
              🔍 記事を検索
            </Link>
          </Typography>
        </Box> */}
      </Box>

      <Suspense fallback={<CircularProgress color="primary" />}>
        <AnimatePresence mode="wait" initial={true}>
          <Routes location={location} key={location.pathname}>
            {/* 記事一覧（トップページ） */}
            <Route path="/" element={<PostList />} />

            {/* 新規投稿ページ */}
            <Route path="/posts/new" element={<PostNew />} />

            {/* 投稿詳細ページ（旧ルート含む） */}
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/post/:id" element={<PostDetail />} />

            {/* 投稿編集ページ */}
            <Route path="/posts/:id/edit" element={<PostEdit />} />

            <Route path="/posts/search" element={<PostSearchPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <ReactQueryDevtools initialIsOpen={false} />
    </Container>
  );
}

export default App;
