import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'tereshchuk.max@gmail.com' },
    update: {},
    create: {
      email: 'tereshchuk.max@gmail.com',
      name: 'Max',
      password: 'password123',
    },
  })
  console.log('✅ Користувач знайдений або створений:', user.email)

  const event = await prisma.event.create({
    data: {
      title: 'Second Event',
      description: 'Second event description',
      date: new Date(),
      location: 'Kyiv',
      organizerId: user.id,
    },
  })
  console.log('✅ Подія додана успішно!')
}

main()
  .then(async () => {
    console.log('Сід завершено!')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ ПОМИЛКА:', e)
    await prisma.$disconnect()
    process.exit(1)
  })