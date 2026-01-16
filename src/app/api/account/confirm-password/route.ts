import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordChangeConfirmation } from '@/lib/email'

// Force cette route à être dynamique
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const token = searchParams.get('token')
  
  // Utiliser l'origine de la requête sans port pour éviter les erreurs SSL
  const origin = req.nextUrl.origin

  if (!token) {
    return NextResponse.redirect(`${origin}/account?error=token-manquant`)
  }

  // Trouver l'utilisateur avec ce token
  const user = await prisma.user.findFirst({
    where: {
      passwordChangeToken: token,
    },
  })

  if (!user) {
    return NextResponse.redirect(`${origin}/account?error=token-invalide`)
  }

  // Vérifier si le token est expiré
  if (!user.passwordChangeExpires || new Date() > user.passwordChangeExpires) {
    // Nettoyer les données expirées
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordChangeToken: null,
        passwordChangeExpires: null,
        passwordChangePending: null,
      },
    })
    return NextResponse.redirect(`${origin}/account?error=token-expire`)
  }

  // Vérifier qu'il y a un nouveau mot de passe en attente
  if (!user.passwordChangePending) {
    return NextResponse.redirect(`${origin}/account?error=demande-invalide`)
  }

  // Appliquer le changement de mot de passe
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: user.passwordChangePending, // Utiliser le nouveau mot de passe hashé
      passwordChangeToken: null,
      passwordChangeExpires: null,
      passwordChangePending: null, // Nettoyer après utilisation
    },
  })

  // Envoyer un e-mail de confirmation finale
  if (user.email) {
    try {
      await sendPasswordChangeConfirmation(
        user.email,
        user.username || undefined
      )
    } catch (error) {
      console.error('Erreur envoi e-mail confirmation finale:', error)
      // Ne pas faire échouer la confirmation si l'e-mail ne peut pas être envoyé
    }
  }

  return NextResponse.redirect(`${origin}/account?password-changed=true`)
}
