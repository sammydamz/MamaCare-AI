# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# architecture
- Use LangChain as the orchestration layer to connect ElevenLabs voice agents, Gemini triage pipeline, and database operations together. Confidence: 0.72

# style
- Never use em dashes (—). Confidence: 0.70

# theme
- Use light mode as the default theme. Confidence: 0.65

# database
- Use the p-prenatal-{timestamp}-{n} format for patient IDs instead of simple p001-n format. Confidence: 0.70

# ui
- Preserve the full voice triage UI with waveform, status ring, audio meters, transcript panel, and feedback buttons; do not strip down or replace the ElevenLabs conversation interface. Confidence: 0.82

# git
- Use `gh` (GitHub CLI) instead of HTTPS authentication for git push operations. Confidence: 0.65

# database
- Each user should have isolated/private data (own seed or empty state); do not use client-side email checks or hardcoded server-side email middleware to gate shared data. Confidence: 0.77

# cli
- Use `railway up` instead of `railway deploy` for deploying to Railway. Confidence: 0.72

