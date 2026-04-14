import Image from "next/image";
import styles from "./searchbar.module.css";

export default function MovieCard({ img }) {
  return (
    <div className={styles.card}>
      <Image
        src={img}
        alt="movie"
        fill
        className={styles.poster}
      />
    </div>
  );
}
