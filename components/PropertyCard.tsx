import Image from "next/image";
import Link from "next/link";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMarker,
} from "react-icons/fa";

interface PropertyCardProps {
  property: {
    _id: string;
    name: string;
    type: string;
    images?: string[] | string;
    beds: number;
    baths: number;
    square_feet: number;
    rates?: {
      weekly?: number;
      monthly?: number;
      nightly?: number;
    };
    location: {
      city: string;
      state: string;
    };
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // ✅ FIX: Get valid image URL
  const getImageUrl = (): string | null => {
    if (!property.images) return null;

    // If images is a string
    if (typeof property.images === "string") {
      const urls = property.images
        .split(",")
        .filter(
          (url) => typeof url === "string" && url.trim().startsWith("http"),
        );
      return urls.length > 0 ? urls[0] : null;
    }

    // If images is an array
    if (Array.isArray(property.images)) {
      const validUrls = property.images.filter(
        (img: any) => typeof img === "string" && img.startsWith("http"),
      );
      return validUrls.length > 0 ? validUrls[0] : null;
    }

    return null;
  };

  const imageUrl = getImageUrl();

  const getRateDisplay = () => {
    if (!property.rates) {
      return "Contact for pricing";
    }

    const { rates } = property;
    if (rates.monthly) {
      return `$${rates.monthly.toLocaleString()}/mo`;
    } else if (rates.weekly) {
      return `$${rates.weekly.toLocaleString()}/wk`;
    } else if (rates.nightly) {
      return `$${rates.nightly.toLocaleString()}/night`;
    }
    return "Contact for pricing";
  };

  return (
    <div className="rounded-xl shadow-md relative">
      {/* Image Section - ✅ FIXED */}
      <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-t-xl">
            <div className="text-center">
              <span className="text-4xl block mb-2">🏠</span>
              <span className="text-blue-400 text-sm">No Image</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-6">
          <div className="text-gray-600">{property.type}</div>
          <h3 className="text-xl font-bold">{property.name}</h3>
        </div>

        <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
          {getRateDisplay()}
        </h3>

        <div className="flex justify-center gap-4 text-gray-500 mb-4">
          <p>
            <FaBed className="inline mr-2" /> {property.beds}
            <span className="md:hidden lg:inline"> Beds</span>
          </p>
          <p>
            <FaBath className="inline mr-2" /> {property.baths}
            <span className="md:hidden lg:inline"> Baths</span>
          </p>
          <p>
            <FaRulerCombined className="inline mr-2" /> {property.square_feet}
            <span className="md:hidden lg:inline"> sqft</span>
          </p>
        </div>

        <div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
          {property.rates?.weekly && (
            <p>
              <FaMoneyBill className="inline mr-2" /> Weekly
            </p>
          )}
          {property.rates?.monthly && (
            <p>
              <FaMoneyBill className="inline mr-2" /> Monthly
            </p>
          )}
          {property.rates?.nightly && (
            <p>
              <FaMoneyBill className="inline mr-2" /> Nightly
            </p>
          )}
        </div>

        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between mb-4">
          <div className="flex align-middle gap-2 mb-4 lg:mb-0">
            <FaMapMarker className="text-orange-700 mt-1" />
            <span className="text-orange-700">
              {property.location.city}, {property.location.state}
            </span>
          </div>
          <Link
            href={`/properties/${property._id}`}
            className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
