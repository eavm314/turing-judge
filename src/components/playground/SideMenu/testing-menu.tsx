import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EPSILON } from '@/constants/symbols';
import { useToast } from '@/hooks/use-toast';
import AutomatonManager from '@/lib/automata/AutomatonManager';
import {
  usePlaygroundMode,
  useSimulationWord,
} from '@/providers/playground-provider';

export default function TestingMenu() {
  const { word, setWord } = useSimulationWord();
  const { mode } = usePlaygroundMode();
  const { toast } = useToast();

  const handleTest = () => {
    const executor = AutomatonManager.getExecutor();
    const executionConfig = executor.getConfig();
    const { accepted, depthLimitReached, maxLimitReached } = executor.execute(word);
    if (accepted) {
      toast({
        title: 'Accepted',
        variant: 'success',
      });
    } else {
      toast({
        title: 'Rejected',
        description: maxLimitReached
          ? `Reached the maximum of ${executionConfig.maxSteps} steps. Potential infinite loop.`
          : depthLimitReached
            ? `Explored the maximum depth of ${executionConfig.depthLimit}. Potential infinite loop.`
            : undefined,
        variant: 'destructive',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTest();
    }
  };

  return (
    <div className="p-3 space-y-1">
      <h2>Testing</h2>
      <Label htmlFor="test-input" className="text-muted-foreground">
        Enter input string
      </Label>
      <Input
        id="test-input"
        data-testid="test-input"
        value={word}
        onChange={e => setWord(e.target.value)}
        disabled={mode === 'simulation'}
        type="text"
        className="font-mono placeholder:font-mono disabled:opacity-100"
        placeholder={EPSILON}
        onKeyDown={handleKeyDown}
      />
      <div className="flex gap-2 pt-1">
        <Button className="w-full text-base" onClick={handleTest}>
          Test
        </Button>
      </div>
    </div>
  );
}
