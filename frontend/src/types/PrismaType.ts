/**
 * Model User
 *
 */
export type User = {
  id: string
  email: string
  name: string
}

/**
 * Model ChatRoom
 *
 */
export type ChatRoom = {
  id: number
}

/**
 * Model Message
 *
 */
export type Message = {
  id: number
  createdAt: Date
  message: string
  userId: number
  roomId: number
}
