"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Toast {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "info"
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg border max-w-sm animate-in slide-in-from-right-full ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{toast.title}</h4>
              {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
            </div>
            <button onClick={() => onRemove(toast.id)} className="ml-4 text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
