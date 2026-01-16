import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email && !session?.user?.name) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { currentPassword, newPassword } = await req.json()

  const currentUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: session.user.email },
        { username: session.user.name },
      ],
    },
  })

  if (!currentUser || !currentUser.password) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
  }

  // Vérifier le mot de passe actuel
  const isValid = await bcrypt.compare(currentPassword, currentUser.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 })
  }

  // Hasher et mettre à jour le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: currentUser.id },
    data: { password: hashedPassword },
  })

  return NextResponse.json({ success: true })
}
