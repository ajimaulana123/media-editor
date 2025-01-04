"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, Attribute } from "next-themes"

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: Attribute | Attribute[];  // Update to reflect the expected type
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
