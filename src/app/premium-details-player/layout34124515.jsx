export default function PlayerDetailsLayout({ children }) {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
}
