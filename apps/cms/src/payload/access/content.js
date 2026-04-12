/** Admin or editor (can use admin UI for content collections). */
export const isStaff = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor'

/**
 * Staff sees all documents; anonymous API sees only published (drafts workflow).
 * For collections with `versions: { drafts: true }`.
 */
export const staffOrPublished = ({ req }) => {
  if (req.user?.role === 'admin' || req.user?.role === 'editor') {
    return true
  }
  return {
    _status: {
      equals: 'published',
    },
  }
}
