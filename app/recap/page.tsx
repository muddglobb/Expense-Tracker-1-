'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Expense } from '@/lib/types'
import { 
  ArrowLeft, 
  Utensils, 
  Car, 
  Receipt, 
  AlertCircle, 
  Heart, 
  Coffee,
  Calendar,
  Filter,
  LucideIcon
} from 'lucide-react'
import Link from 'next/link'

const categoryIcons: Record<string, LucideIcon> = {
  'Makanan': Utensils,
  'Transportasi': Car,
  'Tagihan': Receipt,
  'Pengeluaran Tak Terduga': AlertCircle,
  'Pacaran': Heart,
  'Cafe/Nongkrong/Jajan': Coffee,
}

const categoryColors: Record<string, string> = {
  'Makanan': 'bg-orange-100 text-orange-600',
  'Transportasi': 'bg-blue-100 text-blue-600',
  'Tagihan': 'bg-purple-100 text-purple-600',
  'Pengeluaran Tak Terduga': 'bg-red-100 text-red-600',
  'Pacaran': 'bg-pink-100 text-pink-600',
  'Cafe/Nongkrong/Jajan': 'bg-yellow-100 text-yellow-600',
}

interface GroupedExpenses {
  [date: string]: Expense[]
}

export default function RecapPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      setExpenses((data as Expense[]) || [])
      setLoading(false)
    }

    fetchExpenses()
  }, [])

  // Grouping by date
  const groupedExpenses = expenses.reduce((groups: GroupedExpenses, expense) => {
    const date = new Date(expense.created_at).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(expense)
    return groups
  }, {})

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Rekap Pengeluaran</h1>
        </div>
        <button className="p-3 glass rounded-2xl text-slate-600 hover:bg-slate-100">
          <Filter size={20} />
        </button>
      </header>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
              <div className="space-y-3">
                {[1,2].map(j => <div key={j} className="h-20 bg-slate-200 rounded-3xl w-full"></div>)}
              </div>
            </div>
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center space-y-4">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Calendar size={32} />
          </div>
          <p className="text-slate-500 font-medium">Belum ada riwayat transaksi.</p>
          <Link href="/input" className="text-blue-600 font-bold hover:underline inline-block">
            Mulai catat sekarang
          </Link>
        </div>
      ) : (
        Object.keys(groupedExpenses).map((date) => (
          <section key={date} className="space-y-3">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">{date}</h2>
            <div className="space-y-3">
              {groupedExpenses[date].map((item) => {
                const Icon = categoryIcons[item.category] || AlertCircle
                const colorClass = categoryColors[item.category] || 'bg-slate-100 text-slate-600'
                
                return (
                  <div key={item.id} className="glass p-5 rounded-2xl flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${colorClass}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{item.category}</h3>
                      <p className="text-sm text-slate-500">{item.note || '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-lg">
                        -Rp {Number(item.amount).toLocaleString('id-ID')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
