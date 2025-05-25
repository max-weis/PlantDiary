import { Store } from '@tanstack/react-store'

export interface PlantFormData {
  // Step 1: Basic Info
  commonName: string
  latinName: string
  purchaseDate: string
  images: File[]
  
  // Step 2: Container & Location
  potType: string
  potSize: number | undefined
  soilMix: string
  location: string
  
  // Step 3: Care Schedule
  wateringFrequency: number
  fertilizingFrequency: number
  additionalCare: string
}

export interface PlantStoreState {
  currentStep: number
  formData: PlantFormData
  isValid: boolean
}

const initialFormData: PlantFormData = {
  commonName: '',
  latinName: '',
  purchaseDate: '',
  images: [],
  potType: '',
  potSize: undefined,
  soilMix: '',
  location: '',
  wateringFrequency: 7,
  fertilizingFrequency: 30,
  additionalCare: '',
}

export const plantStore = new Store<PlantStoreState>({
  currentStep: 1,
  formData: initialFormData,
  isValid: false,
})

// Actions
export const plantActions = {
  setStep: (step: number) => {
    plantStore.setState((state) => ({
      ...state,
      currentStep: step,
    }))
  },
  
  updateFormData: (data: Partial<PlantFormData>) => {
    plantStore.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        ...data,
      },
    }))
  },
  
  nextStep: () => {
    plantStore.setState((state) => ({
      ...state,
      currentStep: Math.min(state.currentStep + 1, 4),
    }))
  },
  
  prevStep: () => {
    plantStore.setState((state) => ({
      ...state,
      currentStep: Math.max(state.currentStep - 1, 1),
    }))
  },
  
  resetForm: () => {
    plantStore.setState((state) => ({
      ...state,
      currentStep: 1,
      formData: initialFormData,
      isValid: false,
    }))
  },
  
  setValid: (isValid: boolean) => {
    plantStore.setState((state) => ({
      ...state,
      isValid,
    }))
  },
} 