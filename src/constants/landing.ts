import { Cpu, PlayCircle, Save, type LucideIcon } from 'lucide-react';

export type LandingFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: Cpu,
    title: 'Intuitive Design',
    description:
      'Create Finite State Machines, Pushdown Automata, and Turing Machines with our user-friendly interface.',
  },
  {
    icon: Save,
    title: 'Save and Load',
    description:
      'Store your automaton designs and load them anytime for further editing or testing.',
  },
  {
    icon: PlayCircle,
    title: 'Interactive Testing',
    description: 'Run your automatons with custom inputs and visualize the step-by-step execution.',
  },
];
