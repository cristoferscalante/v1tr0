"use client"

import { createContext, useContext, ReactNode } from "react"
import { useSession, signOut as nextSignOut } from "next-auth/react"

export type UserRole = "admin" | "client" | "team"

interface UserProfile {
  id: string
  email: string
  name: string | null
  role: UserRole
}

interface AuthContextType {
  user: import("next-auth").Session["user"] | null
  userRole: UserRole | null
  userProfile: UserProfile | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  const role = session?.user?.role
  const userRole: UserRole | null = role === "admin" || role === "team" || role === "client" ? role : null
  const userProfile: UserProfile | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? "",
        name: session.user.name ?? null,
        role: userRole ?? "client",
      }
    : null

  const signOut = async () => {
    await nextSignOut({ callbackUrl: "/" })
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        userRole,
        userProfile,
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
