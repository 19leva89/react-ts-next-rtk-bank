const { PrismaClient } = require('./app/generated/prisma/client');

const prisma = new PrismaClient();

module.exports = { prisma }