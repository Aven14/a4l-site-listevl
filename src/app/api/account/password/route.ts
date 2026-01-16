import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendPasswordChangeConfirmation } from '@/lib/email'

// Force cette route à être dynamique
export const dynamic = 'force-dynamic'

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

  // Envoyer un e-mail de confirmation
  if (currentUser.email) {
    try {
      await sendPasswordChangeConfirmation(
        currentUser.email,
        currentUser.username || undefined
      )
    } catch (error) {
      console.error('Erreur envoi e-mail confirmation:', error)
      // Ne pas faire échouer la requête si l'e-mail ne peut pas être envoyé
    }
  }

  return NextResponse.json({ success: true })
}
