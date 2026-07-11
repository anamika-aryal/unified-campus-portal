import { cn } from "@/lib/utils";

export default function NavPill({ icon: Icon, label, active, collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        collapsed && "justify-center",
      )}
    >
      {Icon && <Icon className="h-[18px] w-[18px] shrink-0" />}
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
