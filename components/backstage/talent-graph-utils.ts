import { Student } from "@/components/mock-data-context";

export const DISCIPLINES = ["Canto", "Danza", "Interpretación", "Música", "Dinámica"] as const;

export type TalentDiscipline = (typeof DISCIPLINES)[number];

export type TalentStudentRow = {
  student: Student;
  discipline: TalentDiscipline;
  avgSkill: number;
  rank: number;
};

export type TalentDisciplineSummary = {
  discipline: TalentDiscipline;
  color: string;
  count: number;
  share: number;
  avgSkill: number;
  avgAttendance: number;
  topRows: TalentStudentRow[];
  riskRows: TalentStudentRow[];
};

export const DISC_COLORS: Record<TalentDiscipline, string> = {
  Canto: "#f97316",
  Danza: "#7c5cff",
  Interpretación: "#20c77a",
  Música: "#f6bd4a",
  Dinámica: "#4f8df7",
};

export function getStudentAvgSkill(student: Student) {
  return student.skills.length
    ? student.skills.reduce((total, skill) => total + skill.level, 0) / student.skills.length
    : 0;
}

export function getPrimaryDiscipline(student: Student): TalentDiscipline {
  const totals = DISCIPLINES.map((discipline) => {
    const skills = student.skills.filter((skill) => skill.category === discipline);
    const avg = skills.length ? skills.reduce((total, skill) => total + skill.level, 0) / skills.length : 0;
    return { discipline, avg, count: skills.length };
  });

  return totals.sort((a, b) => b.avg - a.avg || b.count - a.count)[0]?.discipline ?? "Canto";
}

export function getTalentAlertReason(row: TalentStudentRow) {
  const reasons = [];
  if (row.student.attendance < 86) reasons.push(`Asistencia ${row.student.attendance}%`);
  if (row.avgSkill < 6.4) reasons.push(`Nivel medio ${row.avgSkill.toFixed(1)}`);
  if (!row.student.punctuality) reasons.push("Puntualidad irregular");
  return reasons.length ? reasons.join(" · ") : "seguimiento preventivo";
}
