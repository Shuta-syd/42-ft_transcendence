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
  senderName: string
  message: string
  memberId: string
  roomId: string
}

export type Match = {
  id: string
  player1: string
  player2: string
  winner_id: string
}

export type Game = {
  id:      number
  player1:  String
  player2:  String
}

