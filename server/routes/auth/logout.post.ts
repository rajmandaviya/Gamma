export default defineEventHandler(async (event) => {
  await clearUserSession(event); // Clear the session
  return {
    statusCode: 200,
    message: "Logged out successfully",
  };
});
