'use client'

import { useState, useEffect } from 'react'
import { useAppSelector } from '@/redux'
import {
  Menu,
  Search,
  Calendar,
  Bell,
  MessageCircle,
  Loader2,
  ChefHat,
  Clock,
  Activity,
  X,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface HeaderProps {
  pageTitle: string
  onMenuClick: () => void
  showBack?: boolean
  onBack?: () => void
}

export function Header({ pageTitle, onMenuClick, showBack, onBack }: HeaderProps) {
  const { user } = useAppSelector(state => state.auth)
  const processingTasks: { id: string; title: string; clientName?: string; description: string; startedAt: string; type: string }[] = []
  const [isProcessingOpen, setIsProcessingOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting until mount to show client-persisted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get user initial from decoded token name
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?'

  const hasProcessing = mounted && processingTasks.length > 0

  return (
    <header className="sticky top-0 z-30 bg-card shadow-[0_8px_32px_rgba(15,23,42,0.08)]">
      {/* Desktop Header */}
      <div className="h-[84px] items-center justify-between gap-4 px-6 w-full hidden md:flex">
        {/* Left section - Dynamic page title */}
        <div className="flex items-center gap-4">
          {showBack && (
            <div
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-border cursor-pointer hover:bg-muted transition-colors"
              onClick={onBack}
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
        </div>

        {/* Right section with search and circular icons */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-full text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Calendar Icon */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-primary/20 hover:text-primary text-muted-foreground"
            aria-label="Calendar"
          >
            <Calendar className="h-4 w-4" />
          </Button> */}

          {/* Processing Tasks Icon */}
          <Dialog open={isProcessingOpen} onOpenChange={setIsProcessingOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary/20 hover:text-primary text-muted-foreground relative"
                aria-label="Background tasks"
              >
                <Activity className="h-4 w-4" />
                {hasProcessing && (
                  <div className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">
                      {processingTasks.length}
                    </span>
                  </div>
                )}
                {hasProcessing && (
                  <div className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-orange-500 rounded-full animate-ping opacity-40" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background border-0 shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
              <DialogHeader className="p-6 pb-3 relative">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-orange-600" />
                    </div>
                    Background Tasks
                  </DialogTitle>
                  {/* <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                    onClick={() => setIsProcessingOpen(false)}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button> */}
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-left">
                  Tasks currently being processed in Fam NGX
                </p>
              </DialogHeader>
              <div className="px-6 pb-6 space-y-3 max-h-[400px] overflow-y-auto">
                {processingTasks.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">
                      No tasks are being processed right now.
                    </p>
                  </div>
                ) : (
                  processingTasks.map((task: any) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-4 bg-orange-50/60 rounded-xl border border-orange-100"
                    >
                      <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        {task.type === 'meal-plan' ? (
                          <ChefHat className="w-4 h-4 text-orange-600 animate-pulse" />
                        ) : (
                          <Loader2 className="w-4 h-4 text-orange-600 animate-spin" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {task.clientName ? `${task.clientName} • ` : ''}
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-[11px] text-gray-400 font-medium">
                            Started{' '}
                            {formatDistanceToNow(new Date(task.startedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full hover:bg-orange-200/50 text-orange-600/50 hover:text-orange-600"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                        <Badge className="bg-orange-100 text-orange-700 border-none text-[10px] font-bold rounded-md px-2">
                          Processing
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Notifications Icon with red dot */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-primary/20 hover:text-primary text-muted-foreground relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#FF3B30] rounded-full"></div>
          </Button> */}

          {/* Chat Icon */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-primary/20 hover:text-primary text-muted-foreground"
            aria-label="Chat"
          >
            <MessageCircle className="h-4 w-4" />
          </Button> */}

          {/* User Profile Avatar */}
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
            {userInitial}
          </div>
        </div>
      </div>

    {/* Mobile Header */}
      <div className="h-16 items-center justify-between px-4 md:hidden flex bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-gray-200"
            onClick={showBack && onBack ? onBack : onMenuClick}
          >
            {showBack ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">{showBack ? 'Go back' : 'Toggle menu'}</span>
          </Button>

          <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Processing icon (mobile) */}
          {hasProcessing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 text-orange-600 relative"
              onClick={() => setIsProcessingOpen(true)}
            >
              <Activity className="h-4 w-4" />
              <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">
                  {processingTasks.length}
                </span>
              </div>
            </Button>
          )}

          {/* Notifications Icon with red dot */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground relative"
          >
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-background"></div>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Profile Avatar */}
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
            {userInitial}
          </div>
        </div>
      </div>
    </header>
  )
}
