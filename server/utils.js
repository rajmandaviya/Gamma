import { promises as fs } from "fs";
import { join } from "path";
import { nanoid } from "nanoid";

export const saveProfileImage = async (imageFile) => {
  const uploadDir = join(process.cwd(), "public/uploads");
  const filename = `${nanoid()}-${imageFile.filename}`;

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = join(uploadDir, filename);
  await fs.writeFile(filePath, imageFile.data);

  return `/uploads/${filename}`;
};
