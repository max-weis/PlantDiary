import { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { plantStore, plantActions } from '@/lib/plant-store'
import { Loading } from '@/components/loading'
import { toast } from 'sonner'

export function Step4Review({ onPrev }: { onPrev: () => void }) {
  const formData = useStore(plantStore, (state) => state.formData)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // In a real app, this would save the plant data
      console.log('Plant data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Plant added successfully!')
      plantActions.resetForm()
      navigate({ to: '/dashboard' })
    } catch (error) {
      toast.error('Failed to add plant')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loading message="Saving plant..." />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>Please review your plant information before submitting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Common Name</Label>
              <p className="text-sm">{formData.commonName || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Latin Name</Label>
              <p className="text-sm">{formData.latinName || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Purchase Date</Label>
              <p className="text-sm">{formData.purchaseDate || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Images</Label>
              <p className="text-sm">{formData.images.length} image(s) uploaded</p>
            </div>
          </div>
          
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Plant ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Container & Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Container & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Pot Type</Label>
              <p className="text-sm">{formData.potType || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Pot Size</Label>
              <p className="text-sm">{formData.potSize ? `${formData.potSize} inches` : 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Location</Label>
              <p className="text-sm">{formData.location || 'Not specified'}</p>
            </div>
          </div>
          {formData.soilMix && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Soil Mix</Label>
              <p className="text-sm">{formData.soilMix}</p>
            </div>
          )}
        </div>

        {/* Care Schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Care Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Watering Frequency</Label>
              <p className="text-sm">Every {formData.wateringFrequency} day(s)</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Fertilizing Frequency</Label>
              <p className="text-sm">Every {formData.fertilizingFrequency} day(s)</p>
            </div>
          </div>
          {formData.additionalCare && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Additional Care Notes</Label>
              <p className="text-sm">{formData.additionalCare}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onPrev}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} data-testid="save-plant-button">
            {isLoading ? 'Saving...' : 'Save Plant'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 