const wrap = (title, body) =>`
  <div style="max-width:480px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.6">
    <div style="background:#2F80ED;padding:24px;border-radius:12px 12px 0 0">
      <h1 style="color:#fff;font-size:18px;margin:0">LexSchedule</h1>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px">
      <h2 style="font-size:16px;margin:0 0 12px;color:#111827">${title}</h2>
      ${body}
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:16px">
      LexSchedule — Appointments made simple.
    </p>
  </div>
`;

export { wrap };

export function buildRegisterEmail({ username }) {
    return {
        subject: "Welcome to LexSchedule",
        html: wrap("Account created", `
          <p style="margin:0 0 8px">Hi ${username || "there"},</p>
          <p style="margin:0 0 8px">Your account was created successfully.</p>
          <p style="margin:0;font-size:13px;color:#6b7280">If this wasn't you, please contact us immediately.</p>
        `),
    }
}

export function buildLoginEmail({ username, meta }) {
    const safe = (v) => (v ? String(v) : '-');
    return {
        subject: "New login to your account",
        html: wrap("New login detected", `
          <p style="margin:0 0 8px">Hi ${username || "there"},</p>
          <p style="margin:0 0 12px">We detected a new login to your account.</p>
          <table style="font-size:13px;border-collapse:collapse;width:100%">
            <tr><td style="padding:4px 0;color:#6b7280;width:60px">Time</td><td style="padding:4px 0">${safe(meta?.time)}</td></tr>
            <tr><td style="padding:4px 0;color:#6b7280">IP</td><td style="padding:4px 0">${safe(meta?.ip)}</td></tr>
            <tr><td style="padding:4px 0;color:#6b7280">Device</td><td style="padding:4px 0">${safe(meta?.ua)}</td></tr>
          </table>
          <p style="margin:12px 0 0;font-size:13px;color:#dc2626">If this wasn't you, change your password immediately.</p>
        `),
    }
}

export function buildPasswordChangedEmail({ username, meta }) {
    const safe = (v) => (v ? String(v) : '-')
    return {
        subject: "Your password was changed",
        html: wrap("Password changed", `
          <p style="margin:0 0 8px">Hi ${username || "there"},</p>
          <p style="margin:0 0 12px">Your password was changed successfully.</p>
          <table style="font-size:13px;border-collapse:collapse;width:100%">
            <tr><td style="padding:4px 0;color:#6b7280;width:60px">Time</td><td style="padding:4px 0">${safe(meta?.time)}</td></tr>
            <tr><td style="padding:4px 0;color:#6b7280">IP</td><td style="padding:4px 0">${safe(meta?.ip)}</td></tr>
            <tr><td style="padding:4px 0;color:#6b7280">Device</td><td style="padding:4px 0">${safe(meta?.ua)}</td></tr>
          </table>
          <p style="margin:12px 0 0;font-size:13px;color:#dc2626">If this wasn't you, contact support and secure your account.</p>
        `),
    }
}

export function buildPasswordResetEmail({ username, resetLink }) {
    return {
        subject: "Reset your password",
        html: wrap("Reset your password", `
          <p style="margin:0 0 8px">Hi ${username || "there"},</p>
          <p style="margin:0 0 12px">You requested a password reset. Click the button below to choose a new password.</p>
          <a href="${resetLink}" style="display:inline-block;background:#2F80ED;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Reset password</a>
          <p style="margin:16px 0 0;font-size:13px;color:#6b7280">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        `),
    }
}
