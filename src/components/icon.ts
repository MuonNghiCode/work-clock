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
  X, RotateCcw, Check, UserRound,
  FolderDot,
  User,
  Wallet,
  Newspaper,
  Hourglass,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

import { GoArrowUpRight } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa6";
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
  Return: RotateCcw,
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
  // Return: FaArrowRotateLeft,
  Pending: Hourglass,
};

export default Icons;
