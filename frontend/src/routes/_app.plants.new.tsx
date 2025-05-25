import { createFileRoute, Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'
import { plantStore, plantActions } from '@/lib/plant-store'
import { ProgressIndicator } from '@/components/plant-form/progress-indicator'
import { Step1BasicInfo } from '@/components/plant-form/step-1-basic-info'
import { Step2Container } from '@/components/plant-form/step-2-container'
import { Step3CareSchedule } from '@/components/plant-form/step-3-care-schedule'
import { Step4Review } from '@/components/plant-form/step-4-review'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_app/plants/new')({
  component: AddPlantPage,
})

function AddPlantPage() {
  const currentStep = useStore(plantStore, (state) => state.currentStep)

  // Reset form when component mounts
  useEffect(() => {
    plantActions.resetForm()
  }, [])

  const handleNext = () => {
    plantActions.nextStep()
  }

  const handlePrev = () => {
    plantActions.prevStep()
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo onNext={handleNext} />
      case 2:
        return <Step2Container onNext={handleNext} onPrev={handlePrev} />
      case 3:
        return <Step3CareSchedule onNext={handleNext} onPrev={handlePrev} />
      case 4:
        return <Step4Review onPrev={handlePrev} />
      default:
        return <Step1BasicInfo onNext={handleNext} />
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Plant</h1>
            <p className="text-muted-foreground">Create a new plant profile to track care and growth.</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>

      <ProgressIndicator currentStep={currentStep} totalSteps={4} />

      <div className="max-w-2xl mx-auto">
        {renderCurrentStep()}
      </div>
    </div>
  )
}