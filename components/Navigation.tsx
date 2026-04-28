'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, PieChart, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Navigation() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const navItems = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Tambah', href: '/input', icon: PlusCircle },
    { name: 'Rekap', href: '/recap', icon: PieChart },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen glass fixed left-0 top-0 z-50 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <PlusCircle size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Expense</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-200 space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass rounded-2xl z-50 flex items-center justify-around px-4 shadow-xl border-white/40">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-400'
              }`}
            >
              <Icon size={24} />
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-slate-400"
        >
          <LogOut size={24} />
        </button>
      </nav>
    </>
  )
}
