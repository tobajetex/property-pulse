import Hero from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";
// These components exist now
import FeaturedProperties from "@/components/FeaturedProperties";
import HomeProperties from "@/components/HomeProperties";

export default function HomePage() {
  return (
    <>
      <Hero />
      <InfoBoxes />
      <FeaturedProperties />
      <HomeProperties />
    </>
  );
}
