import type { Post } from "../types/Post";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const POSTS_URL = `${API_BASE_URL}/posts`;

export type PaginatedPostsResponse = {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

// 🔹 記事一覧取得（fetchで統一）
export const fetchPosts = async (page = 1, limit = 10): Promise<PaginatedPostsResponse> => {
  const res = await fetch(`/api/posts?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error("記事の取得に失敗しました");
  }
  return res.json();
};

// 🔹 単一記事取得
export function fetchPost(id: string): Promise<Post> {
  return fetch(`${POSTS_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  }).then((res) => {
    if (!res.ok) {
      throw new Error("記事の取得に失敗しました");
    }
    return res.json();
  });
}

// 🔹 新規記事作成
export function createPost(title: string, body: string): Promise<Post> {
  return fetch(POSTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
    credentials: "include",
  }).then((res) => {
    if (!res.ok) {
      throw new Error("投稿の作成に失敗しました");
    }
    return res.json();
  });
}

// 🔹 記事更新
export function updatePost(id: string, data: { title: string; body: string }): Promise<Post> {
  return fetch(`${POSTS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  }).then((res) => {
    if (!res.ok) {
      throw new Error("記事の更新に失敗しました");
    }
    return res.json();
  });
}

// 🔹 記事削除
export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${POSTS_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("削除に失敗しました");
  }
}

// import type { Post } from "../types/Post";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const POSTS_URL = `${API_BASE_URL}/posts`;

// // 記事一覧取得
// export function fetchPosts(): Promise<Post[]> {
//   return fetch(POSTS_URL, {
//     method: "GET",
//     credentials: "include",
//   }).then((res) => {
//     if (!res.ok) {
//       throw new Error("記事の取得に失敗しました");
//     }
//     return res.json();
//   });
// }

// // 単一記事取得 ←★ 追加部分
// export function fetchPost(id: number): Promise<Post> {
//   return fetch(`${POSTS_URL}/${id}`, {
//     method: "GET",
//     credentials: "include",
//   }).then((res) => {
//     if (!res.ok) {
//       throw new Error("記事の取得に失敗しました");
//     }
//     return res.json();
//   });
// }

// // 新規記事作成
// export function createPost(title: string, body: string): Promise<Post> {
//   return fetch(POSTS_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ title, body }),
//     credentials: "include",
//   }).then((res) => {
//     if (!res.ok) {
//       throw new Error("投稿の作成に失敗しました");
//     }
//     return res.json();
//   });
// }

// // 記事削除
// export async function deletePost(id: number): Promise<void> {
//   const res = await fetch(`${POSTS_URL}/${id}`, {
//     method: "DELETE",
//     credentials: "include",
//   });
//   if (!res.ok) {
//     throw new Error("削除に失敗しました");
//   }
// }
