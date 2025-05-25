import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { plantStore, plantActions } from '@/lib/plant-store'

const step2Schema = z.object({
  potType: z.string().optional(),
  potSize: z.number().min(0, 'Pot size must be positive').optional(),
  soilMix: z.string().optional(),
  location: z.string().optional(),
})

export function Step2Container({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const formData = useStore(plantStore, (state) => state.formData)

  const form = useForm({
    defaultValues: {
      potType: formData.potType,
      potSize: formData.potSize,
      soilMix: formData.soilMix,
      location: formData.location,
    },
    onSubmit: async ({ value }) => {
      const result = step2Schema.safeParse(value)
      if (result.success) {
        plantActions.updateFormData(value)
        onNext()
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Container & Location</CardTitle>
        <CardDescription>Tell us about your plant's home</CardDescription>
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
          <form.Field name="potType">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="pot-type">Pot Type</Label>
                <Select value={field.state.value} onValueChange={field.handleChange}>
                  <SelectTrigger id="pot-type" data-testid="pot-type">
                    <SelectValue placeholder="Select pot type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terracotta">Terracotta</SelectItem>
                    <SelectItem value="ceramic">Ceramic</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="concrete">Concrete</SelectItem>
                    <SelectItem value="hanging">Hanging Basket</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field
            name="potSize"
            validators={{
              onChange: ({ value }) => {
                if (value !== undefined && value < 0) {
                  return 'Pot size must be positive'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="pot-size">Pot Size (inches)</Label>
                <Input
                  id="pot-size"
                  data-testid="pot-size"
                  name={field.name}
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 6"
                  value={field.state.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  onBlur={field.handleBlur}
                />
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

          <form.Field name="soilMix">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="soil-mix">Soil Mix</Label>
                <Textarea
                  id="soil-mix"
                  data-testid="soil-mix"
                  name={field.name}
                  placeholder="Describe the soil mix used (e.g. potting mix, perlite, bark)"
                  value={field.state.value}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="location">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="location">Location in Home</Label>
                <Input
                  id="location"
                  data-testid="location"
                  name={field.name}
                  placeholder="e.g. Living Room - East Window"
                  value={field.state.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
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
                  Next: Care Schedule
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 