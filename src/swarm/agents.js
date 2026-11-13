/**
 * The swarm: five labelled "lead" agents plus small unlabelled worker cursors.
 * Colours stay inside the black / red / white family so the page keeps one identity.
 * `ink` is the label text colour for contrast on the agent colour.
 */
export const LEADS = [
  { id: "design", label: "DESIGN", color: "#E5252A", ink: "#FFFFFF" },
  { id: "frontend", label: "FRONTEND", color: "#F2F2F2", ink: "#070708" },
  { id: "backend", label: "BACKEND", color: "#B0141A", ink: "#FFFFFF" },
  { id: "motion", label: "MOTION", color: "#FF8A76", ink: "#070708" },
  { id: "system", label: "SYSTEM", color: "#B8B8BF", ink: "#070708" },
];

const WORKER_COLORS = ["#FF4D4F", "#F2F2F2", "#FF8A76", "#C9C9CF", "#E5252A", "#FFB4A8", "#9E9EA6", "#FF6B5E"];

export function createAgents(total) {
  const workers = Array.from({ length: Math.max(0, total - LEADS.length) }, (_, i) => ({
    id: `w${i}`,
    label: null,
    color: WORKER_COLORS[i % WORKER_COLORS.length],
    ink: "#070708",
  }));
  return [...LEADS, ...workers];
}

export const AGENT_COLORS = [...LEADS.map((a) => a.color), ...WORKER_COLORS];

let registry = new Map();
export const registerAgents = (list) => {
  registry = new Map(list.map((a) => [a.id, a]));
};
export const agentColor = (id) => registry.get(id)?.color ?? "#E5252A";
export const agentInk = (id) => registry.get(id)?.ink ?? "#070708";
