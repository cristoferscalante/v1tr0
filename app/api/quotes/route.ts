import { auth } from "@/auth"
import { db } from "@/lib/db"
import { quotes } from "@/lib/db/schema"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await req.json()
  const { projectType, description, budget, timeline, techReqs } = body

  if (!projectType || !description) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
  }

  await db.insert(quotes).values({
    profileId: session.user.id,
    projectType,
    description,
    budget: budget || null,
    timeline: timeline || null,
    techReqs: techReqs || null,
  })

  return NextResponse.json({ success: true })
}
