# BSMP Systems V1

Current command: `/staff verify`

Checks for the configured Owner, Moderator, or Admin role, generates a 10-minute verification code, privately returns it to the user, and logs the verification in `#staff-verification`.

Setup:
1. `npm install`
2. Copy `.env.example` to `.env`
3. Fill in the environment variables
4. `npm start`

Never commit `.env` or the Discord bot token.
