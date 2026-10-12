import {
  AtSign, Bookmark, BookOpen, Bot, Briefcase, Brush, Building2, CalendarDays, Camera, ChartColumn, Check,
  CircleCheck, CircleX, Clapperboard, ClipboardList, Clock, Coffee, CreditCard, Download, Dumbbell, Eye,
  FileText, Globe, Hand, Heart, Hourglass, Images, Landmark, Languages, Laptop, Leaf, Lightbulb, Link2, Lock,
  Mail, Map, MapPin, Maximize, Megaphone, MessageCircle, Music, Package, Paperclip, PartyPopper, Pencil, Pizza,
  Play, Radio, RefreshCw, Rocket, Save, Search, Send, Settings, Share2, Shield, ShoppingBag, Smartphone,
  Sparkles, Sprout, Star, Store, Tag, Target, ThumbsUp, Timer, Trash2, TreeDeciduous, TrendingUp,
  TriangleAlert, User, Users, Utensils, Video, Volume2, Wallet, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  alert: TriangleAlert,
  at: AtSign,
  bag: ShoppingBag,
  bank: Landmark,
  book: BookOpen,
  bookmark: Bookmark,
  bot: Bot,
  briefcase: Briefcase,
  brush: Brush,
  building: Building2,
  calendar: CalendarDays,
  camera: Camera,
  card: CreditCard,
  chart: ChartColumn,
  check: Check,
  'check-circle': CircleCheck,
  clapperboard: Clapperboard,
  clipboard: ClipboardList,
  clock: Clock,
  coffee: Coffee,
  download: Download,
  dumbbell: Dumbbell,
  edit: Pencil,
  eye: Eye,
  file: FileText,
  globe: Globe,
  hand: Hand,
  heart: Heart,
  hourglass: Hourglass,
  idea: Lightbulb,
  images: Images,
  languages: Languages,
  laptop: Laptop,
  leaf: Leaf,
  link: Link2,
  live: Radio,
  lock: Lock,
  mail: Mail,
  map: Map,
  maximize: Maximize,
  megaphone: Megaphone,
  message: MessageCircle,
  money: Wallet,
  music: Music,
  package: Package,
  paperclip: Paperclip,
  party: PartyPopper,
  phone: Smartphone,
  pin: MapPin,
  pizza: Pizza,
  play: Play,
  refresh: RefreshCw,
  rocket: Rocket,
  save: Save,
  search: Search,
  send: Send,
  settings: Settings,
  share: Share2,
  shield: Shield,
  sparkles: Sparkles,
  sprout: Sprout,
  star: Star,
  store: Store,
  tag: Tag,
  target: Target,
  'thumbs-up': ThumbsUp,
  timer: Timer,
  trash: Trash2,
  tree: TreeDeciduous,
  trending: TrendingUp,
  user: User,
  users: Users,
  utensils: Utensils,
  video: Video,
  volume: Volume2,
  wrench: Wrench,
  x: CircleX,
  zap: Zap,
};

interface UiIconProps {
  name: string;
  size?: number | string;
  className?: string;
}

/** Line icon looked up by name; sizes to the surrounding font by default. */
export default function UiIcon({ name, size = '1em', className }: UiIconProps) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return (
    <Icon
      size={size}
      strokeWidth={2}
      className={className}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: '-0.125em', flexShrink: 0 }}
    />
  );
}
