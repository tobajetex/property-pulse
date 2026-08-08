import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";
import PropertySearchForm from "@/components/PropertySearchForm";
import { connectDB } from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";

interface SearchResultsPageProps {
  searchParams: {
    location?: string;
    propertyType?: string;
  };
}

export default async function SearchResultsPage({
  searchParams,
}: SearchResultsPageProps) {
  const { location = "", propertyType = "All" } = searchParams;

  await connectDB();

  const locationPattern = new RegExp(location, "i");

  // Build query
  let query: any = {};

  if (location) {
    query.$or = [
      { name: locationPattern },
      { description: locationPattern },
      { "location.street": locationPattern },
      { "location.city": locationPattern },
      { "location.state": locationPattern },
      { "location.zipcode": locationPattern },
    ];
  }

  if (propertyType && propertyType !== "All") {
    query.type = propertyType;
  }

  const properties = await Property.find(query).lean();
  const serializedProperties = convertToSerializeableObject(properties);

  return (
    <>
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <PropertySearchForm />
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <Link
            href="/properties"
            className="flex items-center text-blue-500 hover:underline mb-3"
          >
            <FaArrowAltCircleLeft className="mr-2 mb-1" /> Back To Properties
          </Link>
          <h1 className="text-2xl mb-4">Search Results</h1>

          {serializedProperties.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No properties found matching your search criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serializedProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
