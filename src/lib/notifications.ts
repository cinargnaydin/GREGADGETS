export function shouldSendRealNotifications() {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.SEND_REAL_NOTIFICATIONS === 'true'
  );
}
