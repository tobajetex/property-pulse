import { connectDB } from "@/config/database";
import Property from "@/models/Property";

export default async function FeaturedProperties() {
  await connectDB();

  const properties = await Property.find({ is_featured: true }).lean();

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="bg-blue-50 px-4 pt-6 pb-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
          Featured Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div
              key={String(property._id)}
              className="bg-white rounded-xl shadow-md relative"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold">{property.name}</h3>
                <p className="text-gray-600">{property.type}</p>
                <p className="text-gray-500 mt-2">
                  {property.location?.city}, {property.location?.state}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
