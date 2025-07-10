'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Clock, Coffee, Lightbulb } from 'lucide-react'

interface ProcrastinationMessageProps {
  onDismiss: () => void
  onProcrastinate: () => void
  taskCount: number
}

const PROCRASTINATION_MESSAGES = [
  "Another task? Have you tried just... not?",
  "This looks like something Future You can handle",
  "Breaking news: Local person discovers they have hands, could do task right now",
  "Task creation is just advanced procrastination, change my mind",
  "Your task list is getting longer than a CVS receipt",
  "Maybe just do it instead?",
  "This could probably wait until tomorrow...",
  "Are you sure this needs to be on a list?",
  "Plot twist: You could literally just do the thing",
  "Adding tasks is easier than doing tasks, isn't it?",
  "Your keyboard called - it wants to know why you're avoiding actual work",
  "Fun fact: Tasks don't do themselves (shocking, I know)",
  "This task looks suspiciously like something you could do right now",
  "Your productivity app is judging you (lovingly)",
  "Real question: How many tasks does one person need?"
]

const EASTER_EGG_MESSAGES = [
  "🏆 Task Creation Champion! But maybe touch some grass?",
  "⚡ You've unlocked 'Professional Procrastinator' status",
  "🎭 At this point, you're just collecting tasks like Pokémon",
  "🤯 Your task list has its own task list now",
  "👑 Bow down to the Task Overlord! (That's you)",
  "🌟 Achievement unlocked: More tasks than a project manager",
  "🎪 Welcome to the circus! You're the ringmaster of productivity theater"
]

const SUGGESTIONS = [
  { icon: Coffee, text: "Go make coffee instead", action: "Maybe hydration will solve everything" },
  { icon: Lightbulb, text: "Just do one existing task", action: "Revolutionary idea, I know" },
  { icon: Clock, text: "Set a 5-minute timer", action: "And actually do something for once" }
]

export function ProcrastinationMessage({ onDismiss, onProcrastinate, taskCount }: ProcrastinationMessageProps) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [currentSuggestion, setCurrentSuggestion] = useState(SUGGESTIONS[0])

  useEffect(() => {
    // Show easter egg messages for power users (10+ tasks)
    if (taskCount >= 10) {
      const randomEasterEgg = EASTER_EGG_MESSAGES[Math.floor(Math.random() * EASTER_EGG_MESSAGES.length)]
      setCurrentMessage(randomEasterEgg)
    } else {
      const randomMessage = PROCRASTINATION_MESSAGES[Math.floor(Math.random() * PROCRASTINATION_MESSAGES.length)]
      setCurrentMessage(randomMessage)
    }

    const randomSuggestion = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)]
    setCurrentSuggestion(randomSuggestion)
  }, [taskCount])

  return (
    <Card className="border-yellow-200 bg-yellow-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 mb-2">
              🤔 Procrastination Alert
            </h3>
            <p className="text-yellow-700 text-sm mb-3">
              {currentMessage}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-yellow-600 hover:text-yellow-800 h-auto p-1"
            data-testid="dismiss-procrastination"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4 p-2 bg-white rounded border border-yellow-200">
          <currentSuggestion.icon className="h-4 w-4 text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">{currentSuggestion.text}</p>
            <p className="text-xs text-yellow-600">{currentSuggestion.action}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onProcrastinate}
            variant="outline"
            size="sm"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            data-testid="procrastinate-button"
          >
            <Clock className="h-4 w-4 mr-1" />
            Procrastinate (5 min)
          </Button>
          <Button
            onClick={onDismiss}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            data-testid="create-anyway-button"
          >
            Create Task Anyway
          </Button>
        </div>

        {taskCount >= 5 && (
          <p className="text-xs text-yellow-600 mt-2 text-center">
            💡 Pro tip: You have {taskCount} tasks already. Maybe prioritize those?
          </p>
        )}
      </CardContent>
    </Card>
  )
}