import { NextResponse } from "next/server";
import Replicate from "replicate";

import axios from "axios";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import { AiGeneratedImage } from "@/config/schema";
import { db } from "@/config/db";

const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    // Corrected: Properly parsing JSON from request
    const requestBody = await req.json();

    // Destructuring with a fallback to prevent errors
    const {
      imageUrl = "",
      type,
      lifestyle,
      style,
      lighting,
      storages,
      furniture,
      mood,
      smart,
      sustainability,
      rental,
      budget,
      additional,
      userEmail,
    } = requestBody;

    // Validate required fields
    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" });
    }

    const input = {
      image: imageUrl,
      prompt: `A ${type} with a ${style} space and a ${mood} ambiance and aligns with a ${lifestyle} lifestyle, incorporating ${
        smart ? "smart home technology" : "traditional"
      } elements and focuses on ${lighting} lighting and optimize storage with ${storages} solutions and focuses on ${furniture} furniture while considering ${
        sustainability ? "eco-friendly materials" : "standard materials"
      } and is ${rental ? "renter-friendly" : "customized for ownership"} and fits within a ${budget} budget and with additional requirements of ${additional}`,
    };

    const output = await replicate.run(
      "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      { input }
    );

    console.log("Generated Output:", output);

    const base64Image = await ConvertImageToBase64(output);
    const fileName = Date.now() + ".png";
    const storageRef = ref(storage, "interior-redesign/" + fileName);
    await uploadString(storageRef, base64Image, "data_url");
    const downloadUrl = await getDownloadURL(storageRef);

    console.log("Download URL:", downloadUrl);

    const dbResult = await db
      .insert(AiGeneratedImage)
      .values({
        type,
        style,
        lighting,
        storages,
        furniture,
        mood,
        smart,
        sustainability,
        rental,
        budget,
        additional,
        orgImage: imageUrl,
        aiImage: downloadUrl,
        userEmail,
      })
      .returning({ id: AiGeneratedImage.id });

    console.log("Database Result:", dbResult);

    return NextResponse.json({ result: downloadUrl });
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json({ error: e.message });
  }
}

async function ConvertImageToBase64(imageUrl) {
  try {
    const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64ImageRaw = Buffer.from(resp.data).toString("base64");
    return "data:image/png;base64," + base64ImageRaw;
  } catch (error) {
    console.error("Error converting image:", error);
    throw new Error("Failed to convert image to Base64");
  }
}