import PremiumCategoryListing from "@/component/Premium/PremiumCategoryListing";

export default async function CategoryPage({ params }) {
  const { menu_id } = await params; // ✅ REQUIRED

  if (!menu_id) {
    return <p className="text-danger">Invalid Category</p>;
  }

  return <PremiumCategoryListing menu_id={menu_id} />;
}
