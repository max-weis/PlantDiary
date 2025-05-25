import { cn } from '@/lib/utils'

const steps = [
  { number: 1, title: 'Basic Info', description: 'Plant details' },
  { number: 2, title: 'Container', description: 'Pot & location' },
  { number: 3, title: 'Care Schedule', description: 'Watering & fertilizing' },
  { number: 4, title: 'Review', description: 'Confirm details' },
]

export function ProgressIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium',
                  currentStep >= step.number
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground text-muted-foreground'
                )}
              >
                {step.number}
              </div>
              <div className="mt-2 text-center">
                <p className={cn(
                  'text-sm font-medium',
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 w-12',
                  currentStep > step.number ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 