'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import BalanceCard from '@/components/BalanceCard'
import { Profile, Expense } from '@/lib/types'
import { 
  Utensils, 
  Car, 
  Receipt, 
  AlertCircle, 
  Heart, 
  Coffee,
  ChevronRight,
  Plus,
  Settings,
  X,
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

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [stats, setStats] = useState({ today: 0, month: 0 })
  const [loading, setLoading] = useState(true)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [newBudget, setNewBudget] = useState('')

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileData) {
      setProfile(profileData as Profile)
      setNewBudget(profileData.monthly_budget?.toString() || '')
    }

    // Fetch Recent Expenses
    const { data: expenseData } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    
    setExpenses((expenseData as Expense[]) || [])

    // Calculate Stats
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const { data: todayData } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', user.id)
      .gte('created_at', startOfDay)
    
    const { data: monthData } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth)

    setStats({
      today: todayData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0,
      month: monthData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
    })

    setLoading(false)
  }, [])

  useEffect(() => {
    // To satisfy react-hooks/set-state-in-effect, we can use an async function inside
    const init = async () => {
      await fetchData()
    }
    init()
  }, [fetchData])

  const handleUpdateBudget = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ monthly_budget: Number(newBudget) })
      .eq('id', user.id)

    if (!error) {
      setIsBudgetModalOpen(false)
      fetchData()
    }
  }

  if (loading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 bg-slate-200 rounded-3xl w-full"></div>
      <div className="h-10 bg-slate-200 rounded-xl w-48"></div>
      <div className="space-y-2">
        {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-200 rounded-2xl w-full"></div>)}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Halo! 👋</h1>
          <p className="text-slate-500">Pantau pengeluaranmu hari ini.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsBudgetModalOpen(true)}
            className="p-3 glass rounded-2xl text-slate-600 hover:bg-slate-100"
          >
            <Settings size={20} />
          </button>
          <Link href="/input" className="md:hidden bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-200">
            <Plus size={24} />
          </Link>
        </div>
      </header>

      <BalanceCard 
        monthlyBudget={profile?.monthly_budget || 0}
        totalSpentMonth={stats.month}
        totalSpentToday={stats.today}
      />

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Transaksi Terakhir</h2>
          <Link href="/recap" className="text-blue-600 text-sm font-semibold flex items-center">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="glass p-8 rounded-3xl text-center">
              <p className="text-slate-400">Belum ada transaksi.</p>
            </div>
          ) : (
            expenses.map((item) => {
              const Icon = categoryIcons[item.category] || AlertCircle
              const colorClass = categoryColors[item.category] || 'bg-slate-100 text-slate-600'
              
              return (
                <div key={item.id} className="glass p-4 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{item.category}</h3>
                    <p className="text-xs text-slate-500">
                      {item.note || 'Tanpa catatan'} • {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      -Rp {Number(item.amount).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass w-full max-w-sm p-6 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Set Anggaran</h3>
              <button onClick={() => setIsBudgetModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Anggaran Bulanan (Rp)</label>
              <input 
                type="number"
                className="input-field text-2xl font-bold"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                autoFocus
              />
            </div>

            <button onClick={handleUpdateBudget} className="btn-primary w-full py-4 shadow-lg shadow-blue-200">
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
