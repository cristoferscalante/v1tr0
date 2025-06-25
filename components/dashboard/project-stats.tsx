"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Activity, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export function ProjectStats() {
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Activity className="h-10 w-10 text-highlight" />
            <div>
              <p className="text-sm font-medium text-textMuted">Proyectos Activos</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Clock className="h-10 w-10 text-highlight" />
            <div>
              <p className="text-sm font-medium text-textMuted">En Progreso</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <div>
              <p className="text-sm font-medium text-textMuted">Completados</p>
              <h3 className="text-2xl font-bold">45</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
            <div>
              <p className="text-sm font-medium text-textMuted">Pendientes</p>
              <h3 className="text-2xl font-bold">4</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
