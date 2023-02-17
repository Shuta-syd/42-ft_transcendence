/**
 * Model User
 *
 */
export type User = {
  id: number
  email: string
  name: string
  password: string
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
