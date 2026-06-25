'use client'

import { useEffect, useRef } from 'react'

interface LoginLinesBackgroundProps {
  className?: string
}

interface Node {
  x: number
  y: number
  vx: number
  vy: number
}

const NODE_COUNT = 36
const LINK_DISTANCE = 132
const MAX_LINKS_PER_NODE = 3
const FRAME_INTERVAL_MS = 33

function readLineColor(root: HTMLElement): string {
  const styles = getComputedStyle(root)
  const fg = styles.getPropertyValue('--foreground').trim()
  return fg ? `hsl(${fg})` : '#171717'
}

export function LoginLinesBackground({ className }: LoginLinesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationId = 0
    let idleHandle: number | undefined
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined
    let nodes: Node[] = []
    let width = 0
    let height = 0
    let dpr = 1
    let lastFrameAt = 0
    let running = false

    const initNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.3),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.3),
      }))
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = wrap.clientWidth
      height = wrap.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (nodes.length === 0) initNodes()
    }

    const draw = () => {
      const root = document.documentElement
      const lineColor = readLineColor(root)
      const isDark = root.classList.contains('dark')

      ctx.clearRect(0, 0, width, height)

      if (!reducedMotion) {
        for (const node of nodes) {
          node.x += node.vx
          node.y += node.vy
          if (node.x <= 0 || node.x >= width) node.vx *= -1
          if (node.y <= 0 || node.y >= height) node.vy *= -1
          node.x = Math.max(0, Math.min(width, node.x))
          node.y = Math.max(0, Math.min(height, node.y))
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        let linked = 0
        for (let j = i + 1; j < nodes.length; j++) {
          if (linked >= MAX_LINKS_PER_NODE) break
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DISTANCE) {
            const t = 1 - dist / LINK_DISTANCE
            const alpha = isDark ? 0.04 + t * 0.14 : 0.05 + t * 0.1
            ctx.strokeStyle = lineColor
            ctx.globalAlpha = alpha
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
            linked++
          }
        }
      }

      ctx.globalAlpha = isDark ? 0.22 : 0.2
      ctx.fillStyle = lineColor
      for (const node of nodes) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1.2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (timestamp: number) => {
      if (!running) return

      if (!document.hidden && timestamp - lastFrameAt >= FRAME_INTERVAL_MS) {
        draw()
        lastFrameAt = timestamp
      }

      if (!reducedMotion && !document.hidden) {
        animationId = window.requestAnimationFrame(loop)
      }
    }

    const start = () => {
      if (running) return
      running = true
      resize()
      draw()
      if (!reducedMotion) {
        animationId = window.requestAnimationFrame(loop)
      }
    }

    const stop = () => {
      running = false
      window.cancelAnimationFrame(animationId)
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationId)
        return
      }
      if (!reducedMotion && running) {
        lastFrameAt = 0
        animationId = window.requestAnimationFrame(loop)
      }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(wrap)

    const themeObserver = new MutationObserver(() => {
      if (running) draw()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    document.addEventListener('visibilitychange', onVisibilityChange)

    const scheduleStart = () => {
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(start, { timeout: 1500 })
      } else {
        timeoutHandle = setTimeout(start, 200)
      }
    }

    scheduleStart()

    return () => {
      stop()
      observer.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (idleHandle !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleHandle)
      }
      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle)
      }
    }
  }, [])

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      <div className="login-lines-base absolute inset-0" />
      <div className="login-lines-grid absolute inset-0" />
      <div className="login-lines-grid login-lines-grid-fine absolute inset-0" />
      <div className="login-lines-diagonal absolute inset-0" />
      <canvas ref={canvasRef} className="login-lines-canvas absolute inset-0" />
      <div className="login-lines-vignette absolute inset-0" />
    </div>
  )
}
