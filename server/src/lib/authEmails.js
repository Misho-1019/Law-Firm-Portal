export function buildRegisterEmail({ username }) {
    return {
        subject: "✅ Welcome to Law Office Scheduler",
        html: `
          <p>Hi ${username || "there"},</p>
          <p>Your account was created successfully.</p>
          <p>If this wasn’t you, please contact us immediately.</p>
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
          <p>If this wasn’t you, please change your password immediately.</p>
        `,
    }
}

export function buildPasswordChangedEmail({ username, meta }) {
    const safe = (v) = (v ? String(v) : '-')

    return {
        subject: "✅ Your password was changed",
        html: `
          <p>Hi ${username || "there"},</p>
          <p>Your password was changed successfully.</p>
          <p><strong>Time:</strong> ${safe(meta?.time)}</p>
          <p><strong>IP:</strong> ${safe(meta?.ip)}</p>
          <p><strong>Device:</strong> ${safe(meta?.ua)}</p>
          <p>If this wasn’t you, contact support and secure your account right away.</p>
        `,
    }
}