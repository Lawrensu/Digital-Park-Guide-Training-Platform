import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


const STATIONS = [
    'Semenggoh Wildlife Centre',
    'Gunung Mulu National Park',
    'Kubah National Park',
    'Bako National Park',
];

const TEST_ADMINS = [
    { username: 'AdminFaruq', email: 'faruq.admin@sfc.gov.my' },
    { username: 'AdminHidayah', email: 'hidayah.admin@sfc.gov.my' },
    { username: 'AdminRaj', email: 'raj.admin@sfc.gov.my' },
    { username: 'AdminWeiLing', email: 'weiling.admin@sfc.gov.my' },
];

const TEST_GUIDES = [
    { username: 'Ahmad3821', email: 'ahmad.razali@sfc.gov.my', ic: '900101-13-1234', stationIndex: 0 },
    { username: 'Siti7462', email: 'siti.norbaya@sfc.gov.my', ic: '910215-13-5678', stationIndex: 0 },
    { username: 'Haziq1193', email: 'haziq.azman@sfc.gov.my', ic: '950303-13-9012', stationIndex: 1 },
    { username: 'Nurul4857', email: 'nurul.ain@sfc.gov.my', ic: '930408-13-3456', stationIndex: 1 },
    { username: 'Faizal2930', email: 'faizal.hamid@sfc.gov.my', ic: '880512-13-7890', stationIndex: 1 },
    { username: 'Priya6641', email: 'priya.nair@sfc.gov.my', ic: '920620-13-2345', stationIndex: 2 },
    { username: 'Kevin8874', email: 'kevin.ling@sfc.gov.my', ic: '960725-13-6789', stationIndex: 2 },
    { username: 'Amirah3315', email: 'amirah.zulkifli@sfc.gov.my', ic: '910830-13-0123', stationIndex: 3 },
    { username: 'Darren5502', email: 'darren.tan@sfc.gov.my', ic: '940904-13-4567', stationIndex: 3 },
    { username: 'Nadia7783', email: 'nadia.hassan@sfc.gov.my', ic: '891010-13-8901', stationIndex: 3 },
];


async function main() {
    const testPasswordHash = await bcrypt.hash('TestPass123!', 12);

    const createdStations = [];
    for (const name of STATIONS) {
        const station = await prisma.station.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        createdStations.push(station);
    }

    const primaryEmail = process.env.SEED_ADMIN_EMAIL;
    const primaryUsername = process.env.SEED_ADMIN_USERNAME;
    const primaryPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!primaryEmail || !primaryUsername || !primaryPassword) {
        console.warn('SEED_ADMIN_EMAIL / SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD not set — skipping primary admin');
    } else {
        const primaryHash = await bcrypt.hash(primaryPassword, 12);
        await prisma.user.upsert({
            where: { email: primaryEmail },
            update: {},
            create: {
                role: 'ADMIN',
                username: primaryUsername,
                email: primaryEmail,
                passwordHash: primaryHash,
                status: 'ACTIVE',
            },
        });
    }

    for (const admin of TEST_ADMINS) {
        await prisma.user.upsert({
            where: { email: admin.email },
            update: {},
            create: {
                role: 'ADMIN',
                username: admin.username,
                email: admin.email,
                passwordHash: testPasswordHash,
                status: 'ACTIVE',
            },
        });
    }

    for (const guide of TEST_GUIDES) {
        await prisma.user.upsert({
            where: { email: guide.email },
            update: {},
            create: {
                role: 'GUIDE',
                username: guide.username,
                email: guide.email,
                passwordHash: testPasswordHash,
                icPassportNumber: guide.ic,
                status: 'ACTIVE',
                stationId: createdStations[guide.stationIndex].id,
                startDate: new Date('2025-01-15'),
            },
        });
    }

    console.log('Seeded:');
    console.log(`  ${STATIONS.length} stations`);
    console.log(`  ${primaryEmail ? 1 : 0} primary admin (from env)`);
    console.log(`  ${TEST_ADMINS.length} test admins`);
    console.log(`  ${TEST_GUIDES.length} test guides`);
    console.log('Test password for all seeded test accounts: TestPass123!');
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
