// Uploads an image file straight to IMGBB and returns its public URL
// (decision D4: only the URL is stored in MongoDB, never the file).
export async function uploadToIMGBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Image upload is not configured. Add NEXT_PUBLIC_IMGBB_API_KEY to your .env file and restart the dev server."
    );
  }

  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: form, // browser sets the multipart boundary itself
  }).catch(() => {
    throw new Error("Cannot reach IMGBB. Check your internet connection.");
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    throw new Error(body?.error?.message || "Image upload failed.");
  }

  return body.data.url as string;
}
