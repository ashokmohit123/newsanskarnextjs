import { Suspense } from "react";
import VideosByAuthorClient from "./VideosByAuthorClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading videos...</div>}>
      <VideosByAuthorClient />
    </Suspense>
  );
}

