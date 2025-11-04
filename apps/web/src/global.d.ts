/**
 * AICodeX platformu global tipler
 * Bu dosya ile TypeScript hatalarını yönetiyoruz
 */

// İkon tipi hata çözümü
declare module 'lucide-react' {
  import { ComponentType, ReactNode } from 'react';
  export interface IconProps {
    color?: string;
    size?: number | string;
    strokeWidth?: number;
    className?: string;
    onClick?: () => void;
    children?: ReactNode;
    [key: string]: any;
  }

  export type IconComponent = ComponentType<IconProps>;

  // Tüm ikonları export et
  export const Activity: IconComponent;
  export const AlertCircle: IconComponent;
  export const ArrowRight: IconComponent;
  export const ArrowUpDown: IconComponent;
  export const BookOpen: IconComponent;
  export const Briefcase: IconComponent;
  export const BarChart2: IconComponent;
  export const Bell: IconComponent;
  export const Book: IconComponent;
  export const Calendar: IconComponent;
  export const CalendarRange: IconComponent;
  export const Check: IconComponent;
  export const CheckCircle: IconComponent;
  export const Circle: IconComponent;
  export const ChevronDown: IconComponent;
  export const ChevronLeft: IconComponent;
  export const ChevronRight: IconComponent;
  export const ChevronUp: IconComponent;
  export const CircleCheck: IconComponent;
  export const CircleX: IconComponent;
  export const Clock: IconComponent;
  export const Cloud: IconComponent;
  export const Code: IconComponent;
  export const Coffee: IconComponent;
  export const Copy: IconComponent;
  export const Cpu: IconComponent;
  export const Database: IconComponent;
  export const DollarSign: IconComponent;
  export const Edit: IconComponent;
  export const ExternalLink: IconComponent;
  export const Eye: IconComponent;
  export const EyeOff: IconComponent;
  export const File: IconComponent;
  export const FileCode: IconComponent;
  export const FileText: IconComponent;
  export const Filter: IconComponent;
  export const Folder: IconComponent;
  export const Github: IconComponent;
  export const GitBranch: IconComponent;
  export const Home: IconComponent;
  export const Info: IconComponent;
  export const Layers: IconComponent;
  export const Link2: IconComponent;
  export const Lock: IconComponent;
  export const LogOut: IconComponent;
  export const LucideTerminalSquare: IconComponent;
  export const Mail: IconComponent;
  export const Menu: IconComponent;
  export const MessageSquare: IconComponent;
  export const MoreHorizontal: IconComponent;
  export const MoreVertical: IconComponent;
  export const PanelLeft: IconComponent;
  export const Play: IconComponent;
  export const Plus: IconComponent;
  export const PlayCircle: IconComponent;
  export const PlusCircle: IconComponent;
  export const Save: IconComponent;
  export const Search: IconComponent;
  export const Server: IconComponent;
  export const Settings: IconComponent;
  export const Shield: IconComponent;
  export const Sparkles: IconComponent;
  export const Star: IconComponent;
  export const Square: IconComponent;
  export const Tag: IconComponent;
  export const Terminal: IconComponent;
  export const TerminalSquare: IconComponent;
  export const ThumbsUp: IconComponent;
  export const Trash2: IconComponent;
  export const TrendingDown: IconComponent;
  export const TrendingUp: IconComponent;
  export const User: IconComponent;
  export const Users: IconComponent;
  export const Zap: IconComponent;
  export const Globe: IconComponent;
  export const Laptop: IconComponent;
  export const LayoutGrid: IconComponent;
  export const Linkedin: IconComponent;
  export const Link2: IconComponent;
  export const Lock: IconComponent;
  export const MapPin: IconComponent;
  export const Moon: IconComponent;
  export const Sun: IconComponent;
  export const Twitter: IconComponent;
  export const Upload: IconComponent;
  export const Download: IconComponent;
  export const X: IconComponent;

  // Diğer tüm ikonlar buraya eklenebilir
}

