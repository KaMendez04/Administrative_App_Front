import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AddNotificationType, NotificationContextType, Notification } from "../../models/notification/Notification"
import { toast } from "sonner"
import { Bell, AlertCircle, Info, CheckCircle } from "lucide-react"

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem("app_notifications")
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type,
          timestamp: new Date(n.timestamp),
          read: n.read,
        }))
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
    return []
  })

  useEffect(() => {
    try {
      localStorage.setItem("app_notifications", JSON.stringify(notifications))
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }, [notifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getToastIcon = (type: string) => {
    switch (type) {
      case "solicitud":
        return <Bell className="w-5 h-5 text-white" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-white" />
      case "info":
        return <Info className="w-5 h-5 text-white" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-white" />
      default:
        return <Bell className="w-5 h-5 text-white" />
    }
  }

  const getToastColor = (type: string) => {
    switch (type) {
      case "solicitud":
        return "bg-[#5B732E]"
      case "warning":
        return "bg-amber-500"
      case "info":
        return "bg-blue-500"
      case "success":
        return "bg-emerald-500"
      default:
        return "bg-[#5B732E]"
    }
  }

  const getToastBorderColor = (type: string) => {
    switch (type) {
      case "solicitud":
        return "border-[#5B732E]"
      case "warning":
        return "border-amber-500"
      case "info":
        return "border-blue-500"
      case "success":
        return "border-emerald-500"
      default:
        return "border-[#5B732E]"
    }
  }

  const addNotification = (notification: AddNotificationType) => {
    console.log("🔔 Agregando notificación:", notification)
    
    const newNotification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => {
      console.log("📋 Notificaciones previas:", prev.length)
      console.log("📋 Nuevas notificaciones:", [...prev, newNotification].length)
      return [newNotification, ...prev]
    })

    console.log("🔔 Mostrando toast...")
    
    toast.custom(
      () => (
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-[#5B732E] p-3 flex items-start gap-3 min-w-[320px]">
          <Bell className="w-4 h-4 text-[#5B732E] mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[#33361D] mb-0.5 text-sm">{notification.title}</div>
            <div className="text-sm text-gray-600">{notification.message}</div>
          </div>
        </div>
      ),
      {
        duration: 4000,
        position: "top-right",
      },
    )
    
    console.log("✅ Toast mostrado")
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications debe usarse dentro de NotificationProvider")
  }
  return context
}