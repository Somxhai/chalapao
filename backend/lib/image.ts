import { UUIDTypes } from "uuid";
import {
  addImagesToTable,
  getImagesFromTable,
} from "../database/service/image.ts";

export const saveImages = async (
  files: File[],
  id: UUIDTypes,
  type: "item_image" | "review_item_image" | "review_user_image",
) => {
  const folder = type === "item_image" ? "item" : "review";
  const filePath = `${Deno.cwd()}/image/${folder}`;
  const pathsForDb = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const extension = file.name.includes(".")
      ? file.name.split(".").pop()
      : file.type.split("/")[1] || "png"; // fallback to png

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const fileName = `${id}-${crypto.randomUUID()}.${extension}`;
    const filePathWithName = `${filePath}/${fileName}`;
    await Deno.writeFile(filePathWithName, uint8Array);

    pathsForDb.push(`image/${folder}/${fileName}`);
  }

  const insertedImagePath = await addImagesToTable(id, pathsForDb, type);
  console.log(`Image: save images to db:`, insertedImagePath);
  return insertedImagePath;
};

export const getImagesById = async (
  id: UUIDTypes,
  type: "item_image" | "review_item_image" | "review_user_image",
) => {
  const paths = await getImagesFromTable(id, type);
  const files: { path: string; image: Uint8Array }[] = [];
  for (const path of paths) {
    try {
      const file = await Deno.readFile(path);
      files.push({ path, image: file });
    } catch (err) {
      console.error(`Failed to read image: ${path}`, err);
    }
  }
  return files;
};

export const deleteImages = async (
  id: UUIDTypes,
  type: "item_image" | "review_item_image" | "review_user_image",
) => {
  const paths = await getImagesFromTable(id, type);
  for (const path of paths) {
    try {
      await Deno.remove(`${Deno.cwd()}/${path}`);
    } catch (err) {
      console.error(`Failed to delete image: ${path}`, err);
    }
  }
  return true;
};
