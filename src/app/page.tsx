import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export default async function HomePage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to the E-commerce Store</h1>
      {user ? (
        <p>You are logged in as {user.email}</p>
      ) : (
        <p>You are not logged in. Please log in or sign up.</p>
      )}
    </div>
  )
}
