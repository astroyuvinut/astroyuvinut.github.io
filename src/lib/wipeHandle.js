// Shared handle to the mounted page wipe, so the scroll hook can trigger it without importing React.
let run = null

export const setWipe = (fn) => { run = fn }

/**
 * Covers the screen, calls `jump` while covered, then lifts away.
 * With no wipe mounted (reduced motion) it just jumps.
 */
export function wipeTo(label, jump) {
  if (!run) { jump(); return Promise.resolve() }
  return run(label, jump)
}
