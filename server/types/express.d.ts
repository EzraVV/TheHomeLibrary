declare namespace Express {
  interface Request {
    auth?: {
      authUserId: string
      userId: string
    }
  }
}
