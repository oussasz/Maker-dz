import React, { useEffect } from 'react'

const Modal = ({children, open, onClose}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    
    if (open) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className='fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-sm bg-black/50'
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative mx-4 max-h-[90vh] overflow-auto bg-white rounded-lg shadow-lg p-6 custom-scrollbar">
        {children}
      </div>
    </div>
  )
}

export default Modal