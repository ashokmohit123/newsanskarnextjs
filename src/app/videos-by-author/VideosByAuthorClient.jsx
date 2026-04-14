"use client";

import { useSearchParams } from "next/navigation";
import AuthorVideoListing from "@/component/AutherListing/AuthorVideoListing";

export default function VideosByAuthorClient() {
  const searchParams = useSearchParams();
  const authorId = searchParams.get("id");

  return <AuthorVideoListing authorId={authorId} />;
}