// Framer Motion hata çözümü
declare module 'framer-motion' {
  import {
    ReactNode,
    Component,
    ComponentClass,
    ForwardRefExoticComponent,
    RefAttributes,
  } from 'react';

  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    variants?: any;
    transition?: any;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    [key: string]: any;
  }

  // Framer Motion bileşenlerinin refs özelliğini tanımla
  class MotionComponent<P, S> extends Component<P, S> {
    refs: {
      [key: string]: Element;
    };
  }

  export const motion: {
    div: ForwardRefExoticComponent<
      MotionProps & React.HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>
    >;
    span: ForwardRefExoticComponent<
      MotionProps & React.HTMLAttributes<HTMLSpanElement> & RefAttributes<HTMLSpanElement>
    >;
    h1: ForwardRefExoticComponent<
      MotionProps & React.HTMLAttributes<HTMLHeadingElement> & RefAttributes<HTMLHeadingElement>
    >;
    h2: ForwardRefExoticComponent<
      MotionProps & React.HTMLAttributes<HTMLHeadingElement> & RefAttributes<HTMLHeadingElement>
    >;
    h3: ForwardRefExoticComponent<
      MotionProps & React.HTMLAttributes<HTMLHeadingElement> & RefAttributes<HTMLHeadingElement>
    >;
    p: ForwardRefExoticComponent<
      MotionProps & React.HTMLAttributes<HTMLParagraphElement> & RefAttributes<HTMLParagraphElement>
    >;
    a: ForwardRefExoticComponent<
      MotionProps & React.HTMLAttributes<HTMLAnchorElement> & RefAttributes<HTMLAnchorElement>
    >;
    ul: ForwardRefExoticComponent<
      MotionProps & React.HTMLAttributes<HTMLUListElement> & RefAttributes<HTMLUListElement>
    >;
    li: ForwardRefExoticComponent<
      MotionProps & React.HTMLAttributes<HTMLLIElement> & RefAttributes<HTMLLIElement>
    >;
    button: ForwardRefExoticComponent<
      MotionProps & React.HTMLAttributes<HTMLButtonElement> & RefAttributes<HTMLButtonElement>
    >;
    [key: string]: ForwardRefExoticComponent<any>;
  };

  export interface AnimationDefinition {
    [key: string]: any;
  }

  export type Variant = AnimationDefinition | ((props: any) => AnimationDefinition);

  export interface Variants {
    [key: string]: Variant;
  }

  export type Easing = Array<number> | string | ((t: number) => number);
}

// Radix UI hata çözümü
declare module '@radix-ui/react-tabs' {
  import React from 'react';

  export interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    orientation?: 'horizontal' | 'vertical';
    dir?: 'ltr' | 'rtl';
    activationMode?: 'automatic' | 'manual';
    className?: string;
    children?: React.ReactNode;
  }

  export const Tabs: React.FC<TabsProps>;
  export const TabsList: React.FC<any>;
  export const TabsTrigger: React.FC<any>;
  export const TabsContent: React.FC<any>;
}

// Monaco Editor hata çözümü
declare namespace monaco {
  export namespace editor {
    export interface IStandaloneCodeEditor {
      getValue: () => string;
      setValue: (value: string) => void;
      getModel: () => any;
      // Diğer fonksiyonlar eklenebilir
    }

    export interface IStandaloneEditorConstructionOptions {
      value?: string;
      language?: string;
      theme?: string;
      [key: string]: any;
    }

    export function create(
      element: HTMLElement,
      options?: IStandaloneEditorConstructionOptions
    ): IStandaloneCodeEditor;
    export function setModelLanguage(model: any, language: string): void;
    export function setTheme(theme: string): void;
  }

  export namespace languages {
    export enum CompletionItemKind {
      Method,
      Function,
      Constructor,
      Field,
      Variable,
      Class,
      Struct,
      Interface,
      Module,
      Property,
      Event,
      Operator,
      Unit,
      Value,
      Constant,
      Enum,
      EnumMember,
      Keyword,
      Text,
      Color,
      File,
      Reference,
      Customcolor,
      Folder,
      TypeParameter,
      User,
      Issue,
      Snippet,
    }

    export enum CompletionItemInsertTextRule {
      InsertAsSnippet = 1,
    }

    export function register(options: any): void;
    export function registerCompletionItemProvider(language: string, provider: any): any;
  }
}
