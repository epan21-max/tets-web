export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { text } = req.query;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Parameter 'text' diperlukan." });
  }

  try {
    const apiUrl = `https://api.sxtream.my.id/maker/brat?text=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Gagal mengambil gambar dari API." });
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
      }
