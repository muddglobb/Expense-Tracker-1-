'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Utensils, 
  Car, 
  Receipt, 
  AlertCircle, 
  Heart, 
  Coffee,
  Check
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  { id: 'Makanan', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
  { id: 'Transportasi', icon: Car, color: 'bg-blue-100 text-blue-600' },
  { id: 'Tagihan', icon: Receipt, color: 'bg-purple-100 text-purple-600' },
  { id: 'Pengeluaran Tak Terduga', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
  { id: 'Pacaran', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { id: 'Cafe/Nongkrong/Jajan', icon: Coffee, color: 'bg-yellow-100 text-yellow-600' },
]

export default function InputPage() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        amount: Number(amount),
        category,
        note,
      })

    if (!error) {
      router.push('/')
      router.refresh()
    } else {
      alert('Gagal menyimpan: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Catat Pengeluaran</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass p-8 rounded-3xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-2">Nominal (Rp)</label>
            <input
              type="number"
              inputMode="numeric"
              className="w-full text-5xl font-bold bg-transparent border-none focus:outline-none placeholder:text-slate-200"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Pilih Kategori</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isSelected = category === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50 text-blue-600 scale-95' 
                      : 'border-transparent glass text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${cat.color} ${isSelected ? 'scale-110' : ''} transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-semibold text-center">{cat.id}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Catatan (Opsional)</h2>
          <textarea
            className="input-field min-h-[100px]"
            placeholder="Makan siang bakso, bayar parkir, dll..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-5 text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
          disabled={loading || !amount || !category}
        >
          {loading ? 'Menyimpan...' : (
            <>
              <Check size={24} />
              Simpan Transaksi
            </>
          )}
        </button>
      </form>
    </div>
  )
}
