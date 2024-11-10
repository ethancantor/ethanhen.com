'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createAccount } from '@/actions/accounts'

export function AccountPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  async function handleSubmit(){
    console.log(username, password);
    setError(!await createAccount(username, password));  
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 sm:p-8">
      <Card className="w-full max-w-md bg-black border border-white/10 text-white shadow-2xl">
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">create an ethanhen.com account</CardTitle>
          {error &&<CardDescription className="text-sm text-red-400">Username already taken</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-1 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-zinc-200">username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              className={`bg-zinc-900 ${error ? 'border-red-400' : 'border-zinc-800'} text-white placeholder:text-zinc-400 focus:border-white focus:ring-white`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-zinc-200">password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400 focus:border-white focus:ring-white pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-zinc-800 focus:ring-white"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-zinc-400" />
                ) : (
                  <Eye className="h-4 w-4 text-zinc-400" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4 sm:px-6">
          <Button className="w-full bg-white text-black hover:bg-zinc-200 transition-colors text-sm sm:text-base py-2 sm:py-3" onClick={handleSubmit}>
            Create Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}