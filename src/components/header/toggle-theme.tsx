'use client';

import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ThemeKey = keyof typeof themeMap;
const themeMap = {
  system: 'light',
  light: 'dark',
  dark: 'system',
} as const;
const iconMap = {
  system: SunMoonIcon,
  light: SunIcon,
  dark: MoonIcon,
} as const;
const DEFAULT_THEME = 'system';

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const nextTheme = themeMap[(theme as ThemeKey) || DEFAULT_THEME];
  const Icon = iconMap[(theme as ThemeKey) || DEFAULT_THEME];

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <Button variant="ghost" onClick={() => setTheme(nextTheme)}>
      <Icon />
    </Button>
  );
}
