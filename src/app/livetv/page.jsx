
import LiveTvClient from "@/component/LiveTv/LiveTvClient";
import { Suspense } from "react";
//import LiveTvClient from "./LiveTvClient";

export default function LiveTvPage() {
  return (
    <Suspense fallback={<div style={{ color: "#fff" }}>Loading Live TV...</div>}>
      <LiveTvClient />
    </Suspense>
  );
}


