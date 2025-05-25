import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { plantStore, plantActions } from '@/lib/plant-store'

const step3Schema = z.object({
  wateringFrequency: z.number().min(1, 'Watering frequency must be at least 1 day'),
  fertilizingFrequency: z.number().min(1, 'Fertilizing frequency must be at least 1 day'),
  additionalCare: z.string().optional(),
})

export function Step3CareSchedule({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const formData = useStore(plantStore, (state) => state.formData)

  const form = useForm({
    defaultValues: {
      wateringFrequency: formData.wateringFrequency,
      fertilizingFrequency: formData.fertilizingFrequency,
      additionalCare: formData.additionalCare,
    },
    onSubmit: async ({ value }) => {
      const result = step3Schema.safeParse(value)
      if (result.success) {
        plantActions.updateFormData(value)
        onNext()
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Care Schedule</CardTitle>
        <CardDescription>Set up the care routine for your plant</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          className="space-y-6"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="wateringFrequency"
            validators={{
              onChange: ({ value }) => {
                return value < 1 ? 'Watering frequency must be at least 1 day' : undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="watering-frequency">Watering Frequency (days) *</Label>
                <Input
                  id="watering-frequency"
                  data-testid="watering-frequency"
                  name={field.name}
                  type="number"
                  min="1"
                  placeholder="e.g. 7"
                  value={field.state.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(parseInt(e.target.value) || 1)}
                  onBlur={field.handleBlur}
                />
                <p className="text-sm text-muted-foreground">How often should this plant be watered?</p>
                <div className="h-5">
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-red-500 text-sm">
                      {field.state.meta.errors[0]}
                    </div>
                  )}
                </div>
              </div>
            )}
          </form.Field>

          <form.Field
            name="fertilizingFrequency"
            validators={{
              onChange: ({ value }) => {
                return value < 1 ? 'Fertilizing frequency must be at least 1 day' : undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="fertilizing-frequency">Fertilizing Frequency (days) *</Label>
                <Input
                  id="fertilizing-frequency"
                  data-testid="fertilizing-frequency"
                  name={field.name}
                  type="number"
                  min="1"
                  placeholder="e.g. 30"
                  value={field.state.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(parseInt(e.target.value) || 1)}
                  onBlur={field.handleBlur}
                />
                <p className="text-sm text-muted-foreground">How often should this plant be fertilized?</p>
                <div className="h-5">
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-red-500 text-sm">
                      {field.state.meta.errors[0]}
                    </div>
                  )}
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="additionalCare">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="additional-care">Additional Care Notes</Label>
                <Textarea
                  id="additional-care"
                  data-testid="additional-care"
                  name={field.name}
                  placeholder="Any special care instructions, preferences, or notes about this plant..."
                  value={field.state.value}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              Back
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button 
                  type="submit" 
                  disabled={!canSubmit || isSubmitting}
                >
                  Next: Review
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 