import PropertyCard from "@/components/PropertyCard";
import PropertySearchForm from "@/components/PropertySearchForm";
import Pagination from "@/components/Pagination";
import { connectDB } from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";

interface PropertiesPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  // ✅ AWAIT the searchParams before accessing
  const { page = "1", pageSize = "9" } = await searchParams;

  const currentPage = parseInt(page);
  const currentPageSize = parseInt(pageSize);
  const skip = (currentPage - 1) * currentPageSize;

  await connectDB();

  const total = await Property.countDocuments({});
  const properties = await Property.find({})
    .skip(skip)
    .limit(currentPageSize)
    .lean();

  const serializedProperties = convertToSerializeableObject(properties);
  const showPagination = total > currentPageSize;

  return (
    <>
      {/* Search Section */}
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
          <PropertySearchForm />
        </div>
      </section>

      {/* Properties Grid */}
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <h1 className="text-2xl mb-4">Browse Properties</h1>

          {serializedProperties.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No properties found. Be the first to list one!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serializedProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          {showPagination && (
            <Pagination
              page={currentPage}
              pageSize={currentPageSize}
              totalItems={total}
            />
          )}
        </div>
      </section>
    </>
  );
}
