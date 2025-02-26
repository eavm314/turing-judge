import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SideMenu() {
  const result = null;

  return (
    <div className="w-72 p-4">
      <h2 className="text-lg font-bold mb-4">Test Cases</h2>
      <Input
        type="text"
        placeholder="Enter test string"
        className="mb-2"
      />
      <Button className="w-full mb-2">
        Test
      </Button>
      {result && <div className={`p-2 ${result === "Accepted" ? "bg-green-200" : "bg-red-200"}`}>{result}</div>}
    </div>
  )
}