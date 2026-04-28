'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import { Lock, Wallet } from 'lucide-react'
import { User } from '@supabase/supabase-js'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [pinVerified, setPinVerified] = useState(false)
  const [userPin, setUserPin] = useState<string | null>(null)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  const [isSettingUpPin, setIsSettingUpPin] = useState(false)
  
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
          router.push('/login')
        }
        setLoading(false)
        return
      }

      setUser(session.user)

      // Check for PIN in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('pin')
        .eq('id', session.user.id)
        .single()

      if (!profile?.pin) {
        setIsSettingUpPin(true)
      } else {
        setUserPin(profile.pin)
        // Check if already verified in this session
        const verified = sessionStorage.getItem('pin_verified') === 'true'
        setPinVerified(verified)
      }
      
      setLoading(false)
    }

    checkUser()
  }, [pathname, router])

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pinInput === userPin) {
      setPinVerified(true)
      sessionStorage.setItem('pin_verified', 'true')
    } else {
      setPinError(true)
      setPinInput('')
      setTimeout(() => setPinError(false), 1000)
    }
  }

  const handleSetupPin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pinInput.length < 4 || !user) return

    const { error } = await supabase
      .from('profiles')
      .update({ pin: pinInput })
      .eq('id', user.id)

    if (!error) {
      setUserPin(pinInput)
      setPinVerified(true)
      setIsSettingUpPin(false)
      sessionStorage.setItem('pin_verified', 'true')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="bg-blue-600 p-4 rounded-2xl text-white mb-4">
            <Wallet size={40} />
          </div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Allow auth pages without PIN check
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return <>{children}</>
  }

  if (!user) return null

  // Setup PIN Screen
  if (isSettingUpPin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <div className="glass w-full max-w-md p-8 rounded-3xl text-center">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Buat PIN Baru</h2>
          <p className="text-slate-500 mb-8">Gunakan PIN ini untuk masuk ke aplikasi di sesi berikutnya.</p>
          
          <form onSubmit={handleSetupPin}>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full text-center text-4xl tracking-[1em] p-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 mb-6"
              placeholder="••••"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-primary w-full py-4">
              Simpan PIN
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Lock Screen (PIN Entry)
  if (!pinVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <div className="glass w-full max-w-md p-8 rounded-3xl text-center">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Masukkan PIN</h2>
          <p className="text-slate-500 mb-8">Konfirmasi identitas Anda untuk melanjutkan.</p>
          
          <form onSubmit={handleVerifyPin}>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              className={`w-full text-center text-4xl tracking-[1em] p-4 bg-white border rounded-2xl focus:outline-none transition-all mb-6 ${
                pinError ? 'border-red-500 animate-shake bg-red-50' : 'border-slate-200 focus:border-blue-500'
              }`}
              placeholder="••••"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-primary w-full py-4">
              Masuk
            </button>
          </form>
          
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
            className="mt-6 text-slate-400 hover:text-slate-600 font-medium"
          >
            Ganti Akun
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
