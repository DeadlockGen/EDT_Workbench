import { useRef, useState, useCallback, useEffect, ReactNode } from 'react'
import { theme } from 'antd'

interface SplitPanelProps {
  left: ReactNode
  right: ReactNode
  defaultRatio?: number
  minRatio?: number
  maxRatio?: number
  direction?: 'horizontal' | 'vertical'
}

export function SplitPanel({
  left,
  right,
  defaultRatio = 0.5,
  minRatio = 0.2,
  maxRatio = 0.8,
  direction = 'horizontal'
}: SplitPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ratio, setRatio] = useState(defaultRatio)
  const [dragging, setDragging] = useState(false)
  const { token } = theme.useToken()

  const isHorizontal = direction === 'horizontal'

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      let newRatio: number

      if (isHorizontal) {
        newRatio = (e.clientX - rect.left) / rect.width
      } else {
        newRatio = (e.clientY - rect.top) / rect.height
      }

      newRatio = Math.max(minRatio, Math.min(maxRatio, newRatio))
      setRatio(newRatio)
    },
    [dragging, isHorizontal, minRatio, maxRatio]
  )

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [dragging, handleMouseMove, handleMouseUp, isHorizontal])

  const splitterStyle: React.CSSProperties = {
    [isHorizontal ? 'width' : 'height']: 4,
    [isHorizontal ? 'cursor' : 'cursor']: isHorizontal ? 'col-resize' : 'row-resize',
    backgroundColor: dragging ? token.colorPrimary : 'transparent',
    transition: dragging ? 'none' : 'background-color 0.15s',
    flexShrink: 0,
    position: 'relative',
    zIndex: 10
  }

  const splitterHoverStyle: React.CSSProperties = {
    [isHorizontal ? 'width' : 'height']: 4,
    [isHorizontal ? 'marginLeft' : 'marginTop']: -2,
    [isHorizontal ? 'marginRight' : 'marginBottom']: -2,
    position: 'absolute',
    [isHorizontal ? 'top' : 'left']: 0,
    [isHorizontal ? 'right' : 'right']: 0,
    [isHorizontal ? 'bottom' : 'bottom']: 0
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full"
      style={{ flexDirection: isHorizontal ? 'row' : 'column' }}
    >
      <div style={{ flex: ratio, minWidth: 0, minHeight: 0 }}>
        {left}
      </div>
      <div
        style={splitterStyle}
        onMouseDown={handleMouseDown}
        className="group hover:bg-primary-300/50 transition-colors"
      >
        <div style={splitterHoverStyle} />
      </div>
      <div style={{ flex: 1 - ratio, minWidth: 0, minHeight: 0 }}>
        {right}
      </div>
    </div>
  )
}
