export interface ClientMessageRequestEventPayload {
  message: {
    body: string
    senderUserId: string
    receiverUserId?: string
    groupId?: string
  }
}

export interface MessageAcceptedEventPayload {
  body: string
  senderUserId: string
  senderName: string
  receiverUserId?: string
  groupId?: string
}

export interface MessageErrorEventPayload {
  body: string
  senderUserId: string
  senderName: string
  receiverUserId?: string
  groupId?: string
}
