'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LockIcon } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function LoginPage({ error }: { error?: string }) {
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the login logic
    console.log('Login attempted with password:', password)
    // Reset the password field after submission
    signIn('credentials', { password, callbackUrl: '/' });
    setPassword('')
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className={`w-full max-w-md bg-zinc-900 ${ error ? 'border-red-400' : 'border-zinc-800'}`}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-zinc-100">Hey Ethan, sign in</CardTitle>
          {error && <CardDescription className='text-center text-red-400'> did you really forget your password already...</CardDescription>}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-zinc-800 text-zinc-100 placeholder-zinc-400 items-center flex"
                  required
                />
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-zinc-800 hover:bg-zinc-600 text-zinc-100">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

