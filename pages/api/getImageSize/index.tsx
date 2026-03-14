import probe from "probe-image-size";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  let images = await JSON.parse(req.body);
  let imageLists = images.images;

  const imagesWithSizes = await Promise.all(
    imageLists.map(async (image: any) => {
      const imageWithSize = await probe(image);

      return imageWithSize;
    }),
  );

  res.status(200).json({ images: imagesWithSizes });
}
