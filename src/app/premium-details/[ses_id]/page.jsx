import PremiumDetails from "@/component/Premium/PremiumDetails";

export default async function PremiumDetailsPage({ params, searchParams }) {
  // ✅ MUST await in your Next.js version
  const { ses_id } = await params;
const { cat_id = "" } = await searchParams;


  return <PremiumDetails ses_id={ses_id} cat_id={cat_id} />;
}
