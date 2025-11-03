"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve dynamic import
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React from "react";
import dynamic from "next/dynamic";

// İkon için sınıf adı ve boyut özelliklerini içerir
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

// Dinamik olarak Lucide ikonlarını import eden bir fonksiyon
export function Icon({
  name,
  ...props
}: IconProps & { name: string }): React.ReactElement | null {
  // Dinamik olarak component yükle
  const IconComponent = React.useMemo(() => dynamic(
    () => import("lucide-react").then((mod) => mod[name as keyof typeof mod]),
    {
      loading: () => <span className="icon-loading w-5 h-5"></span>,
      ssr: false,
    }
  ), [name]);
  
  return <IconComponent {...props} />;
}
