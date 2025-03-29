import {
  Clock,
  Calendar,
  LayoutDashboard,
  ChartColumn,
  LogOut,
  Settings,
  Bell,
  CircleHelp,
  Grip,
  X, Check, UserRound,
  History,
  FolderDot,
  User,
  Wallet,
  Newspaper,
  Hourglass,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Trash2,
  Eye,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Menu,
  Facebook,
  Instagram,
  Search
} from "lucide-react";
import {
  FaUsers,
  FaMoneyBillWave,
  FaProjectDiagram,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

import { BiMenuAltLeft } from "react-icons/bi";
import { GoArrowUpRight } from "react-icons/go";
import { FaArrowRight, FaCircleLeft } from "react-icons/fa6";
import { MdOutlineEmail, MdApproval, MdCancel } from "react-icons/md";
import { CiLock, CiUnlock } from "react-icons/ci";

// Định nghĩa kiểu dữ liệu cho danh sách icon
type IconType = {
  [key: string]: React.FC<React.SVGProps<SVGSVGElement>>;
};

const Icons: IconType = {
  Clock: Clock,
  Calendar: Calendar,
  Dashboard: LayoutDashboard,
  ChartColumn: ChartColumn,
  LogOut: LogOut,
  Settings: Settings,
  FolderDot: FolderDot,
  User: User,
  Wallet: Wallet,
  ArrowUpRight: GoArrowUpRight,
  ArrowRight: FaArrowRight,
  Email: MdOutlineEmail,
  Lock: CiLock,
  Unlock: CiUnlock,
  Approve: Check,
  Reject: X,
  // Return: RotateCcw,
  Check: Check,
  // CircleUser: CircleUser,
  ChevronRight: ChevronRight,
  ChevronLeft: ChevronLeft,
  UserAdmin: UserRound,
  Help: CircleHelp,
  Bell: Bell,
  Menu: Grip,
  MdApproval: MdApproval,
  FormIcon: Newspaper,
  Cancel: MdCancel,
  Return: FaCircleLeft,
  Pending: Hourglass,
  Project: FaProjectDiagram,
  UserCount: FaUsers,
  Money: FaMoneyBillWave,
  CircleCheck: FaCheckCircle,
  CircleReject: FaTimesCircle,
  CirclePending: FaClock,
  Detail: Eye,
  Edit: Pencil,
  Delete: Trash2,
  Dollar: DollarSign,
  Phone: Phone,
  Mail: Mail,
  MapPin: MapPin,
  Menu2: Menu,
  Facebook: Facebook,
  Instagram: Instagram,
  SearchIcon: Search,
  Menu3: BiMenuAltLeft,
  History: History,
};

export default Icons;
