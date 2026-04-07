import { io } from "socket.io-client"

const URL = "http://localhost:5000"

export const createSocket = (token) => {
  return io(URL, {
    auth: {
      token
    }
  })
}