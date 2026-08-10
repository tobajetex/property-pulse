import Link from "next/link";
import Image from "next/image";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMarker,
} from "react-icons/fa";

interface FeaturedPropertyCardProps {
  property: {
    _id: string;
    name: string;
    type: string;
    images: string[] | string;
    beds: number;
    baths: number;
    square_feet: number;
    rates: {
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

export default function FeaturedPropertyCard({
  property,
}: FeaturedPropertyCardProps) {
  const getRateDisplay = () => {
    if (!property.rates) {
      return "Contact for pricing";
    }
    const { rates } = property;
    if (rates.monthly) {
      return `${rates.monthly.toLocaleString()}/mo`;
    } else if (rates.weekly) {
      return `${rates.weekly.toLocaleString()}/wk`;
    } else if (rates.nightly) {
      return `${rates.nightly.toLocaleString()}/night`;
    }
    return "Contact for pricing";
  };

  // ✅ ADD THIS FUNCTION HERE - Inside the component
  const getImageUrl = (): string | null => {
    if (!property.images) return null;

    if (typeof property.images === "string") {
      const urls = property.images
        .split(",")
        .filter(
          (url) => typeof url === "string" && url.trim().startsWith("http"),
        );
      return urls.length > 0 ? urls[0] : null;
    }

    if (Array.isArray(property.images)) {
      const validUrls = property.images.filter(
        (img: any) => typeof img === "string" && img.startsWith("http"),
      );
      return validUrls.length > 0 ? validUrls[0] : null;
    }

    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="bg-white rounded-xl shadow-md relative flex flex-col md:flex-row">
      {/* Image Section */}
      <div className="relative w-full md:w-2/5 h-48 md:h-auto min-h-[200px] rounded-t-xl md:rounded-tr-none md:rounded-l-xl overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-t-xl">
            <span className="text-blue-400 text-sm">No Image</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold">{property.name}</h3>
        <div className="text-gray-600 mb-4">{property.type}</div>
        <h3 className="absolute top-[10px] left-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
          ${getRateDisplay()}
        </h3>
        <div className="flex justify-center gap-4 text-gray-500 mb-4">
          <p>
            <FaBed className="inline-block mr-2" /> {property.beds}{" "}
            <span className="md:hidden lg:inline">Beds</span>
          </p>
          <p>
            <FaBath className="inline-block mr-2" /> {property.baths}{" "}
            <span className="md:hidden lg:inline">Baths</span>
          </p>
          <p>
            <FaRulerCombined className="inline-block mr-2" />
            {property.square_feet}{" "}
            <span className="md:hidden lg:inline">sqft</span>
          </p>
        </div>

        <div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
          {property.rates.nightly && (
            <p>
              <FaMoneyBill className="inline mr-2" /> Nightly
            </p>
          )}
          {property.rates.weekly && (
            <p>
              <FaMoneyBill className="inline mr-2" /> Weekly
            </p>
          )}
          {property.rates.monthly && (
            <p>
              <FaMoneyBill className="inline mr-2" /> Monthly
            </p>
          )}
        </div>

        <div className="border border-gray-200 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between">
          <div className="flex align-middle gap-2 mb-4 lg:mb-0">
            <FaMapMarker className="text-lg text-orange-700" />
            <span className="text-orange-700">
              {property.location.city} {property.location.state}
            </span>
          </div>
          <Link
            href={`/properties/${property._id}`}
            className="h-9 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
