'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// İkon için sınıf adı ve boyut özelliklerini içerir
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

type LucideModule = typeof import('lucide-react');

const MissingIcon: React.FC<IconProps> = () => <span className="icon-missing w-5 h-5" />;

// Dinamik olarak Lucide ikonlarını import eden bir fonksiyon
export function Icon({ name, ...props }: IconProps & { name: string }): React.ReactElement | null {
  const IconComponent = React.useMemo(
    () =>
      dynamic<IconProps>(
        async () => {
          const mod: LucideModule = await import('lucide-react');
          const component = mod[name as keyof LucideModule];

          if (typeof component === 'function') {
            return component as React.ComponentType<IconProps>;
          }

          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Icon "${name}" lucide-react paketinde bulunamadı.`);
          }

          return MissingIcon;
        },
        {
          loading: () => <span className="icon-loading w-5 h-5" />,
          ssr: false,
        }
      ),
    [name]
  );

  return <IconComponent {...props} />;
}
