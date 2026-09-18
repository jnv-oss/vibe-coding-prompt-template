# CLI output contract

After the final `---`, append this fenced JSON block. It powers the `vibeworkflow` CLI, so use the exact stack and commands chosen:

```json
{
  "schemaVersion": 1,
  "documentType": "techdesign",
  "appName": "ClaimFinder",
  "stack": {
    "frontend": "[framework]",
    "backend": "none (static SPA)",
    "database": "none (curated JSON files in-repo)",
    "auth": "none",
    "styling": "Tailwind CSS",
    "deployment": "static host (Vercel/Netlify-style static build)"
  },
  "commands": {
    "setup": "[exact command]",
    "dev": "[exact command]",
    "test": "[exact command]",
    "typecheck": "[exact command]",
    "lint": "[exact command]",
    "build": "[exact command]"
  },
  "aiScope": "[none / in-app AI / automation / agent]"
}
```
