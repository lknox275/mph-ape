// ─── App-wide type definitions ───────────────────────────────────────────────
// Extracted from App.tsx to make the shape of the domain visible in one place.

import type React from "react";

// ─── Navigation / view state ─────────────────────────────────────────────────

export type PatientTab = "profile" | "visit" | "labs" | "medications" | "documents";
export type AppView = "dashboard" | "patients" | "patient-record";

// ─── Core clinical entities ──────────────────────────────────────────────────

export type Patient = {
  id: string;
  name: string;
  dob: string;
  age: number;
  gender: string;
  mrn: string;
  insurance: string;
  phone: string;
  email: string;
  address: string;
  allergies: string[];
  diagnosis: string;
  stage: string;
  ecog: string;
  cycleInfo: string;
  conditions: string[];
  medications: string[];
  lastVisit: string;
  oncologist: string;
  nurse: string;
};

export type Appointment = {
  id: string;
  time: string;
  duration: string;
  patient: Patient;
  type: string;
  visitCategory: "immunotherapy" | "chemotherapy" | "follow-up" | "consult";
  status: "upcoming" | "in-progress" | "completed" | "checked-in";
};

export type VisitRecord = {
  id: string;
  date: string;
  type: string;
  category: Appointment["visitCategory"];
  status: "completed" | "in-progress";
  cycle: string;
  provider: string;
};

// ─── Baseline comparison (CDS) ───────────────────────────────────────────────

export type BaselineMetric = {
  label: string;
  baseline: string;
  current: string;
  flag: "green" | "yellow" | "red";
  note: string;
};

// ─── CTCAE assessment ────────────────────────────────────────────────────────

export type ModuleResult = {
  screening: "yes" | "no" | null;
  checkedSymptoms: string[];
  notes: string;
  labOverrides: Record<string, string>;
  customValue: string;
  grade: number | null;
  gradeIsAuto?: boolean;
  perMetricGrades?: Record<string, number | null>;
};

export type CTCAEModuleDef = {
  id: string;
  label: string;
  screeningQ: string;
  symptoms?: string[];
  customField?: { label: string; unit: string; placeholder: string };
  labFields?: { key: string; label: string; unit: string; sourceKey?: string; uln?: number; lln?: number }[];
  labNote?: string;
  grades: { grade: number; description: string }[];
  perMetricGrades?: Record<string, { grade: number; description: string }[]>;
  // Free-text mode: presence of this switches the detail phase to a single
  // textarea + instructional link and skips the grade selection phase.
  // Completion is measured by non-empty `notes` on the ModuleResult.
  freeText?: { instruction: string; ctcaeLink?: string; placeholder?: string };
};

// Threshold table for baseline-aware hepatic grading.
// See ctcae.ts for the HEP_THRESHOLDS values and autoGradeHepMetric logic.
export type HepThresholds = {
  normal: number[];      // grade upper multiples of ULN
  elevated: number[];    // grade upper multiples of baseline
  elevatedG3CapMultiple?: number;
};

// A single row of the side-by-side grade table (baseline-normal vs
// baseline-elevated / baseline-below-LLN).
export type PairedGradeRow = {
  grade: number;
  normalDesc: string;
  elevatedDesc: string;
};

// ─── Escalation workflow (Grade ≥2 findings) ─────────────────────────────────

export type EscalationState = {
  nurseNotes: string;
  notificationMethod: "ehr" | "in-person" | "phone" | "secure-message" | "other" | "";
  ehrMessageOverride: string;
  notificationMessage: string;
  notificationConfirmed: boolean;
  // Orders are provider-entered in a separate system and DISPLAYED here read-only
  // via buildProviderOrders(); we don't collect them in the nurse UI.
  treatmentDecision: "continue" | "hold" | "discontinue" | "other" | "";
  treatmentDecisionOther: string;
  nurseFollowUp: string;
  patientEducation: string;
};

// Provider orders (mock generator — see buildProviderOrders in ctcae.ts).
export type OrderCategory = "medication" | "lab" | "imaging" | "follow-up" | "consult";

export type ProviderOrder = {
  category: OrderCategory;
  title: string;
  detail?: string;
  rationale?: string;
};

export type ProviderOrderSet = {
  orders: ProviderOrder[];
  providerNotes: string;
};

// ─── Encounter note workflow (step-based documentation) ──────────────────────

export type FieldDef = {
  key: string;
  label: string;
  value: string;
  type?: "text" | "select" | "textarea" | "number";
  options?: string[];
};

// Icon is a lucide-react component. Widened to accept lucide's actual
// ForwardRefExoticComponent props (size can be number|string, not just
// number, and it accepts more DOM props than the app happens to pass).
export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>;

export type StepTemplate = {
  id: string;
  icon: IconComponent;
  label: string;
  description: string;
  color: string;
  bg: string;
  fields: FieldDef[];
};

export type WorkflowStep = StepTemplate & {
  instanceId: string;
  fieldValues: Record<string, string>;
};
