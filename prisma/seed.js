const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Créer les rôles système
  const superadminRole = await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: {},
    create: {
      name: 'superadmin',
      canAccessAdmin: true,
      canEditBrands: true,
      canEditVehicles: true,
      canDeleteBrands: true,
      canDeleteVehicles: true,
      canImport: true,
      canManageUsers: true,
      canManageRoles: true,
      isSystem: true,
    },
  })

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      canAccessAdmin: true,
      canEditBrands: true,
      canEditVehicles: true,
      canDeleteBrands: true,
      canDeleteVehicles: true,
      canImport: true,
      canManageUsers: false,
      canManageRoles: false,
      isSystem: true,
    },
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      canAccessAdmin: false,
      canEditBrands: false,
      canEditVehicles: false,
      canDeleteBrands: false,
      canDeleteVehicles: false,
      canImport: false,
      canManageUsers: false,
      canManageRoles: false,
      isSystem: true,
    },
  })

  // Créer le superadmin
  const hashedPassword = await bcrypt.hash('superadmin123', 10)
  await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: { roleId: superadminRole.id },
    create: {
      username: 'superadmin',
      email: 'superadmin@a4l.com',
      password: hashedPassword,
      roleId: superadminRole.id,
    },
  })

  // Créer un admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { roleId: adminRole.id },
    create: {
      username: 'admin',
      email: 'admin@a4l.com',
      password: adminPassword,
      roleId: adminRole.id,
    },
  })

  console.log('Seed terminé!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
