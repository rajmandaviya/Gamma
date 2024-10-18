export default defineAppConfig({
  ui: {
    primary: "charade",
    accent: "aquamarine",
    skeleton: {
      base: "animate-pulse",
      background: "bg-gray-200 dark:bg-charade-900",
    },
    notification: {
      background: "bg-accent dark:bg-accent",
      color: "text-white dark:text-white",
      description: "text-white dark:text-white",
      ring: "ring-accent dark:ring-accent",
    },
  },
  darkMode: "class",
});
