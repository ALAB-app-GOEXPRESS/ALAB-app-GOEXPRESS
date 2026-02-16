import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ClassList() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg">全クラス</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>指定席</DropdownMenuItem>
        <DropdownMenuItem>グリーン席</DropdownMenuItem>
        <DropdownMenuItem>グランクラス</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
