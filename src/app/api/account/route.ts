import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email && !session?.user?.name) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { username, email } = await req.json()

  // Trouver l'utilisateur actuel
  const currentUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: session.user.email },
        { username: session.user.name },
      ],
    },
  })

  if (!currentUser) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
  }

  // Vérifier si le nouveau username/email est déjà pris
  if (username !== currentUser.username) {
    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) {
      return NextResponse.json({ error: 'Ce nom d\'utilisateur est déjà pris' }, { status: 400 })
    }
  }

  if (email !== currentUser.email) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 })
    }
  }

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { username, email },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email && !session?.user?.name) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const currentUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: session.user.email },
        { username: session.user.name },
      ],
    },
    include: { role: true },
  })

  if (!currentUser) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
  }

  // Empêcher la suppression d'un superadmin
  if (currentUser.role?.name === 'superadmin') {
    return NextResponse.json({ error: 'Impossible de supprimer un superadmin' }, { status: 403 })
  }

  await prisma.user.delete({ where: { id: currentUser.id } })

  return NextResponse.json({ success: true })
}
