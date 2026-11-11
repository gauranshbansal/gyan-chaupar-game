# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.4.x   | :white_check_mark: |
| < 1.4   | :x:                |

## Cryptographic Integrity Verification

All releases of `Gyan-Chaupar.apk` distributed through this repository must match the official cryptographic hash:

- **SHA-256 Checksum:** `BC498A0449F7C327D17DC2C02E8968142A5216D5DA1815126C9C97F1DED011C8`
- Verify locally:
  ```bash
  Get-FileHash -Path assets/Gyan-Chaupar.apk -Algorithm SHA256
  ```

## Reporting Vulnerabilities

If you discover a security vulnerability within the APK or WebGL game runtime:
- Do **not** open a public issue.
- Please email the developer directly at **[gauranshbansal2205@gmail.com](mailto:gauranshbansal2205@gmail.com)**.
- You will receive an acknowledgment within 48 hours.
