export default async function handler(req, res) {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];

  if (!allowedMethods.includes(req.method)) {
    res.setHeader("Allow", allowedMethods.join(", "));
    return res.status(405).json({ error: "Method not allowed" });
  }

  const backendUrl = process.env.BACKEND_API_URL?.replace(/\/+$/, "");
  const apiKey = process.env.API_KEY;

  if (!backendUrl || !apiKey) {
    return res.status(500).json({ error: "Server environment variables are missing" });
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";
  const targetUrl = `${backendUrl}/api/tasks${id ? `/${encodeURIComponent(id)}` : ""}`;

  const headers = {
    "x-api-key": apiKey,
  };

  const hasBody = req.method === "POST" || req.method === "PUT";

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  const body = hasBody
    ? typeof req.body === "string"
      ? req.body
      : JSON.stringify(req.body ?? {})
    : undefined;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    if (response.status === 204) {
      return res.status(204).end();
    }

    const responseBody = await response.text();
    const contentType = response.headers.get("content-type");

    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    return res.status(response.status).send(responseBody);
  } catch (error) {
    console.error("Ошибка proxy при запросе к backend:", error);
    return res.status(502).json({ error: "Backend unavailable" });
  }
}