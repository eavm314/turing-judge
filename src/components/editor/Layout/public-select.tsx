import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function PublicSelect({ isPublic }: { isPublic: boolean }) {
  return (
    <Select defaultValue={String(isPublic)} >
      <SelectTrigger className="w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">Public</SelectItem>
        <SelectItem value="false">Private</SelectItem>
      </SelectContent>
    </Select>
  );
}