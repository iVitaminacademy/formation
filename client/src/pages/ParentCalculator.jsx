import { useState } from 'react'
import ParentLayout from '../components/ParentLayout'

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
]

function evaluate(expression) {
  try {
    // Replace display characters with JS operators
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/,/g, '')

    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${sanitized})`)()
    if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
      return 'Error'
    }
    // Format: limit to 10 significant digits
    return Number.isInteger(result)
      ? result.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : parseFloat(result.toPrecision(10)).toLocaleString('en-US', { maximumFractionDigits: 8 })
  } catch {
    return 'Error'
  }
}

export default function ParentCalculator() {
  const [display, setDisplay] = useState('0')
  const [history, setHistory] = useState('')
  const [justEvaluated, setJustEvaluated] = useState(false)

  const handleButton = (btn) => {
    if (btn === 'C') {
      setDisplay('0')
      setHistory('')
      setJustEvaluated(false)
      return
    }

    if (btn === '⌫') {
      if (justEvaluated) {
        setDisplay('0')
        setHistory('')
        setJustEvaluated(false)
        return
      }
      const next = display.length > 1 ? display.slice(0, -1) : '0'
      setDisplay(next)
      setHistory(prev => prev.length > 1 ? prev.slice(0, -1) : '')
      return
    }

    if (btn === '±') {
      if (display === '0' || display === 'Error') return
      setDisplay(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev))
      return
    }

    if (btn === '%') {
      if (display === 'Error') return
      const val = parseFloat(display.replace(/,/g, ''))
      if (Number.isNaN(val)) return
      const result = (val / 100).toString()
      setDisplay(result)
      setHistory(result)
      return
    }

    // Operators
    if (['+', '−', '×', '÷'].includes(btn)) {
      if (display === 'Error') {
        setDisplay('0')
        setHistory('')
      }
      const raw = display.replace(/,/g, '')
      // If just evaluated, start new expression from result
      if (justEvaluated) {
        setHistory(raw + ' ' + btn + ' ')
        setDisplay('0')
        setJustEvaluated(false)
        return
      }
      // Replace trailing operator if last char is one
      const cleaned = history.replace(/[+\−×÷]\s*$/, '')
      setHistory(cleaned + raw + ' ' + btn + ' ')
      setDisplay('0')
      return
    }

    if (btn === '=') {
      if (justEvaluated) return
      const raw = display.replace(/,/g, '')
      const fullExpression = history + raw
      const result = evaluate(fullExpression)
      setDisplay(result)
      setHistory(fullExpression + ' = ')
      setJustEvaluated(true)
      return
    }

    if (btn === '.') {
      if (display.includes('.')) return
    }

    // Number input
    if (justEvaluated) {
      setDisplay(btn)
      setHistory('')
      setJustEvaluated(false)
    } else if (display === '0' || display === 'Error') {
      setDisplay(btn)
    } else {
      setDisplay(prev => prev + btn)
    }
  }

  const getButtonStyle = (btn) => {
    const base = 'select-none rounded-2xl text-lg font-extrabold transition-all duration-100 active:scale-95 focus:outline-none'
    if (btn === 'C') return base + ' bg-red-100 text-red-600 hover:bg-red-200 active:bg-red-300 h-12'
    if (btn === '=') return base + ' bg-[#16A34A] text-white hover:bg-[#15803D] active:bg-[#166534] h-12 shadow-[0_4px_12px_rgba(22,163,74,0.3)]'
    if (['÷', '×', '−', '+'].includes(btn)) return base + ' bg-[#DCFCE7] text-[#2D7A4F] hover:bg-[#BBF7D0] active:bg-[#86EFAC] h-12'
    if (btn === '⌫') return base + ' bg-slate-100 text-slate-500 hover:bg-slate-200 active:bg-slate-300 h-12'
    return base + ' bg-white text-slate-800 hover:bg-slate-50 active:bg-slate-100 h-14 shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
  }

  return (
    <ParentLayout>
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-extrabold text-gray-900">Calculator</h1>
          <p className="text-sm font-medium text-slate-500">
            Use this to help your child with math problems during quizzes.
          </p>
        </div>

        {/* Display */}
        <div className="overflow-hidden rounded-2xl border border-[#C8E6D4] bg-white p-6 shadow-sm">
          {/* History line */}
          <div className="mb-2 min-h-[22px] text-right text-sm font-medium text-slate-400 break-all leading-tight">
            {history || '\u00A0'}
          </div>
          {/* Main display */}
          <div className="text-right text-4xl font-extrabold text-gray-900 break-all leading-tight tracking-tight">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2.5 rounded-2xl border border-[#C8E6D4] bg-[#F0FAF4] p-4">
          {BUTTONS.flat().map(btn => (
            <button
              key={btn}
              onClick={() => handleButton(btn)}
              className={getButtonStyle(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Tips */}
        <div className="rounded-xl border border-[#C8E6D4] bg-white p-4">
          <h3 className="text-sm font-extrabold text-gray-700 mb-2">💡 Tips</h3>
          <ul className="space-y-1.5 text-xs font-medium text-slate-500">
            <li>• Click <span className="font-extrabold text-slate-700">C</span> to clear everything</li>
            <li>• Use <span className="font-extrabold text-slate-700">⌫</span> to delete last digit</li>
            <li>• Use operators after numbers: <span className="font-extrabold text-slate-700">5 + 3 =</span></li>
            <li>• <span className="font-extrabold text-slate-700">±</span> toggles negative/positive sign</li>
            <li>• <span className="font-extrabold text-slate-700">%</span> converts to percentage (÷ 100)</li>
          </ul>
        </div>
      </div>
    </ParentLayout>
  )
}
