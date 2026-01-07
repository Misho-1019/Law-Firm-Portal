export function getJWTSecret() {
    const isProd = process.env.NODE_ENV === "production";
    const secret = process.env.SECRET_KEY;

    if (!secret) {
        if (isProd) {
            throw new Error("Missing SECRET_KEY env var (required in production).")
        }

        return 'BASICSECRET'
    }

    return secret
}