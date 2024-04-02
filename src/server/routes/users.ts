import { defineEventHandler } from 'h3';
import { prisma } from '../prisma';

export default defineEventHandler(async () => await prisma.user.findMany());
