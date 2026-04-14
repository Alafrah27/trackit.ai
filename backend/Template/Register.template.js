export const RegisterTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04); border: 1px solid #f3f4f6; }
        .header { background-color: #005bc1; padding: 40px 0; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 40px; text-align: center; color: #1f2937; }
        .content h2 { font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 16px; color: #111827; }
        .content p { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 32px; }
        .otp-container { background-color: #f0f6fc; border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #e1effe; }
        .otp-code { font-size: 42px; font-weight: 800; color: #005bc1; letter-spacing: 8px; margin: 0; font-family: monospace; }
        .footer { padding: 24px; text-align: center; font-size: 14px; color: #6b7280; background-color: #f9fafb; border-top: 1px solid #f3f4f6; }
        .icon-circle { width: 64px; height: 64px; background-color: rgba(255,255,255,0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .icon-circle svg { width: 32px; height: 32px; color: #ffffff; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon-circle">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
            </div>
            <h1>Trackit ai</h1>
        </div>
        <div class="content">
            <h2>Verify Your Email</h2>
            <p>Hi <strong>{username}</strong>,<br/>Welcome to Trackit ai! To activate your account and secure your personal data, please use the precise verification code below.</p>
            <div class="otp-container">
                <p class="otp-code">{Verifycode}</p>
            </div>
            <p>This code will expire securely in 1 minutes. If you did not request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2026 Trackit ai. All rights reserved.<br/>Secure, Smart, and Beautiful Tracking.</p>
        </div>
    </div>
</body>
</html>
`;
