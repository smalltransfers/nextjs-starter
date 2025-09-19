(async () => {
    if (process.env.NEXT_RUNTIME) {
        // This is so that server-only is enabled only on NextJs, but not when run from the command line (ts-node).
        await import("server-only");
    }
})();