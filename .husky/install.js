// Skip install in production and CI environments.
if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
    process.exit(0);
}
const { default: husky } = await import("husky");
husky();
