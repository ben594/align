export type Role = 'owner' | 'reviewer' | 'labeler' | 'admin'

export const canLabel = (role: Role) => {
  const allowedRoles: Role[] = ['owner', 'admin', 'reviewer', 'labeler']
  return allowedRoles.includes(role)
}

export const canReview = (role: Role) => {
  const allowedRoles: Role[] = ['owner', 'admin', 'reviewer']
  return allowedRoles.includes(role)
}

export const canAdmin = (role: Role) => {
  const allowedRoles: Role[] = ['owner', 'admin']
  return allowedRoles.includes(role)
}
