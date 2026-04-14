
import SearchBar from "@/component/SearchBar/SearchBar";
import SearchResults from "@/component/SearchBar/SearchResults";


export default function searchbarPage() {
  return (
    <div style={{ width: "94%", marginLeft: "5%" }}>
   <SearchBar />
      <SearchResults title="Trending in India" />
    </div>
  );
}
