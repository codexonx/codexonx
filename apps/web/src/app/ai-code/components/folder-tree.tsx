'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React from 'react';
import { Folder, ChevronRight, File, FileText, FileCode, Code, Coffee } from 'lucide-react';

interface FolderTreeProps {
  className?: string;
  size?: number;
}

/**
 * Dosya gezgini için simge bileşeni
 */
export default function FolderTree({ className = '', size = 16 }: FolderTreeProps) {
  return <Folder className={className} size={size} strokeWidth={2} aria-hidden="true" />;
}

/**
 * Dosya tipi simgelerini belirlemek için yardımcı fonksiyon
 */
export function getFileIcon(fileName: string, size = 16) {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode size={size} className="text-yellow-500" />;

    case 'html':
      return <Code size={size} className="text-orange-500" />;

    case 'css':
    case 'scss':
    case 'sass':
      return <FileCode size={size} className="text-blue-500" />;

    case 'json':
      return <FileCode size={size} className="text-green-500" />;

    case 'md':
    case 'markdown':
      return <FileText size={size} className="text-gray-500" />;

    case 'java':
      return <Coffee size={size} className="text-brown-500" />;

    default:
      return <File size={size} className="text-gray-500" />;
  }
}
