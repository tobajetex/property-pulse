import Link from "next/link";
import { connectDB } from "@/config/database";
import Property from "@/models/Property";
import PropertyCard from "./PropertyCard";
import { convertToSerializeableObject } from "@/utils/convertToObject";

export default async function HomeProperties() {
  await connectDB();

  const properties = await Property.find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const serializedProperties = convertToSerializeableObject(properties);

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Recent Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serializedProperties.length === 0 ? (
              <p className="text-center text-gray-500 col-span-3">
                No properties found. Be the first to list one!
              </p>
            ) : (
              serializedProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      {serializedProperties.length > 0 && (
        <section className="m-auto max-w-lg my-10 px-6">
          <Link
            href="/properties"
            className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
          >
            View All Properties
          </Link>
        </section>
      )}
    </>
  );
}
