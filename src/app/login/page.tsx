import { LoginPage } from "@/components/login-page"
import { authOptions } from "@/utils/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import React from "react"

type SearchParams = {
	error?: string
	callbackUrl?: string
}

export default async function Login({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const mySearchParams = await searchParams; 
	const session = await getServerSession(authOptions);
	if(Boolean(session)) redirect('/');
	return <LoginPage error={mySearchParams.error}/>
};
