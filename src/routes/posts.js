const express = require("express");
const router = express.Router();
const db = require("../db");

// GET 全記事取得（ページネーション対応）
router.get("/", (req, res) => {
  console.time("📥 GET /posts");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) AS total FROM posts`;
  const dataQuery = `
    SELECT * FROM posts
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `;

  db.get(countQuery, [], (err, countResult) => {
    if (err) {
      console.error("DBエラー（count）:", err);
      console.timeEnd("📥 GET /posts");
      return res.status(500).json({ error: "記事数の取得に失敗しました" });
    }

    const totalItems = countResult.total;
    const totalPages = Math.ceil(totalItems / limit);

    db.all(dataQuery, [limit, offset], (err, rows) => {
      console.timeEnd("📥 GET /posts");
      if (err) {
        console.error("DBエラー（data）:", err);
        return res.status(500).json({ error: "記事の取得に失敗しました" });
      }

      res.json({
        posts: rows,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
      });
    });
  });
});

// GET 単一記事取得
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM posts WHERE id = ?`;
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error("DBエラー:", err);
      return res.status(500).json({ error: "記事の取得に失敗しました" });
    }
    if (!row) {
      return res.status(404).json({ error: "記事が見つかりません" });
    }
    res.json(row);
  });
});

// POST 新規記事作成
router.post("/", (req, res) => {
  // console.log("受信したPOST:", req.body);
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "タイトルと本文は必須です" });
  }

  const query = `
  INSERT INTO posts (title, body, createdAt, updatedAt)
  VALUES (?, ?, datetime('now'), datetime('now'))
  `;

  db.run(query, [title, body], function (err) {
    if (err) {
      console.error("DBエラー:", err);
      return res.status(500).json({ error: "投稿の作成に失敗しました" });
    }
    res.status(201).json({
      id: this.lastID,
      title,
      body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });
});

// // PUT 記事更新
// router.put("/:id", (req, res) => {
//   const { id } = req.params;
//   const { title, body } = req.body;
//   if (!title || !body) {
//     return res.status(400).json({ error: "タイトルと本文は必須です" });
//   }

//   const query = `
//     UPDATE posts
//     SET title = ?, body = ?, updatedAt = datetime('now')
//     WHERE id = ?
//   `;

//   db.run(query, [title, body, id], function (err) {
//     if (err) {
//       console.error("DBエラー:", err);
//       return res.status(500).json({ error: "記事の更新に失敗しました" });
//     }
//     if (this.changes === 0) {
//       return res.status(404).json({ error: "該当する記事が見つかりません" });
//     }
//     res.json({ message: "記事が更新されました", id, title, body });
//   });
// });

// 例: Express ルーター内の PUT /api/posts/:id 処理

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "タイトルと本文は必須です" });
  }

  const query = `
    UPDATE posts
    SET title = ?, body = ?, updatedAt = datetime('now')
    WHERE id = ?
  `;

  db.run(query, [title, body, id], function (err) {
    if (err) {
      return res.status(500).json({ error: "記事の更新に失敗しました" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "該当する記事が見つかりません" });
    }
    res.json({ message: "記事が更新されました", id, title, body });
  });
});

// DELETE 記事削除
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM posts WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      console.error("DBエラー:", err);
      return res.status(500).json({ error: "記事の削除に失敗しました" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "該当する記事が見つかりません" });
    }
    res.status(204).send();
  });
});

module.exports = router;
