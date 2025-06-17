import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarToday, Label } from "@mui/icons-material";
import styles from "./PostCard.module.css";
import type { Post } from "../types/Post";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

type Props = {
  post: Post;
};

const PostCard = ({ post }: Props) => {
  // 仮のカテゴリと日付
  const createdAt = new Date().toLocaleDateString(); // ダミー日付
  const category = "技術"; // 仮カテゴリ

  return (
    <motion.article className={styles.card} variants={itemVariants} transition={{ duration: 0.5, ease: "easeOut" }}>
      <Link to={`/posts/${post.id}`} className={styles.link} data-testid={`post-link-${post.id}`}>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.body}>{post.body.slice(0, 60)}...</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <CalendarToday fontSize="small" className={styles.icon} />
            {createdAt}
          </span>
          <span className={styles.metaItem}>
            <Label fontSize="small" className={styles.icon} />
            {category}
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

export default PostCard;
