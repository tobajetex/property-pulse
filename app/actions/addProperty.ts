"use server";

import { connectDB } from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addProperty(formData: FormData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("You must be logged in to add a property");
  }

  const { userId } = sessionUser;

  // Get all amenities (checkbox values come as multiple entries)
  const amenities = formData.getAll("amenities");

  // Get images (file inputs)
  const images = formData.getAll("images").filter((image) => {
    if (image instanceof File) {
      return image.name !== "";
    }
    return false;
  });

  // Create property data object
  const propertyData = {
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
  };

  // Upload images to Cloudinary
  const imageUrls: string[] = [];

  for (const imageFile of images) {
    if (imageFile instanceof File) {
      try {
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

        imageUrls.push(result.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Continue with other images even if one fails
      }
    }
  }

  // Add images to property data
  propertyData.images = imageUrls;

  // Save to database
  const newProperty = new Property(propertyData);
  await newProperty.save();

  // Revalidate and redirect
  revalidatePath("/", "layout");
  redirect(`/properties/${newProperty._id}`);
}
