'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function LoginPage({ error }: { error?: string }) {
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility(){
    setShowPassword(!showPassword);
  }

  async function handleFormSubmit(e: FormData) {
    const password = e.get('password');
    await signIn('credentials', { password, callbackUrl: '/'})
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`w-full h-full max-w-md ${error ? 'border border-red-400' : ''} rounded-lg px-2 py-2 flex flex-col gap-4`}>
        <div className={``}>
          <h1 className={`text-zinc-100 text-2xl font-bold`}>Hey Ethan, Sign in!</h1>
          {error && <h2 className={'text-red-400 text-base'}>did you really forget your password already...</h2>}
        </div>
        <form action={handleFormSubmit} className={`flex flex-col gap-2 items-center`}>
          <div className={'flex flex-col w-full relative'}>
            <input id={'password'}
                   name={'password'}
                   type={showPassword ? 'text' : 'password'}
                   placeholder={'password'}
                   className={'text-zinc-200 placeholder:text-zinc-400 px-3 py-1 rounded-lg bg-zinc-800 ' +
                       'focus:ring-0 focus:outline-0 focus:border-0 hover:bg-zinc-700 items-center text-start flex'}
                   required
            />
            <button className={`absolute right-0 top-0 h-full px-3 py-2`}
                    onClick={togglePasswordVisibility}
                    type={'button'}
            >
              {showPassword ? (
                  <EyeOff className="h-4 w-4 text-zinc-400"/>
              ) : (
                  <Eye className="h-4 w-4 text-zinc-400"/>
              )}
            </button>
          </div>
          <button
              className={`text-zinc-200 hover:text-zinc-100 bg-zinc-800 rounded-lg w-fit px-4 py-1 hover:bg-zinc-700`}
              type={'submit'}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

