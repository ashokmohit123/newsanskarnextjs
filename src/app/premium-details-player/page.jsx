import PremiumDetailsPlayer from "@/component/Premium/PremiumDetailsPlayer";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <PremiumDetailsPlayer />
    </Suspense>
  );
}
