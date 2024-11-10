import { LoginPage } from "@/components/login-page"
import React from "react"

type SearchParams = {
	error?: string
	callbackUrl?: string
}

export default async function Login({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const mySearchParams = await searchParams; 
	return <LoginPage error={mySearchParams.error}/>
};
