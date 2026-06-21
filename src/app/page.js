import ArtCategories from "@/components/ArtCategories";
import Banner from "@/components/Banner";
import TopArtists from "@/components/TopArtists";
import BrowseArtworks from "./browse/page";


export default function Home() {
  return (
    <div>
     <Banner/>
     <BrowseArtworks/>
     <TopArtists/>
     <ArtCategories/>
    </div>
  );
}
