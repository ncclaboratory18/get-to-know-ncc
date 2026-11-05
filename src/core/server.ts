export type Distribution = "even" | "single";
export interface ServerState {
  time: number;
  queues: number[];
  loads: number[];
  budget: number;
  goodTime: number;
  distribution: Distribution;
  users: number;
  response: number;
  status: "running" | "won" | "lost";
}
export function initialServer(): ServerState {
  return {
    time: 0,
    queues: [0, 0],
    loads: [0.5, 0.5],
    budget: 90,
    goodTime: 0,
    distribution: "even",
    users: 20,
    response: 0.2,
    status: "running",
  };
}
export const scheduledUsers = (t: number) =>
  t < 8 ? 20 : t < 16 ? 50 : t < 24 ? 70 : 30;
export function resizeServers(state: ServerState, count: number): ServerState {
  count = Math.max(1, Math.min(4, count));
  const queues = [...state.queues];
  while (queues.length < count) queues.push(0);
  while (queues.length > count) {
    const displaced = queues.pop()!;
    if (state.distribution === "single") queues[0] += displaced;
    else
      queues.forEach((_, i) => {
        queues[i] += displaced / queues.length;
      });
  }
  const loads = queues.map((q, i) =>
    Math.min(
      1,
      (q / 0.1 +
        (state.distribution === "even"
          ? state.users / count
          : i === 0
            ? state.users
            : 0)) /
        20,
    ),
  );
  return { ...state, queues, loads, response: 0.2 + Math.max(...queues) / 20 };
}
export function stepServer(
  state: ServerState,
  dt: number,
  challenge: boolean,
  practiceUsers = 20,
): ServerState {
  if (state.status !== "running") return state;
  const n = state.queues.length;
  let elapsed = challenge
    ? Math.min(dt, 30 - state.time, state.budget / n)
    : dt;
  elapsed = Math.max(0, elapsed);
  const users = challenge ? scheduledUsers(state.time + 1e-8) : practiceUsers;
  const loads = state.queues.map((q, i) =>
    elapsed > 0
      ? Math.min(
          1,
          (q / elapsed +
            (state.distribution === "even" ? users / n : i === 0 ? users : 0)) /
            20,
        )
      : state.loads[i],
  );
  const queues = state.queues.map((q, i) =>
    Math.max(
      0,
      q +
        ((state.distribution === "even" ? users / n : i === 0 ? users : 0) -
          20) *
          elapsed,
    ),
  );
  const response = 0.2 + Math.max(...queues) / 20;
  const time = Math.min(30, state.time + elapsed);
  const budget = challenge ? Math.max(0, state.budget - n * elapsed) : 90;
  const goodTime = state.goodTime + (response <= 1 + 1e-8 ? elapsed : 0);
  let status: ServerState["status"] = "running";
  if (challenge && time >= 30 - 1e-8)
    status =
      goodTime >= 24 - 1e-8 && queues.reduce((a, b) => a + b, 0) <= 20 + 1e-8
        ? "won"
        : "lost";
  else if (challenge && budget <= 1e-8) status = "lost";
  return {
    ...state,
    time: challenge ? time : 0,
    queues,
    loads,
    budget,
    response,
    users,
    goodTime,
    status,
  };
}
