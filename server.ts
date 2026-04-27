import express from "express";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath, pathToFileURL } from "node:url";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import * as dotenv from "dotenv";
dotenv.config();

type StartServerEntry = {
  fetch: (request: Request) => Response | Promise<Response>;
};

const app = express();
const port = Number(process.env.PORT ?? 5000);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientDirectory = path.resolve(currentDirectory, "client");
const serverEntryPath = path.resolve(currentDirectory, "server/server.js");
const { default: serverEntry } = (await import(
  pathToFileURL(serverEntryPath).href
)) as { default: StartServerEntry };

app.disable("x-powered-by");

app.use(
  express.raw({
    type: "*/*",
    limit: "10mb",
  }),
);

app.use(
  express.static(clientDirectory, {
    index: false,
    maxAge: "1h",
  }),
);

app.use(async (req, res, next) => {
  try {
    const request = toWebRequest(req);
    const response = await serverEntry.fetch(request);
    await sendWebResponse(response, res);
  } catch (error) {
    next(error);
  }
});

app.use(
  (
    error: unknown,
    _req: ExpressRequest,
    res: ExpressResponse,
    _next: express.NextFunction,
  ) => {
    console.error("SSR request failed:", error);
    res.status(500).send("Internal Server Error");
  },
);

app.listen(port, (err?: Error) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${port}`);
});

function toWebRequest(req: ExpressRequest) {
  const origin = `${req.protocol}://${req.get("host")}`;
  const url = new URL(req.originalUrl || req.url, origin);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
      continue;
    }

    if (typeof value === "string") {
      headers.set(key, value);
    }
  }

  const method = req.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : req.body instanceof Buffer
        ? req.body
        : undefined;

  return new Request(url, {
    method,
    headers,
    body,
    duplex: body ? "half" : undefined,
  } as RequestInit & { duplex?: "half" });
}

async function sendWebResponse(response: Response, res: ExpressResponse) {
  res.status(response.status);

  for (const [key, value] of response.headers) {
    if (key.toLowerCase() === "set-cookie") {
      res.append(key, value);
    } else {
      res.setHeader(key, value);
    }
  }

  if (!response.body) {
    res.end();
    return;
  }

  Readable.fromWeb(
    response.body as import("node:stream/web").ReadableStream,
  ).pipe(res);
}
