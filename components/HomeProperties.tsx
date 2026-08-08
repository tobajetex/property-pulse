import Link from "next/link";
import { connectDB } from "@/config/database";
import Property from "@/models/Property";

export default async function HomeProperties() {
  await connectDB();

  const properties = await Property.find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Recent Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.length === 0 ? (
              <p className="text-center text-gray-500 col-span-3">
                No properties found
              </p>
            ) : (
              properties.map((property) => (
                <div
                  key={String(property._id)}
                  className="bg-white rounded-xl shadow-md"
                >
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{property.name}</h3>
                    <p className="text-gray-600">{property.type}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="m-auto max-w-lg my-10 px-6">
        <Link
          href="/properties"
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >
          View All Properties
        </Link>
      </section>
    </>
  );
}
