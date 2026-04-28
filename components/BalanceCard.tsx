'use client'

import { useState } from 'react'
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface BalanceCardProps {
  monthlyBudget: number
  totalSpentMonth: number
  totalSpentToday: number
}

export default function BalanceCard({ 
  monthlyBudget, 
  totalSpentMonth, 
  totalSpentToday 
}: BalanceCardProps) {
  const [isHidden, setIsHidden] = useState(true)
  const remaining = monthlyBudget - totalSpentMonth

  return (
    <div className="glass p-6 rounded-3xl relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-xl shadow-blue-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-blue-100 text-sm font-medium mb-1">Sisa Saldo Bulanan</p>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              {isHidden ? 'Rp ••••••••' : `Rp ${remaining.toLocaleString('id-ID')}`}
            </h2>
            <button 
              onClick={() => setIsHidden(!isHidden)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isHidden ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
          <Wallet size={24} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
            <TrendingUp size={14} />
            <span>Anggaran</span>
          </div>
          <p className="font-semibold">
            {isHidden ? 'Rp ••••' : `Rp ${monthlyBudget.toLocaleString('id-ID')}`}
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
            <TrendingDown size={14} />
            <span>Hari Ini</span>
          </div>
          <p className="font-semibold">
            {isHidden ? 'Rp ••••' : `Rp ${totalSpentToday.toLocaleString('id-ID')}`}
          </p>
        </div>
      </div>
      
      {/* Decorative blobs */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
    </div>
  )
}
