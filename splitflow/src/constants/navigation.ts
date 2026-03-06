import { 
  Squares2X2Icon, 
  UserGroupIcon, 
  ClockIcon, 
  UserIcon 
} from "@heroicons/react/24/outline";

export const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: Squares2X2Icon },
  { name: "All Groups", path: "/groups", icon: UserGroupIcon },
  { name: "Recent Activity", path: "/activity", icon: ClockIcon },
  { name: "Friends", path: "/friends", icon: UserIcon },
];
