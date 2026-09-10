"use server";

import { connectDB } from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ✅ Define the type explicitly
interface PropertyDataType {
  owner: string;
  type: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  location: {
    street: FormDataEntryValue | null;
    city: FormDataEntryValue | null;
    state: FormDataEntryValue | null;
    zipcode: FormDataEntryValue | null;
  };
  beds: number;
  baths: number;
  square_feet: number;
  amenities: FormDataEntryValue[];
  rates: {
    weekly?: number;
    monthly?: number;
    nightly?: number;
  };
  seller_info: {
    name: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
    phone: FormDataEntryValue | null;
  };
  images: string[];
}

export async function addProperty(formData: FormData) {
  console.log("📝 addProperty called");

  const sessionUser = await getSessionUser();
  console.log("📝 Session user:", sessionUser);

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("You must be logged in to add a property");
  }

  await connectDB();

  const { userId } = sessionUser;

  // Get all amenities
  const amenities = formData.getAll("amenities");

  // Get images (file inputs)
  const images = formData.getAll("images").filter((image) => {
    if (image instanceof File) {
      return image.name !== "";
    }
    return false;
  });

  console.log("📸 Images found:", images.length);

  // ✅ Explicitly type propertyData with images: string[]
  const propertyData: PropertyDataType = {
    owner: userId,
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    location: {
      street: formData.get("location.street"),
      city: formData.get("location.city"),
      state: formData.get("location.state"),
      zipcode: formData.get("location.zipcode"),
    },
    beds: Number(formData.get("beds")),
    baths: Number(formData.get("baths")),
    square_feet: Number(formData.get("square_feet")),
    amenities,
    rates: {
      weekly: formData.get("rates.weekly")
        ? Number(formData.get("rates.weekly"))
        : undefined,
      monthly: formData.get("rates.monthly")
        ? Number(formData.get("rates.monthly"))
        : undefined,
      nightly: formData.get("rates.nightly")
        ? Number(formData.get("rates.nightly"))
        : undefined,
    },
    seller_info: {
      name: formData.get("seller_info.name"),
      email: formData.get("seller_info.email"),
      phone: formData.get("seller_info.phone"),
    },
    images: [], // ✅ Now TypeScript knows this is string[]
  };

  // Upload images to Cloudinary
  const imageUrls: string[] = [];

  for (const imageFile of images) {
    if (imageFile instanceof File) {
      try {
        console.log(
          `📤 Uploading image: ${imageFile.name} (${imageFile.size} bytes)`,
        );

        const imageBuffer = await imageFile.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);
        const imageBase64 = imageData.toString("base64");

        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBase64}`,
          {
            folder: "propertypulse",
          },
        );

        console.log("✅ Upload successful:", result.secure_url);
        imageUrls.push(result.secure_url);
      } catch (error) {
        console.error("❌ Error uploading image:", error);
      }
    }
  }

  console.log("📸 Final image URLs:", imageUrls);

  // ✅ Assign images
  propertyData.images = imageUrls;

  // Save to database
  const newProperty = new Property(propertyData);
  await newProperty.save();

  console.log("✅ Property saved with ID:", newProperty._id);

  revalidatePath("/", "layout");
  redirect(`/properties/${newProperty._id}`);
}
