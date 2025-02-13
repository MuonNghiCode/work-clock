import {
  Clock,
  Calendar,
  LayoutDashboard,
  ChartColumn,
  LogOut,
  Settings,
} from "lucide-react";

// Định nghĩa kiểu dữ liệu cho danh sách icon
type IconType = {
  [key: string]: React.ComponentType;
};

const Icons: IconType = {
  Clock: Clock,
  Calendar: Calendar,
  Dashboard: LayoutDashboard,
  ChartColumn: ChartColumn,
  LogOut: LogOut,
  Settings: Settings,
};

export default Icons;
