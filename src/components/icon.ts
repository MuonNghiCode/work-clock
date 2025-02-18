import {
  Clock,
  Calendar,
  LayoutDashboard,
  ChartColumn,
  LogOut,
  Settings,
  X, RotateCcw, Check, CircleUser,
  FolderDot,
  User,
  Wallet,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

import { GoArrowUpRight } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineEmail,MdApproval  } from "react-icons/md";
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
  CircleUser: CircleUser,
  MdApproval: MdApproval,
  ChevronRight: ChevronRight,
  ChevronLeft: ChevronLeft
};

export default Icons;
