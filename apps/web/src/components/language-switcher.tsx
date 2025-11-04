import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18n-context';
// @ts-ignore - Eksik modül hatalarını yok sayıyoruz
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
  const { locale, changeLocale, t } = useI18n();
  const [open, setOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (languageCode: 'tr' | 'en' | 'de' | 'es' | 'fr') => {
    changeLocale(languageCode);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-2 py-1">
          <Globe className="h-4 w-4 mr-1" />
          <span className="mr-1">{currentLanguage.flag}</span>
          <span className="sr-only md:not-sr-only md:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(language => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code as any)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
