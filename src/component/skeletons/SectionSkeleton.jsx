import SkeletonBox from "@/component/SkeletonBox";

export default function PremiumSkeleton() {
  return (
    <div style={{ padding: "0 20px" }}>
      <SkeletonBox height={40} />
      <div style={{ display: "flex", gap: "15px" }}>
        <SkeletonBox height={220} />
        <SkeletonBox height={220} />
        <SkeletonBox height={220} />
      </div>
    </div>
  );
}
