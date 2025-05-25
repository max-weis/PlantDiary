interface LoadingProps {
  message?: string
  fullScreen?: boolean
}

export function Loading({ message = "Loading...", fullScreen = true }: LoadingProps) {
  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center py-8"

  return (
    <div className={containerClasses}>
      <div className="text-lg">{message}</div>
    </div>
  )
} 