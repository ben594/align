export type Role = 'owner' | 'admin' | 'reviewer' | 'labeler'

// define common function to check user permissions for a project
const hasRolePermission = (
  role: Role | undefined | null,
  allowedRoles: Role[]
): boolean => {
  if (role == null) return false
  return allowedRoles.includes(role)
}

export const canLabel = (role: Role | undefined | null) =>
  hasRolePermission(role, ['owner', 'admin', 'reviewer', 'labeler'])

export const canReview = (role: Role | undefined | null) =>
  hasRolePermission(role, ['owner', 'admin', 'reviewer'])

export const canAdmin = (role: Role | undefined | null) =>
  hasRolePermission(role, ['owner', 'admin'])

export const canOwner = (role: Role | undefined | null) =>
  hasRolePermission(role, ['owner'])
