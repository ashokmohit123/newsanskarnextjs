export default function SkeletonBox({ height = 200 }) {
  return (
    <div
      className="skeleton"
      style={{
        height,
        width: "100%",
        marginBottom: "20px",
      }}
    />
  );
}
