import MenuVideoListing from "@/component/Premium/MenuVideoListing";

export default async function Page({ params }) {
  const { menu_id } = await params; // ✅ FIX

  return <MenuVideoListing menu_id={menu_id} />;
}
