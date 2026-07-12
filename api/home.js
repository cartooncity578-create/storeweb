export default function handler(req, res) {
  res.status(200).json({
    catalog: {
      "item1": { name: "Minecraft", image: "https://placehold.co/100", redirect: "minecraft.html" }
    }
  });
}
