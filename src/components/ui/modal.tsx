import React from "react"

interface ModalProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export function Modal({ open, onClose, children }: ModalProps) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto relative max-h-[90vh] overflow-hidden">
                <button
                    className="absolute top-2 right-2 text-gray-500 text-2xl font-bold z-10 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <div className="p-4 overflow-y-auto max-h-[calc(90vh-2rem)]">
                    {children}
                </div>
            </div>
        </div>
    )
} 