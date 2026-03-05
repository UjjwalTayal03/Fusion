const workspaceUsers = new Map()

export function addUser(workspaceId, userId) {
  if (!workspaceUsers.has(workspaceId)) {
    workspaceUsers.set(workspaceId, new Set())
  }

  workspaceUsers.get(workspaceId).add(userId)

  return Array.from(workspaceUsers.get(workspaceId))
}

export function removeUser(workspaceId, userId) {
  const users = workspaceUsers.get(workspaceId)

  if (!users) return []

  users.delete(userId)

  if (users.size === 0) {
    workspaceUsers.delete(workspaceId)
    return []
  }

  return Array.from(users)
}