'use client'

import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        fetch('/api/auth/logout', { method: 'POST' }).then(() => {
          window.location.href = '/login'
        })
      }}
      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
    >
      <LogOut size={16} /> Salir
    </button>
  )
}
