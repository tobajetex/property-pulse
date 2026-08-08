import { connectDB } from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarker,
} from "react-icons/fa";

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  await connectDB();

  const propertyDoc = await Property.findById(params.id).lean();

  if (!propertyDoc) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Property Not Found
          </h1>
          <Link href="/properties" className="text-blue-500 hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const property = convertToSerializeableObject(propertyDoc);

  return (
    <>
      {/* Header Image */}
      <section>
        <div className="container-xl m-auto">
          <div className="grid grid-cols-1">
            <Image
              src={property.images?.[0] || "/images/property-default.jpg"}
              alt={property.name}
              className="object-cover h-[400px] w-full"
              width={1800}
              height={400}
              priority
            />
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            href="/properties"
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Properties
          </Link>
        </div>
      </section>

      {/* Property Details */}
      <section className="bg-blue-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            {/* Main Content */}
            <main>
              <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
                <div className="text-gray-500 mb-4">{property.type}</div>
                <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
                <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                  <FaMapMarker className="text-orange-700 mt-1 mr-1" />
                  <p className="text-orange-700">
                    {property.location?.street}, {property.location?.city}{" "}
                    {property.location?.state}
                  </p>
                </div>

                <h3 className="text-lg font-bold my-6 bg-gray-800 text-white p-2">
                  Rates & Options
                </h3>
                <div className="flex flex-col md:flex-row justify-around">
                  {property.rates?.nightly && (
                    <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
                      <div className="text-gray-500 mr-2 font-bold">
                        Nightly
                      </div>
                      <div className="text-2xl font-bold text-blue-500">
                        ${property.rates.nightly.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {property.rates?.weekly && (
                    <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
                      <div className="text-gray-500 mr-2 font-bold">Weekly</div>
                      <div className="text-2xl font-bold text-blue-500">
                        ${property.rates.weekly.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {property.rates?.monthly && (
                    <div className="flex items-center justify-center mb-4 pb-4 md:pb-0">
                      <div className="text-gray-500 mr-2 font-bold">
                        Monthly
                      </div>
                      <div className="text-2xl font-bold text-blue-500">
                        ${property.rates.monthly.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description & Details */}
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-lg font-bold mb-6">
                  Description & Details
                </h3>
                <div className="flex justify-center gap-4 text-blue-500 mb-4 text-xl space-x-9">
                  <p>
                    <FaBed className="inline-block mr-2" /> {property.beds}{" "}
                    <span className="hidden sm:inline">Beds</span>
                  </p>
                  <p>
                    <FaBath className="inline-block mr-2" /> {property.baths}{" "}
                    <span className="hidden sm:inline">Baths</span>
                  </p>
                  <p>
                    <FaRulerCombined className="inline-block mr-2" />
                    {property.square_feet}{" "}
                    <span className="hidden sm:inline">sqft</span>
                  </p>
                </div>
                <p className="text-gray-500 mb-4">
                  {property.description || "No description provided."}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                  <h3 className="text-lg font-bold mb-6">Amenities</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2">
                    {property.amenities.map(
                      (amenity: string, index: number) => (
                        <li key={index}>
                          <span className="text-green-600 mr-2">✓</span>{" "}
                          {amenity}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6">
                  Contact Property Manager
                </h3>
                <p className="text-gray-600 mb-4">
                  Interested in this property? Contact the owner directly.
                </p>
                {property.seller_info ? (
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong>{" "}
                      {property.seller_info.name || "Not provided"}
                    </p>
                    {property.seller_info.email && (
                      <p>
                        <strong>Email:</strong> {property.seller_info.email}
                      </p>
                    )}
                    {property.seller_info.phone && (
                      <p>
                        <strong>Phone:</strong> {property.seller_info.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Contact information not available
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
