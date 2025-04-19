import { Search } from "lucide-react"

import { cn } from "@/lib/ui/utils"
import { Input } from "./input"
import { TableCell, TableHead, TableRow } from "./table"

export const TableHeadButton = ({ children, onClick, className }: {
  children: React.ReactNode,
  onClick?: React.MouseEventHandler,
  className?: string,
}) => (
  <TableHead 
    className={cn("md:text-base hover:bg-accent text-secondary-foreground/80 hover:text-accent-foreground cursor-pointer text-nowrap", className)}
    onClick={onClick}>
    <span className="inline-flex items-center gap-2">
      {children}
    </span>
  </TableHead>
)

export const InputSearch = ({ value, onChange }: {
  value: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
}) => (
  <div className="relative flex-1">
    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search..."
      className="pl-8"
      value={value}
      onChange={onChange}
    />
  </div>
)

export const EmptyTableRow = ({ colSpan, text }: { colSpan: number, text: string }) => (
  <TableRow className="h-14 text-center text-muted-foreground">
    <TableCell colSpan={colSpan}>
      {text}
    </TableCell>
  </TableRow>
)