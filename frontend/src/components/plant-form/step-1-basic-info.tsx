import { ImageUpload } from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { plantActions, plantStore } from '@/lib/plant-store'
import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import { z } from 'zod'

const step1Schema = z.object({
  commonName: z.string().min(1, 'Common name is required'),
  latinName: z.string().optional(),
  purchaseDate: z.string().optional(),
})

export function Step1BasicInfo({ onNext }: {onNext: () => void}) {
  const formData = useStore(plantStore, (state) => state.formData)

  const form = useForm({
    defaultValues: {
      commonName: formData.commonName,
      latinName: formData.latinName,
      purchaseDate: formData.purchaseDate,
    },
    onSubmit: async ({ value }) => {
      const result = step1Schema.safeParse(value)
      if (result.success) {
        plantActions.updateFormData(value)
        onNext()
      }
    },
  })

  const handleImagesChange = (images: File[]) => {
    plantActions.updateFormData({ images })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Tell us about your plant</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="commonName"
            validators={{
              onChange: ({ value }) => {
                return value.length < 1 ? 'Common name is required' : undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="common-name">Common Name *</Label>
                <Input
                  id="common-name"
                  data-testid="common-name"
                  name={field.name}
                  placeholder="e.g. Monstera Deliciosa"
                  value={field.state.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  required
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

          <form.Field name="latinName">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="latin-name">Latin Name (Botanical)</Label>
                <Input
                  id="latin-name"
                  data-testid="latin-name"
                  name={field.name}
                  placeholder="e.g. Monstera deliciosa"
                  value={field.state.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="purchaseDate">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="purchase-date">Purchase Date</Label>
                <Input
                  id="purchase-date"
                  data-testid="purchase-date"
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>

          <div className="space-y-2">
            <Label>Plant Images</Label>
            <ImageUpload
              onImagesChange={handleImagesChange}
              maxImages={3}
            />
          </div>

          <div className="flex justify-end">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  data-testid="next-button"
                  disabled={!canSubmit || isSubmitting}
                >
                  Next: Container & Location
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 