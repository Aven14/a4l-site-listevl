'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    const res = await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirect: false,
    })

    if (res?.error) {
      setError('Identifiants incorrects')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="font-display font-bold text-white text-2xl">A4L</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Connexion</h1>
            <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm mb-2">Nom d&apos;utilisateur</label>
              <input
                type="text"
                name="username"
                required
                className="w-full bg-dark-300 border border-gray-700 rounded-lg px-4 py-3 text-white
                         focus:border-green-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Mot de passe</label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-dark-300 border border-gray-700 rounded-lg px-4 py-3 text-white
                         focus:border-green-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Pas de compte ?{' '}
            <Link href="/auth/register" className="text-green-400 hover:text-green-300">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
