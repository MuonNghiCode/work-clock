import {
  Clock,
  Calendar,
  LayoutDashboard,
  ChartColumn,
  LogOut,
  Settings,
} from "lucide-react";

import { GoArrowUpRight } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa6";

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
  ArrowUpRight: GoArrowUpRight,
  ArrowRight: FaArrowRight,
};

export default Icons;
