import { auth } from "@/auth"
import { db } from "@/lib/db"
import { meetingRequests, profiles, projects } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function MeetingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const meetings = await db
    .select({
      id: meetingRequests.id,
      title: meetingRequests.title,
      description: meetingRequests.description,
      preferredDate: meetingRequests.preferredDate,
      status: meetingRequests.status,
      createdAt: meetingRequests.createdAt,
      clientEmail: profiles.email,
      projectName: projects.name,
    })
    .from(meetingRequests)
    .leftJoin(profiles, eq(meetingRequests.profileId, profiles.id))
    .leftJoin(projects, eq(meetingRequests.projectId, projects.id))
    .orderBy(desc(meetingRequests.createdAt))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Solicitudes de Reunión</h1>
      <div className="grid gap-4">
        {meetings.map((m) => (
          <div key={m.id} className="bg-black/40 backdrop-blur-sm border border-[#08A696]/20 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{m.title}</h3>
                <p className="text-sm text-gray-400">{m.clientEmail}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                m.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                m.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                m.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                "bg-red-500/20 text-red-400"
              }`}>{m.status}</span>
            </div>
            {m.description && <p className="text-gray-300 text-sm mb-2">{m.description}</p>}
            <div className="flex gap-4 text-xs text-gray-400">
              {m.preferredDate && <span>Preferida: {m.preferredDate.toLocaleDateString()}</span>}
              {m.projectName && <span>Proyecto: {m.projectName}</span>}
            </div>
          </div>
        ))}
        {meetings.length === 0 && (
          <p className="text-center text-gray-500 py-12">No hay solicitudes de reunión</p>
        )}
      </div>
    </div>
  )
}
