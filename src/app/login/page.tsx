
import LoginPage from "@/components/login-page"
import { authOptions } from "@/utils/authOptions"
import { readFileSync, writeFileSync } from "fs"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import React from "react"

type SearchParams = {
	error?: string
	callbackUrl?: string
}

function hasSignedInBefore(){
	try  {
		const creds = readFileSync('credentials.json', 'utf-8');
		if(!creds || creds === '{}') return false;
		return true;
	} catch(err){
		// file didnt exist
		writeFileSync('credentials.json', '{}' );
		return false;
	}
}

export default async function Login({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const mySearchParams = await searchParams; 
	const session = await getServerSession(authOptions);
	const hasSignedIn = hasSignedInBefore();
	if(!hasSignedIn ) redirect('/register');
	if(Boolean(session)) redirect(mySearchParams.callbackUrl || '/');
	return <LoginPage error={mySearchParams.error}/>
};
