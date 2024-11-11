
import { auth, signIn, signOut } from "@/auth"

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
                await signIn("google")
            }}
        >
            <button type="submit">Signin with Google</button>
        </form>
    )
} 