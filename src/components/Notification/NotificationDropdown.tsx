import React, { useRef, useEffect } from "react"
import { Bell, Trash2, CheckCheck, X } from "lucide-react"
import { useNotifications } from "./NotificationContext"

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications()

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "hace un momento"
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} h`
    if (seconds < 604800) return `hace ${Math.floor(seconds / 86400)} d`
    return date.toLocaleDateString("es-CR")
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "solicitud":
        return <Bell className="w-4 h-4 text-white" />
      case "warning":
        return <Bell className="w-4 h-4 text-white" />
      case "info":
        return <Bell className="w-4 h-4 text-white" />
      case "success":
        return <Bell className="w-4 h-4 text-white" />
      default:
        return <Bell className="w-4 h-4 text-white" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "solicitud":
        return "bg-[#5B732E]"
      case "warning":
        return "bg-[#5B732E]"
      case "info":
        return "bg-[#5B732E]"
      case "success":
        return "bg-[#5B732E]"
      default:
        return "bg-[#5B732E]"
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNotificationClick = (id: string) => {
    markAsRead(id)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#33361D] hover:text-[#5B732E] transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#5B732E] text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[600px] rounded-lg bg-white shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-[#f7f8f5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#5B732E]" />
                <h3 className="font-semibold text-[#33361D] text-sm">Notificaciones</h3>
                {unreadCount > 0 && <span className="text-xs text-[#5B732E] font-medium">({unreadCount})</span>}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="flex gap-2 mt-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#5B732E] hover:underline font-medium flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Marcar todas
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-red-600 hover:underline font-medium flex items-center gap-1 ml-auto"
                >
                  <Trash2 className="w-3 h-3" />
                  Limpiar
                </button>
              </div>
            )}
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No hay notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-[#F8F9F3] transition-colors cursor-pointer group ${
                    !notification.read ? "bg-[#FEF6E0]/30" : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && <div className="w-2 h-2 rounded-full bg-[#5B732E] mt-1.5 flex-shrink-0" />}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <h4 className="font-semibold text-sm text-[#33361D]">{notification.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="text-gray-300 hover:text-red-600 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                      <p className="text-xs text-gray-400">{getTimeAgo(notification.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
