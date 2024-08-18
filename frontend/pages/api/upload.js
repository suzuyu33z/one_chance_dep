import { v2 as cloudinary } from "cloudinary";
import multiparty from "multiparty";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // ボディパーサを無効化
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "画像のアップロードに失敗しました" });
      }
      try {
        const filePath = files.file[0].path;
        const uploadedResponse = await cloudinary.uploader.upload(filePath, {
          upload_preset: "ml_default",
        });
        res.status(200).json({ url: uploadedResponse.secure_url });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to upload image" });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
