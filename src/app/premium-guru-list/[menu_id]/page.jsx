"use client";

import { useSearchParams, useParams } from "next/navigation";
import PremiumGuruList from "@/component/Premium/PremiumGuruList";

export default function PremiumGuruListPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const menu_id = params.menu_id;   // from URL path
  const cat_id = searchParams.get("cat_id"); // from query

  return (
    <div>
      <PremiumGuruList menu_id={menu_id} cat_id={cat_id} />
    </div>
  );
}
