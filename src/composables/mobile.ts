export function getDeviceUa() {
  const u = navigator.userAgent
  const flag = !!u.match(/AppleWebKit.*Mobile.*/)
  return flag
}
