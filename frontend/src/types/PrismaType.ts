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
  id: string
}

/**
 * Model Message
 *
 */
export type Message = {
  id: string
  createdAt: Date
  message: string
  memberId: string
  roomId: string
}
