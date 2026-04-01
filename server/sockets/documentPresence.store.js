const documentUsers = new Map()

export function addDocUser(docId, user) {

  if (!documentUsers.has(docId)) {
    documentUsers.set(docId, new Map())
  }

  const users = documentUsers.get(docId)

  users.set(user._id.toString(), {
    id: user._id,
    name: user.name
  })

  return Array.from(users.values())
}

export function removeDocUser(docId, userId) {

  const users = documentUsers.get(docId)

  if (!users) return []

  users.delete(userId.toString())

  if (users.size === 0) {
    documentUsers.delete(docId)
    return []
  }

  return Array.from(users.values())
}