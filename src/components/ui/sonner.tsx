import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group relative overflow-hidden rounded-2xl border border-border/40 bg-[var(--toast-bg)] text-[var(--toast-text)] backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)]",
          title: "font-semibold tracking-tight text-[15px]",
          description: "text-sm text-muted-foreground",
          actionButton:
            "rounded-full bg-primary text-primary-foreground px-4 py-1 text-sm font-medium hover:opacity-90",
          closeButton: "text-muted-foreground hover:text-foreground",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-500" />,
        info: <InfoIcon className="size-4 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-500" />,
        error: <OctagonXIcon className="size-4 text-red-500" />,
        loading: <Loader2Icon className="size-4 animate-spin text-cyan-400" />,
      }}
      style={
        {
          "--toast-bg":
            "linear-gradient(135deg, var(--background), var(--muted))",
          "--toast-text": "var(--foreground)",
          "--border": "rgba(255,255,255,0.1)",
          "--radius": "1rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
