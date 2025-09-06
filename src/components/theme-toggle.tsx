import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDarkMode } from "@/hooks/useDarkMode"

export function ThemeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      className="h-9 w-9"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}