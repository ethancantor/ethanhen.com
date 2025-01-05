'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import {createAccount} from "@/actions/accounts";

export function AccountPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  async function handleSubmit(e: FormData){
    const password = e.get('password') as string;
    if(!password) return;
    await createAccount(password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className={`w-full h-full max-w-md flex flex-col gap-4`}>
        <h1 className={`text-zinc-100 text-3xl`}>Hey Ethan, set your password</h1>
        <form action={handleSubmit} className={`flex flex-col gap-2 items-center`}>
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
                  <EyeOff className="h-4 w-4 text-zinc-400" />
              ) : (
                  <Eye className="h-4 w-4 text-zinc-400" />
              )}
            </button>
          </div>
          <button className={`text-zinc-200 hover:text-zinc-100 bg-zinc-800 rounded-lg w-fit px-4 py-1 hover:bg-zinc-700`}
                  type={'submit'}
          >
            Submit</button>
        </form>
      </div>
    </div>
  )
}