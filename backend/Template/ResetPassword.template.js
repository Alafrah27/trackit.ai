export const ResetPasswordTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04); border: 1px solid #f3f4f6; }
        .header { background-color: #dc2626; padding: 40px 0; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 40px; text-align: center; color: #1f2937; }
        .content h2 { font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 16px; color: #111827; }
        .content p { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 32px; }
        .otp-container { background-color: #fef2f2; border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #fecaca; }
        .otp-code { font-size: 42px; font-weight: 800; color: #dc2626; letter-spacing: 8px; margin: 0; font-family: monospace; }
        .footer { padding: 24px; text-align: center; font-size: 14px; color: #6b7280; background-color: #f9fafb; border-top: 1px solid #f3f4f6; }
        .icon-circle { width: 64px; height: 64px; background-color: rgba(255,255,255,0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .icon-circle svg { width: 32px; height: 32px; color: #ffffff; }
        .warning { font-size: 13px; color: #9ca3af; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon-circle">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>
            <h1>Trackit ai</h1>
        </div>
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hi <strong>{username}</strong>,<br/>We received a request to reset your password. Use the code below to set a new one.</p>
            <div class="otp-container">
                <p class="otp-code">{resetCode}</p>
            </div>
            <p>This code will expire in <strong>5 minutes</strong>. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            <p class="warning">⚠️ Never share this code with anyone. Trackit ai staff will never ask for your verification code.</p>
        </div>
        <div class="footer">
            <p>&copy; 2026 Trackit ai. All rights reserved.<br/>Secure, Smart, and Beautiful Tracking.</p>
        </div>
    </div>
</body>
</html>
`;
