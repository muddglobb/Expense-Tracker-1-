'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Wallet } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://expense-tracker-1-eight.vercel.app/',
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Supabase auto-logins after signup or requires email verification depending on config
      // For simplicity in this demo, we assume success or check for session
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass w-full max-w-md p-8 rounded-3xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl mb-4 text-white">
            <Wallet size={32} />
          </div>
          <h1 className="text-2xl font-bold">Daftar Akun</h1>
          <p className="text-slate-500">Mulai kelola pengeluaran Anda hari ini</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 ml-1">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ml-1">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Min. 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full py-4 mt-2"
            disabled={loading}
          >
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
