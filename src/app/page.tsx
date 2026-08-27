import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Mystery Message</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        An anonymous feedback platform where you can receive candid, honest messages.
      </p>
      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="rounded-md bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
