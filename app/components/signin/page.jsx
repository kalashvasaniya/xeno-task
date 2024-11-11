
import { auth, signIn, signOut } from "@/auth"
import { redirect } from "next/dist/server/api-utils";

export default async function SignIn() {
    const session = await auth();
    console.log(session)
    if (session) {
        return (
            <form
                action={async () => {
                    "use server"
                    await signOut()
                }}
            >
                <button type="submit">Signout</button>
            </form>
        )
    }
    return (
        <form
            action={async () => {
                "use server"
                await signIn("google", {redirectTo: "/Home"})
            }}
        >
            <button type="submit">Signin with Google</button>
        </form>
    )
} 