import config from "../config.js";

export function getJWTSecret() {
    if (!config.SECRET_KEY) {
        if (config.isProd) {
            throw new Error("Missing SECRET_KEY env var (required in production).")
        }
        return 'BASICSECRET'
    }
    return config.SECRET_KEY
}