# API Assets

## certificate_template.pdf

Place the Figma-exported certificate PDF template here with filename `certificate_template.pdf`.

If the file is missing at runtime, the certification controller falls back to generating a blank A4 landscape PDF and overlays dynamic fields on it. This keeps the flow testable before the design is finalised.

Dynamic fields overlaid by `pdf-lib`:
- Guide name
- Module title
- Issue date
- Expiry date (optional)
- Issuer name + title
- Company name
- QR code (linking to `/api/certifications/verify/:id`)
- Certification ID

## badges/

Badge PNG/WebP images uploaded via the admin UI are stored in S3, not in this folder. The `Badge.imageS3Key` column references those objects.
