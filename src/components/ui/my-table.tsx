import { Search } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { TableCell, TableHead, TableRow } from "./table"

export const TableHeadButton = ({ children, onClick }: {
  children: React.ReactNode,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
}) => (
  <TableHead className="p-0">
    <Button
      variant="ghost"
      className="w-full p-2 justify-start md:text-base"
      onClick={onClick}
    >
      {children}
    </Button>
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