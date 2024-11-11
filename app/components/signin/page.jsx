import { auth, signIn, signOut } from "../../../auth";

export default async function SignIn() {
  const session = await auth();

  if (session) {
    return (
      <div className="relative group">
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
              text-gray-700 hover:text-red-600 hover:bg-red-50
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg
              className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative group">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/Home" });
        }}
      >
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 rounded-full
            bg-white text-sm font-medium text-gray-700
            border border-gray-200 hover:border-blue-500
            hover:bg-blue-50 hover:text-blue-600
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            shadow-sm"
        >
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Hover Effect */}
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 blur group-hover:opacity-20 transition-opacity duration-200" />
      </form>
    </div>
  );
}