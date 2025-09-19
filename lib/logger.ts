type LogLevel = "info" | "warn" | "error" | "debug" | "trace";

function createLoggerMethod(level: LogLevel) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...data: any[]) => {
        console[level](...data);
    };
}

const Logger = {
    info: createLoggerMethod("info"),
    warn: createLoggerMethod("warn"),
    error: createLoggerMethod("error"),
    debug: createLoggerMethod("debug"),
    trace: createLoggerMethod("trace"),
};

export default Logger;