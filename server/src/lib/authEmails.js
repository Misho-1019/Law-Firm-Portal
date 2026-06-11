export function buildRegisterEmail({ username }) {
    return {
        subject: "Welcome to LexSchedule",
        html: `
          <p>Hi ${username || "there"},</p>
          <p>Your account was created successfully.</p>
          <p>If this wasn't you, please contact us immediately.</p>
        `,
    }
}

export function buildLoginEmail({ username, meta }) {
    const safe = (v) => (v ? String(v) : '-');

    return {
        subject: "🔐 New login to your account",
        html: `
          <p>Hi ${username || "there"},</p>
          <p>We detected a login to your account.</p>
          <p><strong>Time:</strong> ${safe(meta?.time)}</p>
          <p><strong>IP:</strong> ${safe(meta?.ip)}</p>
          <p><strong>Device:</strong> ${safe(meta?.ua)}</p>
          <p>If this wasn't you, please change your password immediately.</p>
        `,
    }
}

export function buildPasswordChangedEmail({ username, meta }) {
    const safe = (v) => (v ? String(v) : '-')

    return {
        subject: "✅ Your password was changed",
        html: `
          <p>Hi ${username || "there"},</p>
          <p>Your password was changed successfully.</p>
          <p><strong>Time:</strong> ${safe(meta?.time)}</p>
          <p><strong>IP:</strong> ${safe(meta?.ip)}</p>
          <p><strong>Device:</strong> ${safe(meta?.ua)}</p>
          <p>If this wasn't you, contact support and secure your account right away.</p>
        `,
    }
}

export function buildPasswordResetEmail({ username, resetLink }) {
    return {
        subject: "Reset your password",
        html: `
          <p>Hi ${username || "there"},</p>
          <p>You requested a password reset.</p>
          <p><a href="${resetLink}">Click here to reset your password</a></p>
          <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        `,
    }
}
