import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

//! Do not change the path, made for seed.ts
import { PrismaClient } from '../generated/prisma/client'

const isProduction = process.env.NODE_ENV === 'production'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)

export const prisma = new PrismaClient({
	adapter,
	log: isProduction ? ['warn', 'error'] : ['info', 'warn', 'error'],
	errorFormat: 'pretty',
})
