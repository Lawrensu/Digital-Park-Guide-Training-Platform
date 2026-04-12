import { PrismaClient } from '../../generated/prisma/index.js';

// single instance across the whole app — don't new PrismaClient() anywhere else
const prisma = new PrismaClient();

export default prisma;
