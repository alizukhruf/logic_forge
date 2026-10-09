import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function SelectField({ id, value, options, placeholder, onChange }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)
  const selectedIndex = options.indexOf(value)

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = event => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [open])

  const choose = index => {
    onChange(options[index])
    setOpen(false)
  }

  const handleKeyDown = event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
      } else {
        setActiveIndex(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
      }
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
      } else if (activeIndex >= 0) {
        choose(activeIndex)
      }
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-activedescendant={open && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        onClick={() => {
          setOpen(isOpen => !isOpen)
          setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
        }}
        onKeyDown={handleKeyDown}
        className="field flex cursor-pointer items-center justify-between text-left"
      >
        <span className={value ? '' : 'text-white/60'}>{value || placeholder}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      {open && (
        <ul
          id={`${id}-options`}
          role="listbox"
          aria-label={placeholder}
          className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-white/20 bg-[#0B0720] p-1 text-white shadow-2xl"
        >
          {options.map((option, index) => (
            <li
              key={option}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={value === option}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(index)}
              className={`cursor-pointer rounded-lg px-3 py-2 ${activeIndex === index ? 'bg-electric text-white' : 'hover:bg-white/10'}`}
            >
              {option || placeholder}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
