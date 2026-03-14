import { AutomatonType } from "@prisma/browser";

const exampleProjects = [
  {
    id: 'pilw80yiq2vnjy2w1gm8hi5q',
    title: 'Even Ones',
    type: AutomatonType.FSM,
    automaton: {"finals": ["q0"], "states": {"q0": {"position": {"x": -150, "y": 0}, "transitions": {"q0": ["0"], "q1": ["1"]}}, "q1": {"position": {"x": 150, "y": 0}, "transitions": {"q0": ["1"], "q1": ["0"]}}}, "initial": "q0", "alphabet": ["0", "1"]},
  },
  {
    id: 'q25bcbnu07apqx6iiv08qhx2',
    title: 'Ends with "01"',
    type: AutomatonType.FSM,
    automaton: {"finals": ["q2"], "states": {"q0": {"position": {"x": -200, "y": 0}, "transitions": {"q0": ["1"], "q1": ["0"]}}, "q1": {"position": {"x": 0, "y": -200}, "transitions": {"q1": ["0"], "q2": ["1"]}}, "q2": {"position": {"x": 200, "y": 0}, "transitions": {"q0": ["1"], "q1": ["0"]}}}, "initial": "q0", "alphabet": ["0", "1"]},
  },
  {
    id: 'h147pt8jj29gpztrpob0oeft',
    title: '3-Char Palindrome',
    type: AutomatonType.FSM,
    automaton: {"finals": ["q_a"], "states": {"q0": {"position": {"x": -360, "y": 28}, "transitions": {"q1": ["0"], "q2": ["1"]}}, "q1": {"position": {"x": -168, "y": -106}, "transitions": {"q3": ["0"], "q4": ["1"]}}, "q2": {"position": {"x": -185, "y": 93}, "transitions": {"q5": ["0"], "q6": ["1"]}}, "q3": {"position": {"x": 0, "y": -154}, "transitions": {"q_a": ["0"], "q_r": ["1"]}}, "q4": {"position": {"x": 0, "y": -50}, "transitions": {"q_a": ["0"], "q_r": ["1"]}}, "q5": {"position": {"x": 0, "y": 50}, "transitions": {"q_a": ["1"], "q_r": ["0"]}}, "q6": {"position": {"x": 0, "y": 150}, "transitions": {"q_a": ["1"], "q_r": ["0"]}}, "q_a": {"position": {"x": 373, "y": 154}, "transitions": {}}, "q_r": {"position": {"x": 395, "y": -174}, "transitions": {}}}, "initial": "q0", "alphabet": ["0", "1"]},
  },
  {
    id: 'bganvr3nc18rura47zpx46vi',
    title: 'Divisible by 3',
    type: AutomatonType.FSM,
    automaton: {"finals": ["q0"], "states": {"q0": {"position": {"x": -300, "y": 0}, "transitions": {"q0": ["0"], "q1": ["1"]}}, "q1": {"position": {"x": 0, "y": 0}, "transitions": {"q0": ["1"], "q2": ["0"]}}, "q2": {"position": {"x": 300, "y": 0}, "transitions": {"q1": ["0"], "q2": ["1"]}}}, "initial": "q0", "alphabet": ["0", "1"]},
  },
  {
    id: 'x9h6i1odejrjr54mxe79a5n9',
    title: 'Simple NFA',
    type: AutomatonType.FSM,
    automaton: {"finals": ["q2"], "states": {"q0": {"position": {"x": -190, "y": -71}, "transitions": {"q0": ["0", "1"], "q2": ["1"]}}, "q2": {"position": {"x": 160, "y": -70}, "transitions": {}}}, "initial": "q0", "alphabet": ["0", "1"]},
  }
];

export default exampleProjects;