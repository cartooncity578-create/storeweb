// /api/save-data.js
// This function updates data.json directly in your GitHub repo.
// Because Vercel is connected to GitHub, pushing this update triggers
// an automatic redeploy, so your live site updates within ~30-60 seconds.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, data } = req.body || {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong password" });
  }

  if (!data) {
    return res.status(400).json({ error: "No data provided" });
  }

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.status(500).json({
      error: "Server not configured. Missing GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO env vars.",
    });
  }

  const branch = GITHUB_BRANCH || "main";
  const filePath = "data.json";
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  try {
    // 1. Get current file SHA (needed to update an existing file)
    const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    let sha;
    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    }
    // if getRes is 404, file doesn't exist yet — sha stays undefined, GitHub will create it

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: "Update data.json from admin panel",
        content,
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      return res.status(500).json({ error: "GitHub update failed", details: errText });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Unexpected error", details: String(err) });
  }
}
