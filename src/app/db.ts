import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis';


const prismaClientSingleton = () => {
  return new PrismaClient()
}

const redisClientSingleton = () => {
  return createClient({
    url: process.env.REDIS_URL,
  });
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
  var redisGrobal: undefined | ReturnType<typeof redisClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
const redis = globalThis.redisGrobal ?? redisClientSingleton()

export default prisma
export { redis }

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
if (process.env.NODE_ENV !== 'production') globalThis.redisGrobal = redis