/// <reference types="vite/client" />

declare module 'lucide-react' {
  import type { ComponentType, SVGProps } from 'react'
  interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number
  }
  type Icon = ComponentType<LucideProps>
  export const Menu: Icon
  export const X: Icon
  export const LogOut: Icon
  export const User: Icon
  export const LayoutDashboard: Icon
  export const LogIn: Icon
  export const UserPlus: Icon
  export const Users: Icon
  export const CheckCircle: Icon
  export const Clock: Icon
  export const XCircle: Icon
  export const Award: Icon
  export const Copy: Icon
  export const ExternalLink: Icon
  export const Save: Icon
  export const Shield: Icon
  export const Trash2: Icon
  export const GraduationCap: Icon
  export const Share2: Icon
  export const Activity: Icon
  export const List: Icon
  export const Trophy: Icon
  export const Plus: Icon
  export const Edit: Icon
  export const Target: Icon
  export const Zap: Icon
  export const BookOpen: Icon
  export const AlertTriangle: Icon
  export const MapPin: Icon
  export const Building2: Icon
  export const Edit3: Icon
}
