import React, { useEffect } from 'react'
import './Toast.scss'

export const Toast = ({ isOpen, message, type = 'error', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, duration])

  if (!isOpen) return null

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__content">
        <span className="toast__message">{message}</span>
        <button className="toast__close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  )
}
