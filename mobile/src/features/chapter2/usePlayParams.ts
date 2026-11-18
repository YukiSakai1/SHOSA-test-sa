/** 2章プレイ画面の URL パラメータ（role / scenario / step）を検証して取り出す */
import { useLocalSearchParams } from 'expo-router';
import { findRole, type Role, type Scenario, type ScenarioStep } from '@/content/chapter2';

export interface PlayParams {
  role: Role;
  scenario: Scenario;
  scenarioIndex: number;
  step: ScenarioStep;
  stepIndex: number;
}

export function usePlayParams(): PlayParams | null {
  const p = useLocalSearchParams<{ role: string; scenario: string; step: string }>();
  const role = findRole(p.role);
  const scenarioIndex = role ? role.scenarios.findIndex((s) => s.id === p.scenario) : -1;
  const scenario = role?.scenarios[scenarioIndex];
  const stepIndex = Number(p.step);
  const step = scenario && Number.isInteger(stepIndex) ? scenario.steps[stepIndex] : undefined;
  if (!role || !scenario || !step) return null;
  return { role, scenario, scenarioIndex, step, stepIndex };
}

/** シナリオ全体での進捗（situation と question で 1設問 = 2ステップ） */
export function playPercent(scenario: Scenario, stepIndex: number, phase: 1 | 2): number {
  return Math.round(((stepIndex * 2 + phase) / (scenario.steps.length * 2)) * 100);
}
