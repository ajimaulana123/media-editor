// components/theme-provider.tsx

import { ReactNode } from "react";
import { NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: string | string[];  // Memperbaiki tipe agar sesuai dengan yang diharapkan
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}

