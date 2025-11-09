// Temporary auth stub until Prisma engines can be downloaded
// This allows the project to build in sandbox environment

export const handlers = {
  GET: async () => new Response("Auth not configured yet", { status: 503 }),
  POST: async () => new Response("Auth not configured yet", { status: 503 }),
}

export const auth = async () => null
export const signIn = async () => {}
export const signOut = async () => {}
