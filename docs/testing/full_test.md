# API Test Files

Thunder Client compatible HTTP request files for testing the SFC backend.

## Setup

1. Install Thunder Client extension in VS Code
2. Start Postgres: `docker-compose up postgres -d`
3. Run migrations: `pnpm --filter api exec prisma migrate dev`
4. Run seed: `pnpm --filter api exec prisma db seed`
5. Start the API: `pnpm --filter api dev`

## How to use

Open any `.http` file in VS Code. Thunder Client renders each `###` block as a clickable request. Copy IDs and tokens from responses into `thunder-environment.json` as you go through the numbered files in order.

The `adminToken` comes from the login response in `02-auth.http`. The `guideToken` is obtained after approving a registration and setting the guide password.

## What is skipped

- Actual S3 uploads (presign endpoint tested for auth and validation only)
- BillPlz payment flow (requires live credentials)
- Email delivery (endpoints run but email will not be sent without SES configured)

## Notes

- IoT ingest in `14-iot-alerts.http` requires an IoTDevice row in the DB. Create one manually in the DB or via a seed before testing.
- The `internalSecret` variable must match INTERNAL_SECRET in `apps/api/.env`.
- Requests within a file are independent; copy IDs between files using the environment variables.
