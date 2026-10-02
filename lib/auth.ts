import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export function createToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function getAdminFromRequest(request: Request) {
  try {
    const token = request.headers
      .get("cookie")
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) =>
        cookie.startsWith("adminToken=")
      )
      ?.split("=")[1];

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token) as {
      username?: string;
      role?: string;
    };

    if (
      decoded.role !== "admin" ||
      !decoded.username
    ) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function isAdmin(request: Request) {
  return !!getAdminFromRequest(request);
}