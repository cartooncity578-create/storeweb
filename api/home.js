export default function handler(req, res) {
  // Yahan tumhara data structure hoga
  let data = {
    catalog: {
      "item1": { name: "Minecraft", image: "...", redirect: "minecraft.html" }
    }
  };

  if (req.method === 'POST') {
    const { type, key, name, image, redirect, newName, newImg, newLink } = req.body;

    if (type === 'add') {
      data.catalog['item' + Date.now()] = { name, image, redirect };
    } else if (type === 'update') {
      data.catalog[key] = { name: newName, image: newImg, redirect: newLink };
    } else if (type === 'delete') {
      delete data.catalog[key];
    }
    return res.status(200).json({ success: true });
  }

  res.status(200).json(data);
}
