import { Lucia } from "lucia";
import { GitHub, Google } from "arctic";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import type { DatabaseUser } from "./db.ts";

const client = new PrismaClient();
const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      avatarUrl: attributes.avatarUrl,
      displayName: attributes.displayName,
      username: attributes.username,
      email: attributes.email,
      emailVerified: attributes.emailVerified,
      role: attributes.role,
      createdAt: attributes.createdAt,
    };
  },
});

const config = useRuntimeConfig();

export const github = new GitHub(
  config.githubClientId,
  config.githubClientSecret,
);

export const google = new Google(
  config.googleClientId,
  config.googleClientSecret,
  `${config.origin}/login/google/callback`,
);

export async function validateRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<{ user: User; session: Session } | { user: null; session: null }> {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }
  const result = await lucia.validateSession(sessionId);
  if (result.session && result.session.fresh) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(result.session.id).serialize(),
    );
  }

  if (!result.session) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
  }
  return result;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }
}
