'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export function LoginPage({ error }: { error?: string }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the login logic
    signIn('credentials', { username, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className={`w-full max-w-md px-6 py-4 space-y-2 rounded-xl shadow-2xl border ${error ? 'border-red-500' : 'border-white/10'}`}>
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold text-white">ethanhen.com</h2>
          <Link href="/register" className="w-full text-white font-semibold px-2 py-1 rounded-lg">Create an Account</Link>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="mt-1 bg-zinc-800 border-zinc-700 text-white focus:ring-white focus:border-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white pr-10 focus:ring-white focus:border-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-semibold">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}