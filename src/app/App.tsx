import { useState } from "react";
import {
  Activity, Users, Calendar, FileText, Settings, Bell,
  ChevronRight, Search, Save, ClipboardList,
  Stethoscope, Pill, Heart, UserCheck, CheckCircle2, AlertCircle, AlertTriangle,
  LogOut, BookOpen, Droplets, FlaskConical, ShieldCheck,
  GitBranch, Phone, Mail, MapPin, Edit3,
  Zap, Lock, ChevronsLeft, ChevronsRight,
  Camera, Users2, ClipboardCheck,
} from "lucide-react";
import type {
  PatientTab, AppView, Patient, Appointment, VisitRecord,
  BaselineMetric, ModuleResult, CTCAEModuleDef, HepThresholds, PairedGradeRow,
  EscalationState, OrderCategory, ProviderOrder, ProviderOrderSet,
  StepTemplate, WorkflowStep, IconComponent,
} from "./types";

const DEFAULT_ESCALATION: EscalationState = {
  nurseNotes: "", notificationMethod: "", ehrMessageOverride: "", notificationMessage: "",
  notificationConfirmed: false,
  treatmentDecision: "", treatmentDecisionOther: "",
  nurseFollowUp: "", patientEducation: "",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PATIENTS: Record<string, Patient> = {
  p1: {
    id: "p1", name: "Robert Fanning", dob: "Mar 14, 1958", age: 66, gender: "Male",
    mrn: "MRN-1093045", insurance: "Medicare Advantage", phone: "(612) 555-0184",
    email: "r.fanning@email.com", address: "2214 Oak Ridge Dr, Minneapolis, MN 55401",
    allergies: ["Codeine"], diagnosis: "Non-Small Cell Lung Cancer (NSCLC)",
    stage: "Stage IIIB · PD-L1 ≥50%", ecog: "ECOG 1",
    cycleInfo: "Pembrolizumab · Cycle 9, Day 1",
    conditions: ["HTN", "Type 2 Diabetes", "CKD Stage 2"],
    medications: ["Pembrolizumab 200mg Q3W", "Metformin 1000mg BID", "Lisinopril 10mg daily"],
    lastVisit: "Jun 18, 2026", oncologist: "Dr. A. Patel", nurse: "T. Robinson, RN",
  },
  p2: {
    id: "p2", name: "Priya Nair", dob: "Jul 22, 1985", age: 40, gender: "Female",
    mrn: "MRN-2204817", insurance: "Blue Cross PPO", phone: "(612) 555-0237",
    email: "p.nair@email.com", address: "819 Birchwood Ave, St. Paul, MN 55105",
    allergies: ["Penicillin", "Sulfa"], diagnosis: "Triple-Negative Breast Cancer (TNBC)",
    stage: "Stage II · PD-L1 CPS 22", ecog: "ECOG 0",
    cycleInfo: "Pembrolizumab + Paclitaxel · Cycle 4, Day 1",
    conditions: ["Anxiety", "Hypothyroidism"],
    medications: ["Pembrolizumab 200mg Q3W", "Paclitaxel 80mg/m² weekly", "Levothyroxine 75mcg daily"],
    lastVisit: "Jun 11, 2026", oncologist: "Dr. A. Patel", nurse: "M. Chen, RN",
  },
  p3: {
    id: "p3", name: "Thomas Osei", dob: "Nov 3, 1971", age: 53, gender: "Male",
    mrn: "MRN-3381924", insurance: "Aetna HMO", phone: "(651) 555-0319",
    email: "t.osei@email.com", address: "440 Linden St, Edina, MN 55424",
    allergies: [], diagnosis: "Metastatic Melanoma",
    stage: "Stage IV · BRAF V600E wild-type", ecog: "ECOG 1",
    cycleInfo: "Nivolumab + Ipilimumab · Cycle 2, Day 1",
    conditions: ["GERD", "Hyperlipidemia"],
    medications: ["Nivolumab 3mg/kg Q3W", "Ipilimumab 1mg/kg Q6W", "Omeprazole 20mg daily"],
    lastVisit: "Jun 18, 2026", oncologist: "Dr. S. Kim", nurse: "T. Robinson, RN",
  },
  p4: {
    id: "p4", name: "Linda Morales", dob: "Apr 30, 1949", age: 76, gender: "Female",
    mrn: "MRN-4452309", insurance: "Medicare", phone: "(952) 555-0472",
    email: "l.morales@email.com", address: "31 Maple Grove Rd, Bloomington, MN 55420",
    allergies: ["Aspirin (GI bleed)"], diagnosis: "Ovarian Cancer (High-Grade Serous)",
    stage: "Stage IIIC · BRCA1 mutated", ecog: "ECOG 2",
    cycleInfo: "Carboplatin + Paclitaxel · Cycle 3, Day 1",
    conditions: ["Atrial Fibrillation", "Osteoporosis"],
    medications: ["Carboplatin AUC 5 Q3W", "Paclitaxel 175mg/m² Q3W", "Apixaban 5mg BID"],
    lastVisit: "Jun 18, 2026", oncologist: "Dr. S. Kim", nurse: "M. Chen, RN",
  },
  p5: {
    id: "p5", name: "James Whitfield", dob: "Sep 7, 1990", age: 35, gender: "Male",
    mrn: "MRN-5510482", insurance: "United Health PPO", phone: "(763) 555-0551",
    email: "j.whitfield@email.com", address: "7702 Cedar Lake Rd, Plymouth, MN 55441",
    allergies: [], diagnosis: "Classical Hodgkin Lymphoma",
    stage: "Stage IIB · Relapsed/Refractory", ecog: "ECOG 1",
    cycleInfo: "Pembrolizumab · Cycle 6, Day 1",
    conditions: ["Asthma (mild)"],
    medications: ["Pembrolizumab 200mg Q3W", "Albuterol inhaler PRN"],
    lastVisit: "Jun 18, 2026", oncologist: "Dr. A. Patel", nurse: "T. Robinson, RN",
  },
  p6: {
    id: "p6", name: "Diana Rourke", dob: "Feb 19, 1963", age: 63, gender: "Female",
    mrn: "MRN-6672103", insurance: "Cigna PPO", phone: "(612) 555-0698",
    email: "d.rourke@email.com", address: "1005 Park Ave S, Minneapolis, MN 55404",
    allergies: ["Sulfa"], diagnosis: "Renal Cell Carcinoma (Clear Cell)",
    stage: "Stage IV · PD-L1 positive", ecog: "ECOG 0",
    cycleInfo: "Nivolumab + Cabozantinib · Cycle 11, Day 1",
    conditions: ["Hypothyroidism", "HTN"],
    medications: ["Nivolumab 240mg Q4W", "Cabozantinib 40mg daily", "Levothyroxine 50mcg daily"],
    lastVisit: "Jun 11, 2026", oncologist: "Dr. S. Kim", nurse: "M. Chen, RN",
  },
};

const ALL_PATIENTS = Object.values(PATIENTS);

const SCHEDULE: Appointment[] = [
  { id: "a1", time: "8:30 AM",  duration: "90 min",  patient: PATIENTS.p1, type: "Immunotherapy Infusion — Pembrolizumab C9D1",              visitCategory: "immunotherapy", status: "completed"   },
  { id: "a2", time: "10:00 AM", duration: "120 min", patient: PATIENTS.p2, type: "Immunotherapy Infusion — Pembrolizumab + Paclitaxel C4D1", visitCategory: "immunotherapy", status: "in-progress" },
  { id: "a3", time: "11:30 AM", duration: "30 min",  patient: PATIENTS.p3, type: "Pre-Treatment Assessment — Nivo/Ipi C2D1",                 visitCategory: "immunotherapy", status: "checked-in"  },
  { id: "a4", time: "1:00 PM",  duration: "120 min", patient: PATIENTS.p4, type: "Chemotherapy Infusion — Carboplatin + Paclitaxel C3D1",    visitCategory: "chemotherapy",  status: "upcoming"    },
  { id: "a5", time: "2:30 PM",  duration: "90 min",  patient: PATIENTS.p5, type: "Immunotherapy Infusion — Pembrolizumab C6D1",              visitCategory: "immunotherapy", status: "upcoming"    },
  { id: "a6", time: "4:00 PM",  duration: "30 min",  patient: PATIENTS.p6, type: "Treatment Response & Toxicity Review",                     visitCategory: "follow-up",     status: "upcoming"    },
];

// ─── Workflow Step Templates ───────────────────────────────────────────────────

// Two-hue accent system for workflow steps:
//   STEP_STANDARD — routine documentation (blue accent = attention without alarm)
//   STEP_CRITICAL — decision/action steps (Clearance, Infusion) where color earns the ink
// NOTE: `color` values here are raw hex because they're concatenated with an
// alpha suffix (e.g. `${step.color}25`) at several call sites. CSS custom
// properties can't be alpha-suffixed via string concat.
// `bg` values are plain backgrounds so they can use tokens.
const STEP_STANDARD = { color:"#1a6efa", bg:"var(--accent-soft-bg)" };
const STEP_CRITICAL = { color:"#c0392b", bg:"var(--sev-critical-bg)" };

const STEP_TEMPLATES: StepTemplate[] = [
  { id:"vitals",     icon:Activity,     label:"Vital Signs",          description:"BP, HR, SpO2, temp, weight",               ...STEP_STANDARD,
    fields:[{key:"bp",label:"Blood Pressure (mmHg)",value:"",type:"text"},{key:"hr",label:"Heart Rate (bpm)",value:"",type:"number"},{key:"spo2",label:"SpO2 (%)",value:"",type:"number"},{key:"temp",label:"Temperature (°F)",value:"",type:"number"},{key:"weight",label:"Weight (lbs)",value:"",type:"number"}] },
  { id:"ecog",       icon:UserCheck,    label:"Performance Status",   description:"ECOG score and functional assessment",      ...STEP_STANDARD,
    fields:[{key:"ecog",label:"ECOG Score",value:"",type:"select",options:["0 — Fully active","1 — Restricted strenuous activity","2 — Ambulatory, limited self-care","3 — Limited self-care","4 — Completely disabled"]},{key:"kps",label:"Karnofsky Score (%)",value:"",type:"number"},{key:"notes",label:"Functional Notes",value:"",type:"textarea"}] },
  { id:"symptom",    icon:BookOpen,     label:"Symptom Assessment",   description:"CTCAE toxicity grading and irAE review",    ...STEP_STANDARD,
    fields:[{key:"assessment_complete", label:"Assessment", value:"", type:"text"}] },
  { id:"labs",       icon:FlaskConical, label:"Lab Review",           description:"CBC, CMP, thyroid, tumor markers",          ...STEP_STANDARD,
    fields:[{key:"wbc",label:"WBC (K/µL)",value:"",type:"number"},{key:"anc",label:"ANC (K/µL)",value:"",type:"number"},{key:"hgb",label:"Hemoglobin (g/dL)",value:"",type:"number"},{key:"plt",label:"Platelets (K/µL)",value:"",type:"number"},{key:"creatinine",label:"Creatinine (mg/dL)",value:"",type:"number"},{key:"alt",label:"ALT (U/L)",value:"",type:"number"},{key:"tsh",label:"TSH (mIU/L)",value:"",type:"number"},{key:"notes",label:"Lab Notes / Flags",value:"",type:"textarea"}] },
  { id:"clearance",  icon:ShieldCheck,  label:"Treatment Clearance",  description:"Eligibility check before infusion",         ...STEP_CRITICAL,
    fields:[{key:"cleared",label:"Cleared to Proceed",value:"Yes",type:"select",options:["Yes","Yes — with dose modification","Hold — toxicity","Hold — labs","Discontinue"]},{key:"dose_mod",label:"Dose Modification",value:"",type:"text"},{key:"rationale",label:"Clinical Rationale",value:"",type:"textarea"}] },
  { id:"infusion",   icon:Droplets,     label:"Infusion Documentation",description:"Agent, dose, rate, and administration",   ...STEP_CRITICAL,
    fields:[{key:"agent",label:"Therapeutic Agent",value:"",type:"text"},{key:"dose",label:"Dose (mg or mg/m²)",value:"",type:"text"},{key:"route",label:"Route",value:"IV",type:"select",options:["IV","SQ","PO"]},{key:"rate",label:"Infusion Rate",value:"",type:"text"},{key:"premeds",label:"Premedications Given",value:"",type:"textarea"},{key:"reactions",label:"Infusion Reactions",value:"None",type:"select",options:["None","Grade 1","Grade 2","Grade 3","Grade 4"]}] },
  { id:"response",   icon:Stethoscope,  label:"Treatment Response",   description:"Imaging review, RECIST assessment",         ...STEP_STANDARD,
    fields:[{key:"recist",label:"RECIST Response",value:"",type:"select",options:["Complete Response (CR)","Partial Response (PR)","Stable Disease (SD)","Progressive Disease (PD)","Not Evaluable"]},{key:"imaging",label:"Most Recent Imaging",value:"",type:"text"},{key:"markers",label:"Tumor Marker Trend",value:"",type:"text"},{key:"notes",label:"Clinical Assessment",value:"",type:"textarea"}] },
  { id:"plan",       icon:ClipboardList,label:"Plan & Next Steps",    description:"Next cycle, referrals, patient instructions",...STEP_STANDARD,
    fields:[{key:"next",label:"Next Treatment",value:"",type:"text"},{key:"date",label:"Next Appointment",value:"",type:"text"},{key:"referrals",label:"Referrals / Consults",value:"",type:"textarea"},{key:"instructions",label:"Patient Instructions",value:"",type:"textarea"}] },
];

// ─── Mock clinical data ────────────────────────────────────────────────────────

const MOCK_LABS: Record<string, {label:string;value:string;unit:string;flag?:"H"|"L"|"C";date:string}[]> = {
  p1:[{label:"WBC",value:"6.2",unit:"K/µL",date:"Jun 18"},{label:"ANC",value:"3.8",unit:"K/µL",date:"Jun 18"},{label:"Hgb",value:"11.4",unit:"g/dL",flag:"L",date:"Jun 18"},{label:"Platelets",value:"214",unit:"K/µL",date:"Jun 18"},{label:"Creatinine",value:"1.4",unit:"mg/dL",flag:"H",date:"Jun 18"},{label:"AST",value:"32",unit:"U/L",date:"Jun 18"},{label:"ALT",value:"28",unit:"U/L",date:"Jun 18"},{label:"Bilirubin",value:"0.6",unit:"mg/dL",date:"Jun 18"},{label:"TSH",value:"2.1",unit:"mIU/L",date:"Jun 18"}],
  p2:[{label:"WBC",value:"3.9",unit:"K/µL",flag:"L",date:"Jun 11"},{label:"ANC",value:"1.8",unit:"K/µL",flag:"L",date:"Jun 11"},{label:"Hgb",value:"10.2",unit:"g/dL",flag:"L",date:"Jun 11"},{label:"Platelets",value:"188",unit:"K/µL",date:"Jun 11"},{label:"Creatinine",value:"1.2",unit:"mg/dL",flag:"H",date:"Jun 11"},{label:"AST",value:"38",unit:"U/L",date:"Jun 11"},{label:"ALT",value:"42",unit:"U/L",flag:"H",date:"Jun 11"},{label:"Bilirubin",value:"0.7",unit:"mg/dL",date:"Jun 11"},{label:"TSH",value:"5.8",unit:"mIU/L",flag:"H",date:"Jun 11"}],
  p3:[{label:"WBC",value:"7.1",unit:"K/µL",date:"Jun 18"},{label:"ANC",value:"4.2",unit:"K/µL",date:"Jun 18"},{label:"Hgb",value:"13.6",unit:"g/dL",date:"Jun 18"},{label:"Platelets",value:"302",unit:"K/µL",date:"Jun 18"},{label:"Creatinine",value:"0.9",unit:"mg/dL",date:"Jun 18"},{label:"AST",value:"74",unit:"U/L",flag:"H",date:"Jun 18"},{label:"ALT",value:"88",unit:"U/L",flag:"H",date:"Jun 18"},{label:"Bilirubin",value:"0.9",unit:"mg/dL",date:"Jun 18"},{label:"TSH",value:"1.9",unit:"mIU/L",date:"Jun 18"}],
  p4:[{label:"WBC",value:"2.8",unit:"K/µL",flag:"C",date:"Jun 18"},{label:"ANC",value:"0.9",unit:"K/µL",flag:"C",date:"Jun 18"},{label:"Hgb",value:"8.7",unit:"g/dL",flag:"C",date:"Jun 18"},{label:"Platelets",value:"92",unit:"K/µL",flag:"C",date:"Jun 18"},{label:"Creatinine",value:"1.1",unit:"mg/dL",date:"Jun 18"},{label:"AST",value:"29",unit:"U/L",date:"Jun 18"},{label:"ALT",value:"34",unit:"U/L",date:"Jun 18"},{label:"Bilirubin",value:"0.5",unit:"mg/dL",date:"Jun 18"},{label:"TSH",value:"1.4",unit:"mIU/L",date:"Jun 18"}],
  p5:[{label:"WBC",value:"5.5",unit:"K/µL",date:"Jun 18"},{label:"ANC",value:"3.1",unit:"K/µL",date:"Jun 18"},{label:"Hgb",value:"12.8",unit:"g/dL",date:"Jun 18"},{label:"Platelets",value:"244",unit:"K/µL",date:"Jun 18"},{label:"Creatinine",value:"0.7",unit:"mg/dL",date:"Jun 18"},{label:"AST",value:"21",unit:"U/L",date:"Jun 18"},{label:"ALT",value:"22",unit:"U/L",date:"Jun 18"},{label:"Bilirubin",value:"0.4",unit:"mg/dL",date:"Jun 18"},{label:"TSH",value:"2.6",unit:"mIU/L",date:"Jun 18"}],
  p6:[{label:"WBC",value:"6.8",unit:"K/µL",date:"Jun 11"},{label:"ANC",value:"4.0",unit:"K/µL",date:"Jun 11"},{label:"Hgb",value:"12.1",unit:"g/dL",date:"Jun 11"},{label:"Platelets",value:"198",unit:"K/µL",date:"Jun 11"},{label:"Creatinine",value:"1.2",unit:"mg/dL",date:"Jun 11"},{label:"AST",value:"46",unit:"U/L",flag:"H",date:"Jun 11"},{label:"ALT",value:"90",unit:"U/L",flag:"H",date:"Jun 11"},{label:"Bilirubin",value:"0.8",unit:"mg/dL",date:"Jun 11"},{label:"TSH",value:"6.2",unit:"mIU/L",flag:"H",date:"Jun 11"}],
};

const MOCK_DOCS: Record<string, {type:string;description:string;date:string;provider:string}[]> = {
  p1:[{type:"Lab Report",description:"CBC, CMP, TSH — C8D1 pre-treatment",date:"Jun 18, 2026",provider:"Lab"},{type:"Progress Note",description:"Pembrolizumab C8D1 — tolerated well, mild fatigue",date:"Jun 18, 2026",provider:"Dr. A. Patel"},{type:"Imaging Report",description:"CT chest — stable disease, no new lesions",date:"May 5, 2026",provider:"Radiology"}],
  p2:[{type:"Lab Report",description:"CBC, CMP, TSH — C3D1 pre-treatment",date:"Jun 11, 2026",provider:"Lab"},{type:"Imaging Report",description:"CT chest/abdomen — PR confirmed, 32% reduction",date:"Jun 10, 2026",provider:"Radiology"},{type:"Progress Note",description:"C3D1 — ANC nadir, hold paclitaxel discussed",date:"Jun 11, 2026",provider:"Dr. A. Patel"}],
  p3:[{type:"Consult Note",description:"GI consult — irAE colitis evaluation",date:"Jun 5, 2026",provider:"GI"},{type:"Lab Report",description:"CBC, LFTs — ALT elevated 2× ULN",date:"Jun 18, 2026",provider:"Lab"},{type:"Progress Note",description:"Nivo/Ipi C1D1 — Grade 2 diarrhea reported",date:"Jun 18, 2026",provider:"Dr. S. Kim"}],
  p4:[{type:"Lab Report",description:"CBC critical — WBC 2.8, ANC 0.9",date:"Jun 18, 2026",provider:"Lab"},{type:"Progress Note",description:"Hematology notified — cycle hold recommended",date:"Jun 18, 2026",provider:"Dr. S. Kim"},{type:"Consult Note",description:"Hematology consult — G-CSF support plan",date:"Jun 19, 2026",provider:"Hematology"}],
  p5:[{type:"Lab Report",description:"CBC, CMP, TSH — C5D1 pre-treatment",date:"Jun 18, 2026",provider:"Lab"},{type:"Imaging Report",description:"PET scan — complete metabolic response",date:"May 29, 2026",provider:"Radiology"},{type:"Progress Note",description:"C5D1 — no toxicities, excellent response",date:"Jun 18, 2026",provider:"Dr. A. Patel"}],
  p6:[{type:"Lab Report",description:"CBC, LFTs, TSH — TSH 6.2 elevated",date:"Jun 11, 2026",provider:"Lab"},{type:"Consult Note",description:"Endocrinology referral — thyroiditis workup",date:"Jun 12, 2026",provider:"Endocrinology"},{type:"Progress Note",description:"C10D1 — Grade 1 HFS, TSH elevated",date:"Jun 11, 2026",provider:"Dr. S. Kim"}],
};

// ─── Utility / shared UI ──────────────────────────────────────────────────────

let uidN = 0;
function uid() { return `step-${++uidN}`; }

const STATUS_CONFIG = {
  "completed":   { label:"Completed",   dot:"var(--sev-ok-fg)", bg:"var(--sev-ok-bg)", text:"var(--sev-ok-fg)" },
  "in-progress": { label:"In Progress", dot:"var(--accent)", bg:"var(--accent-soft-bg)", text:"var(--accent)" },
  "checked-in":  { label:"Checked In",  dot:"#d97706", bg:"var(--sev-warning-bg)", text:"#d97706" },
  "upcoming":    { label:"Upcoming",    dot:"#a0aab8", bg:"#f4f6fa", text:"var(--muted-foreground)" },
};

const CATEGORY_CONFIG = {
  "immunotherapy": { label:"Immunotherapy", color:"var(--accent)", bg:"var(--accent-soft-bg)" },
  "chemotherapy":  { label:"Chemotherapy",  color:"#7c3aed", bg:"#f5f3ff" },
  "follow-up":     { label:"Follow-up",     color:"var(--muted-foreground)", bg:"#f0f2f5" },
  "consult":       { label:"Consult",        color:"#d97706", bg:"var(--sev-warning-bg)" },
};

function StatusBadge({ status }: { status: Appointment["status"] }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-sm" style={{ background:c.bg, color:c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background:c.dot }} />{c.label}
    </span>
  );
}

function CategoryPill({ category }: { category: Appointment["visitCategory"] }) {
  const c = CATEGORY_CONFIG[category];
  return <span className="text-xs font-medium px-2 py-0.5 rounded-sm" style={{ background:c.bg, color:c.color }}>{c.label}</span>;
}

// ─── Medication combobox ──────────────────────────────────────────────────────

function MedCombobox({ value, meds, onChange }: { value: string; meds: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value);
  const filtered = meds.filter(m => input === "" || m.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className="relative">
      <input type="text" value={input} placeholder="Type or select medication..."
        onChange={e => { setInput(e.target.value); onChange(e.target.value); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-white text-foreground focus:outline-none focus:border-accent"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-border rounded shadow-lg py-1 max-h-44 overflow-y-auto">
          {filtered.map(med => (
            <button key={med} type="button"
              onMouseDown={() => { setInput(med); onChange(med); setOpen(false); }}
              className="w-full px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-[#f8fafc]">
              {med}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Visit history data ───────────────────────────────────────────────────────

const MOCK_VISITS: Record<string, VisitRecord[]> = {
  p1:[
    {id:"v1-9",date:"Jul 9, 2026", type:"Immunotherapy Infusion",      category:"immunotherapy",status:"in-progress",cycle:"Cycle 9, Day 1",  provider:"Dr. A. Patel"},
    {id:"v1-8",date:"Jun 18, 2026",type:"Immunotherapy Infusion",      category:"immunotherapy",status:"completed",  cycle:"Cycle 8, Day 1",  provider:"Dr. A. Patel"},
    {id:"v1-7",date:"May 28, 2026",type:"Immunotherapy Infusion",      category:"immunotherapy",status:"completed",  cycle:"Cycle 7, Day 1",  provider:"Dr. A. Patel"},
    {id:"v1-6",date:"May 7, 2026", type:"Treatment Response Review",   category:"follow-up",    status:"completed",  cycle:"Cycle 6 Follow-up",provider:"Dr. A. Patel"},
    {id:"v1-5",date:"Apr 16, 2026",type:"Immunotherapy Infusion",      category:"immunotherapy",status:"completed",  cycle:"Cycle 6, Day 1",  provider:"Dr. A. Patel"},
  ],
  p2:[
    {id:"v2-4",date:"Jul 9, 2026", type:"Immunotherapy + Chemo Infusion",category:"immunotherapy",status:"in-progress",cycle:"Cycle 4, Day 1", provider:"Dr. A. Patel"},
    {id:"v2-3",date:"Jun 11, 2026",type:"Immunotherapy + Chemo Infusion",category:"immunotherapy",status:"completed",  cycle:"Cycle 3, Day 1", provider:"Dr. A. Patel"},
    {id:"v2-2",date:"May 21, 2026",type:"Immunotherapy + Chemo Infusion",category:"immunotherapy",status:"completed",  cycle:"Cycle 2, Day 1", provider:"Dr. A. Patel"},
    {id:"v2-1",date:"Apr 30, 2026",type:"New Patient Consultation",      category:"consult",      status:"completed",  cycle:"Initial Consult", provider:"Dr. A. Patel"},
  ],
  p3:[
    {id:"v3-2",date:"Jul 9, 2026", type:"Pre-Treatment Assessment",    category:"immunotherapy",status:"in-progress",cycle:"Cycle 2, Day 1",  provider:"Dr. S. Kim"},
    {id:"v3-1",date:"Jun 18, 2026",type:"Immunotherapy Infusion",      category:"immunotherapy",status:"completed",  cycle:"Cycle 1, Day 1",  provider:"Dr. S. Kim"},
    {id:"v3-0",date:"May 28, 2026",type:"New Patient Consultation",    category:"consult",      status:"completed",  cycle:"Initial Consult",  provider:"Dr. S. Kim"},
  ],
  p4:[
    {id:"v4-3",date:"Jul 9, 2026", type:"Chemotherapy Infusion",       category:"chemotherapy", status:"in-progress",cycle:"Cycle 3, Day 1",  provider:"Dr. S. Kim"},
    {id:"v4-2",date:"Jun 18, 2026",type:"Chemotherapy Infusion",       category:"chemotherapy", status:"completed",  cycle:"Cycle 2, Day 1",  provider:"Dr. S. Kim"},
    {id:"v4-1",date:"May 28, 2026",type:"Chemotherapy Infusion",       category:"chemotherapy", status:"completed",  cycle:"Cycle 1, Day 1",  provider:"Dr. S. Kim"},
    {id:"v4-0",date:"May 7, 2026", type:"New Patient Consultation",    category:"consult",      status:"completed",  cycle:"Initial Consult",  provider:"Dr. S. Kim"},
  ],
  p5:[
    {id:"v5-6",date:"Jul 9, 2026", type:"Immunotherapy Infusion",      category:"immunotherapy",status:"in-progress",cycle:"Cycle 6, Day 1",  provider:"Dr. A. Patel"},
    {id:"v5-5",date:"Jun 18, 2026",type:"Immunotherapy Infusion",      category:"immunotherapy",status:"completed",  cycle:"Cycle 5, Day 1",  provider:"Dr. A. Patel"},
    {id:"v5-4",date:"May 28, 2026",type:"Immunotherapy Infusion",      category:"immunotherapy",status:"completed",  cycle:"Cycle 4, Day 1",  provider:"Dr. A. Patel"},
    {id:"v5-3",date:"May 7, 2026", type:"Treatment Response Review",   category:"follow-up",    status:"completed",  cycle:"Cycle 3 Follow-up",provider:"Dr. A. Patel"},
  ],
  p6:[
    {id:"v6-11",date:"Jul 9, 2026", type:"Treatment Response & Toxicity Review",category:"follow-up",    status:"in-progress",cycle:"Cycle 11 Review", provider:"Dr. S. Kim"},
    {id:"v6-10",date:"Jun 11, 2026",type:"Immunotherapy Infusion",              category:"immunotherapy",status:"completed",  cycle:"Cycle 10, Day 1",provider:"Dr. S. Kim"},
    {id:"v6-9", date:"May 14, 2026",type:"Immunotherapy Infusion",              category:"immunotherapy",status:"completed",  cycle:"Cycle 9, Day 1", provider:"Dr. S. Kim"},
    {id:"v6-8", date:"Apr 16, 2026",type:"Immunotherapy Infusion",              category:"immunotherapy",status:"completed",  cycle:"Cycle 8, Day 1", provider:"Dr. S. Kim"},
  ],
};

// ─── CTCAE Modules ────────────────────────────────────────────────────────────

const CTCAE_MODULES: CTCAEModuleDef[] = [
  {
    id: "pneumonitis", label: "Pneumonitis",
    screeningQ: "New or worsening respiratory symptoms?",
    symptoms: ["Cough", "Shortness of breath", "Chest tightness"],
    grades: [
      { grade: 1, description: "Asymptomatic; clinical or diagnostic observations only; intervention not indicated" },
      { grade: 2, description: "Symptomatic; medical intervention indicated; limiting instrumental ADL or mild/moderate impact on age-appropriate normal daily activity (pediatric)" },
      { grade: 3, description: "Severe symptoms; oxygen indicated; limiting self-care ADL or severe impact on age-appropriate normal daily activity (pediatric)" },
      { grade: 4, description: "Life-threatening respiratory compromise; urgent intervention indicated (e.g., tracheotomy or intubation)" },
    ],
  },
  {
    id: "colitis", label: "Colitis",
    screeningQ: "New or worsening GI symptoms?",
    symptoms: ["Diarrhea", "Abdominal pain", "Blood or mucus in stool"],
    grades: [
      { grade: 1, description: "Asymptomatic; clinical or diagnostic observations only; intervention not indicated" },
      { grade: 2, description: "Abdominal pain; mucus or blood in stool" },
      { grade: 3, description: "Severe abdominal pain; peritoneal signs" },
      { grade: 4, description: "Life-threatening consequences; urgent intervention indicated" },
    ],
  },
  {
    id: "skin", label: "Skin Toxicity",
    screeningQ: "Any rash or new skin changes present?",
    grades: [
      { grade: 1, description: "Asymptomatic" },
      { grade: 2, description: "Mild symptoms" },
      { grade: 3, description: "Macules/papules covering >50% BSA; moderate or severe symptoms" },
      { grade: 4, description: "Life-threatening consequences; urgent intervention indicated" },
    ],
  },
  {
    id: "hepatitis", label: "Hepatitis",
    screeningQ: "Abnormal hepatic symptoms, or elevated AST, ALT, or bilirubin?",
    labFields: [
      { key: "ast",       label: "AST",       unit: "U/L",   sourceKey: "ast",       uln: 40  },
      { key: "alt",       label: "ALT",       unit: "U/L",   sourceKey: "alt",       uln: 40  },
      { key: "bilirubin", label: "Bilirubin", unit: "mg/dL", sourceKey: "bilirubin", uln: 1.0 },
    ],
    labNote: "ULN: AST 40 U/L · ALT 40 U/L · Bilirubin 1.0 mg/dL",
    // grades kept for summary/fallback; perMetricGrades drives the wizard UI
    grades: [
      { grade: 1, description: "AST/ALT >ULN–3× ULN; Bilirubin >ULN–1.5× ULN" },
      { grade: 2, description: "AST/ALT >3–5× ULN; Bilirubin >1.5–3× ULN" },
      { grade: 3, description: "AST/ALT >5–20× ULN; Bilirubin >3–10× ULN" },
      { grade: 4, description: "AST/ALT >20× ULN; Bilirubin >10× ULN" },
    ],
    perMetricGrades: {
      ast: [
        { grade: 0, description: "Within normal range (≤40 U/L)" },
        { grade: 1, description: ">ULN – 3× ULN  (>40 – 120 U/L)" },
        { grade: 2, description: ">3 – 5× ULN  (>120 – 200 U/L)" },
        { grade: 3, description: ">5 – 20× ULN  (>200 – 800 U/L)" },
        { grade: 4, description: ">20× ULN  (>800 U/L)" },
      ],
      alt: [
        { grade: 0, description: "Within normal range (≤40 U/L)" },
        { grade: 1, description: ">ULN – 3× ULN  (>40 – 120 U/L)" },
        { grade: 2, description: ">3 – 5× ULN  (>120 – 200 U/L)" },
        { grade: 3, description: ">5 – 20× ULN  (>200 – 800 U/L)" },
        { grade: 4, description: ">20× ULN  (>800 U/L)" },
      ],
      bilirubin: [
        { grade: 0, description: "Within normal range (≤1.0 mg/dL)" },
        { grade: 1, description: ">ULN – 1.5× ULN  (>1.0 – 1.5 mg/dL)" },
        { grade: 2, description: ">1.5 – 3× ULN  (>1.5 – 3.0 mg/dL)" },
        { grade: 3, description: ">3 – 10× ULN  (>3.0 – 10.0 mg/dL)" },
        { grade: 4, description: ">10× ULN  (>10.0 mg/dL)" },
      ],
    },
  },
  {
    id: "nephritis", label: "Nephritis",
    screeningQ: "Abnormal renal symptoms or elevated creatinine?",
    labFields: [
      { key: "creatinine", label: "Creatinine", unit: "mg/dL", sourceKey: "creatinine", uln: 1.0, lln: 0.6 },
    ],
    labNote: "ULN: 1.0 mg/dL · LLN: 0.6 mg/dL",
    grades: [
      { grade: 0, description: "Within normal range (≤1.0 mg/dL)" },
      { grade: 1, description: ">ULN – 1.5× ULN  (>1.0 – 1.5 mg/dL)" },
      { grade: 2, description: ">1.5 – 3× ULN  (>1.5 – 3.0 mg/dL)" },
      { grade: 3, description: ">3 – 6× ULN  (>3.0 – 6.0 mg/dL)" },
      { grade: 4, description: ">6× ULN  (>6.0 mg/dL)" },
    ],
    // Empty perMetricGrades entry routes nephritis through the paired
    // baseline-aware grade card (same layout as AST/ALT/bilirubin).
    // The actual descriptions are built dynamically via buildNephritisGradePair.
    perMetricGrades: {
      creatinine: [
        { grade: 0, description: "Within normal range" },
        { grade: 1, description: ">ULN – 1.5× ULN" },
        { grade: 2, description: ">1.5 – 3× ULN" },
        { grade: 3, description: ">3 – 6× ULN" },
        { grade: 4, description: ">6× ULN" },
      ],
    },
  },
  {
    id: "diarrhea", label: "Diarrhea",
    screeningQ: "Increase in bowel frequency or loose/watery stools?",
    customField: { label: "Stools above baseline per day", unit: "stools/day", placeholder: "e.g. 3" },
    grades: [
      { grade: 1, description: "Change in consistency or frequency" },
      { grade: 2, description: "Increase of 4 – 6 stools per day over baseline; moderate increase in ostomy output compared to baseline; limiting instrumental ADL or mild/moderate impact on age-appropriate normal daily activity (pediatric); change in consistency or frequency AND limiting instrumental ADL or mild/moderate impact on age-appropriate normal daily activity (pediatric)" },
      { grade: 3, description: "Increase of ≥7 stools per day over baseline; hospitalization indicated; severe increase in ostomy output compared to baseline; requires IV intervention; limiting self-care ADL or severe impact on age-appropriate normal daily activity (pediatric)" },
      { grade: 4, description: "Life-threatening consequences; urgent intervention indicated" },
    ],
  },
  {
    id: "other", label: "Other",
    screeningQ: "Any other symptoms or adverse events not previously covered?",
    // Free-text catch-all — no symptom list, no lab fields, no auto-grading.
    // Detail phase renders the instruction + CTCAE reference link + textarea.
    freeText: {
      instruction: "Document any other symptoms not covered by the modules above. Include the symptom, severity, and assigned CTCAE grade.",
      ctcaeLink: "https://dctd.cancer.gov/research/ctep-trials/for-sites/adverse-events/ctcae-v6.pdf",
      placeholder: "e.g. Fatigue — moderate, ~4 days duration, limiting instrumental ADL. Grade 2 per CTCAE v6.",
    },
    // `grades` kept for type shape; the free-text module doesn't render a
    // grade selector — the nurse writes the grade into the textarea per CTCAE.
    grades: [],
  },
];

function makeWizardResults(
  positives?: Record<string, { grade: number; symptoms?: string[]; notes?: string; customValue?: string; labOverrides?: Record<string,string> }>
): string {
  const rs: ModuleResult[] = CTCAE_MODULES.map(m => {
    const p = positives?.[m.id];
    if (p) return { screening: "yes", checkedSymptoms: p.symptoms ?? [], notes: p.notes ?? "", labOverrides: p.labOverrides ?? {}, customValue: p.customValue ?? "", grade: p.grade };
    return { screening: "no", checkedSymptoms: [], notes: "", labOverrides: {}, customValue: "", grade: null };
  });
  return JSON.stringify(rs);
}

function buildRequiredSteps(_category: Appointment["visitCategory"]): WorkflowStep[] {
  const ids = ["symptom"];
  return ids.map(id => {
    const t = STEP_TEMPLATES.find(s => s.id === id)!;
    return { ...t, instanceId: uid(), fieldValues: Object.fromEntries(t.fields.map(f => [f.key, f.value])) };
  });
}

// ─── Mock encounter notes for completed visits ────────────────────────────────

let mockN = 0;
function buildFilledSteps(
  _category: Appointment["visitCategory"],
  overrides: Record<string, Record<string, string>>
): WorkflowStep[] {
  const ids = ["symptom"];
  return ids.map(id => {
    const t = STEP_TEMPLATES.find(s => s.id === id)!;
    const base = Object.fromEntries(t.fields.map(f => [f.key, f.value]));
    if (id === "symptom") {
      base["assessment_complete"] = "true";
      base["wizard_results"] = makeWizardResults();
    }
    return { ...t, instanceId: `m${++mockN}`, fieldValues: { ...base, ...(overrides[id] ?? {}) } };
  });
}

const MOCK_ENCOUNTERS: Record<string, WorkflowStep[]> = {

  // ── Robert Fanning — Pembrolizumab NSCLC ──────────────────────────────────
  "v1-8": buildFilledSteps("immunotherapy", {
    vitals: { bp:"128/76", hr:"72", spo2:"97", temp:"98.2", weight:"187" },
    labs: { wbc:"6.2", anc:"3.8", hgb:"11.4", plt:"214", creatinine:"1.4", alt:"28", tsh:"2.1",
      notes:"Hgb mildly low, stable trend. Creatinine at CKD baseline — no change from prior." },
    clearance: { cleared:"Yes", dose_mod:"",
      rationale:"All labs within acceptable range. CKD Stage 2 stable. Proceed with standard 200 mg dose." },
    infusion: { agent:"Pembrolizumab 200mg Q3W", dose:"200 mg", route:"IV", rate:"30 min infusion over 100 mL NS",
      premeds:"Dexamethasone 8mg IV 30 min prior", reactions:"None" },
    plan: { next:"Pembrolizumab C9D1", date:"Jul 9, 2026", referrals:"None",
      instructions:"Continue home medications. Fatigue reviewed — low-impact activity encouraged. Return in 3 weeks." },
  }),
  "v1-7": buildFilledSteps("immunotherapy", {
    vitals: { bp:"132/80", hr:"74", spo2:"96", temp:"98.4", weight:"189" },
    labs: { wbc:"5.8", anc:"3.4", hgb:"11.8", plt:"228", creatinine:"1.3", alt:"31", tsh:"2.3",
      notes:"Hgb downtrend over 3 cycles — monitoring. All other values stable." },
    clearance: { cleared:"Yes", dose_mod:"",
      rationale:"Stable tolerability. Grade 1 fatigue well-controlled. Full dose Pembrolizumab cleared." },
    infusion: { agent:"Pembrolizumab 200mg Q3W", dose:"200 mg", route:"IV", rate:"30 min infusion",
      premeds:"Dexamethasone 8mg IV", reactions:"None" },
    plan: { next:"Pembrolizumab C8D1", date:"Jun 18, 2026", referrals:"None",
      instructions:"Fatigue management discussed. Labs 1 week prior to next cycle. Monitor for new pulmonary symptoms given NSCLC." },
  }),
  "v1-6": buildFilledSteps("follow-up", {
    vitals: { bp:"130/78", hr:"70", spo2:"97", temp:"98.1", weight:"190" },
    labs: { wbc:"6.0", anc:"3.5", hgb:"12.2", plt:"235", creatinine:"1.3", alt:"26", tsh:"2.0",
      notes:"Labs stable. Hgb slightly improved from prior nadir." },
    response: { recist:"Stable Disease (SD)", imaging:"CT Chest — May 5, 2026",
      markers:"CEA 4.2 (stable)", notes:"CT shows no new lesions, primary lesion stable per RECIST 1.1. Continued immunotherapy response consistent with SD at cycle 6." },
    plan: { next:"Pembrolizumab C6D1", date:"Apr 16, 2026", referrals:"None",
      instructions:"Continue current regimen. Imaging every 3 cycles. Monitor PD-L1 expression on repeat biopsy if progression." },
  }),

  // ── Priya Nair — Pembrolizumab + Paclitaxel TNBC ─────────────────────────
  "v2-3": buildFilledSteps("immunotherapy", {
    vitals: { bp:"112/70", hr:"88", spo2:"99", temp:"98.1", weight:"134" },
    labs: { wbc:"3.9", anc:"1.8", hgb:"10.2", plt:"188", creatinine:"0.8", alt:"42", tsh:"5.8",
      notes:"ANC borderline — discussed hold threshold. TSH elevated, consistent with irAE thyroiditis. Endocrine notified." },
    clearance: { cleared:"Yes — with dose modification", dose_mod:"Paclitaxel held — ANC 1.8 K/µL",
      rationale:"Pembrolizumab cleared. Paclitaxel held per ANC threshold (<2.0). TSH elevation consistent with immune-mediated thyroiditis; levothyroxine dose adjustment discussed with endocrinology." },
    infusion: { agent:"Pembrolizumab 200mg Q3W", dose:"200 mg (Paclitaxel held)", route:"IV",
      rate:"30 min infusion", premeds:"Dexamethasone 8mg IV, Ondansetron 8mg IV", reactions:"None" },
    plan: { next:"Pembrolizumab + Paclitaxel C4D1 (pending ANC recovery)", date:"Jul 9, 2026",
      referrals:"Endocrinology — immune thyroiditis workup",
      instructions:"Repeat CBC in 1 week. Levothyroxine adjusted. Call clinic immediately if fever >100.4°F or new symptoms." },
  }),
  "v2-2": buildFilledSteps("immunotherapy", {
    vitals: { bp:"118/72", hr:"82", spo2:"99", temp:"97.9", weight:"136" },
    labs: { wbc:"4.8", anc:"2.6", hgb:"11.1", plt:"202", creatinine:"0.7", alt:"35", tsh:"3.2",
      notes:"Labs adequate for dual-agent treatment. Hgb trending down from baseline — monitor." },
    clearance: { cleared:"Yes", dose_mod:"",
      rationale:"ANC above threshold. Full dual-agent infusion cleared. Good tolerability at C1." },
    infusion: { agent:"Pembrolizumab 200mg Q3W", dose:"200 mg Pembrolizumab + Paclitaxel 80 mg/m²", route:"IV",
      rate:"Pembrolizumab 30 min; Paclitaxel 60 min", premeds:"Dexamethasone 20mg IV, Diphenhydramine 50mg IV, Ondansetron 8mg IV", reactions:"None" },
    plan: { next:"Pembrolizumab + Paclitaxel C3D1", date:"Jun 11, 2026",
      referrals:"None",
      instructions:"Monitor for peripheral neuropathy. CBC 1 week post-treatment. Anti-emetics prescribed. Call with fever or new neurological symptoms." },
  }),

  // ── Thomas Osei — Nivolumab + Ipilimumab Melanoma ────────────────────────
  "v3-1": buildFilledSteps("immunotherapy", {
    vitals: { bp:"122/78", hr:"68", spo2:"99", temp:"98.0", weight:"198" },
    labs: { wbc:"7.1", anc:"4.2", hgb:"13.6", plt:"302", creatinine:"0.9", alt:"88", tsh:"1.9",
      notes:"ALT 2× ULN — hepatotoxicity concern. GI consult pending for Grade 2 diarrhea reported at home." },
    symptom: { wizard_results: makeWizardResults({
      colitis: { grade: 2, symptoms: ["Diarrhea", "Abdominal pain"], notes: "Onset day 14 post C1D1. ~5 stools above baseline per day. No fever. Low-fiber diet initiated." },
      hepatitis: { grade: 1, labOverrides: { ast:"52", alt:"88", bilirubin:"0.8" }, notes: "ALT 2× ULN. Likely Nivolumab-related hepatotoxicity. LFTs to be repeated in 1 week." },
    }) },
    clearance: { cleared:"Yes — with dose modification", dose_mod:"Ipilimumab held — ALT 2× ULN, active Grade 2 diarrhea",
      rationale:"Nivolumab cleared at standard dose. Ipilimumab held per irAE protocol. Stool cultures sent. Observing prior to corticosteroid initiation." },
    infusion: { agent:"Nivolumab 3mg/kg Q3W", dose:"240 mg (3 mg/kg)", route:"IV",
      rate:"30 min infusion over 100 mL NS", premeds:"None required", reactions:"None" },
    plan: { next:"Nivolumab ± Ipilimumab C2D1 (pending LFT/GI resolution)", date:"Jul 9, 2026",
      referrals:"GI — irAE colitis evaluation",
      instructions:"Low-fiber diet. Strict bowel movement log. Return immediately if diarrhea worsens or fever develops. LFTs to be repeated in 1 week." },
  }),

  // ── Linda Morales — Carboplatin + Paclitaxel Ovarian ─────────────────────
  "v4-2": buildFilledSteps("chemotherapy", {
    vitals: { bp:"138/86", hr:"76", spo2:"96", temp:"98.6", weight:"162" },
    labs: { wbc:"2.8", anc:"0.9", hgb:"8.7", plt:"92", creatinine:"1.1", alt:"34", tsh:"1.4",
      notes:"Critical neutropenia — ANC 0.9. Platelet nadir at 92. Hematology notified. G-CSF initiated." },
    clearance: { cleared:"Hold — labs", dose_mod:"Cycle 3 deferred — ANC 0.9, Plt 92",
      rationale:"CBC critical values. ANC below minimum threshold for cytotoxic chemotherapy. G-CSF support initiated. Cycle deferred 1 week pending count recovery." },
    infusion: { agent:"Carboplatin AUC 5 Q3W", dose:"Not administered — hold", route:"IV",
      rate:"N/A", premeds:"N/A", reactions:"None" },
    plan: { next:"Carboplatin + Paclitaxel C3D1 (deferred)", date:"Jul 9, 2026",
      referrals:"Hematology — G-CSF support and count management",
      instructions:"Strict neutropenic precautions — avoid crowds, raw foods. Temperature log twice daily. Call immediately if temp >100.4°F. Repeat CBC in 1 week." },
  }),
  "v4-1": buildFilledSteps("chemotherapy", {
    vitals: { bp:"136/84", hr:"78", spo2:"97", temp:"98.5", weight:"165" },
    labs: { wbc:"5.2", anc:"3.1", hgb:"10.4", plt:"178", creatinine:"1.0", alt:"29", tsh:"1.5",
      notes:"Labs adequate for treatment. Baseline anemia pre-existing, not treatment-related." },
    clearance: { cleared:"Yes", dose_mod:"",
      rationale:"Labs meet threshold. ECOG 2 — standard dosing as planned. Monitoring renal function closely given age and baseline." },
    infusion: { agent:"Carboplatin AUC 5 Q3W", dose:"Carboplatin AUC 5 + Paclitaxel 175 mg/m²", route:"IV",
      rate:"Carboplatin 30 min; Paclitaxel 3 hr", premeds:"Dexamethasone 20mg IV, Diphenhydramine 50mg IV, Ondansetron 8mg IV, Ranitidine 50mg IV", reactions:"None" },
    plan: { next:"Carboplatin + Paclitaxel C2D1", date:"Jun 18, 2026",
      referrals:"None",
      instructions:"Anti-emetics prescribed for home use. Report tingling or numbness immediately. Neutropenic precautions reviewed. Avoid aspirin products per allergy." },
  }),

  // ── James Whitfield — Pembrolizumab Hodgkin Lymphoma ─────────────────────
  "v5-5": buildFilledSteps("immunotherapy", {
    vitals: { bp:"118/74", hr:"64", spo2:"99", temp:"97.8", weight:"176" },
    labs: { wbc:"5.5", anc:"3.1", hgb:"12.8", plt:"244", creatinine:"0.7", alt:"22", tsh:"2.6",
      notes:"Excellent lab profile. Complete metabolic response on PET confirmed May 29." },
    clearance: { cleared:"Yes", dose_mod:"",
      rationale:"No toxicities identified. Labs excellent. Proceed with standard Pembrolizumab 200 mg." },
    infusion: { agent:"Pembrolizumab 200mg Q3W", dose:"200 mg", route:"IV",
      rate:"30 min infusion", premeds:"Dexamethasone 8mg IV", reactions:"None" },
    plan: { next:"Pembrolizumab C6D1", date:"Jul 9, 2026",
      referrals:"None",
      instructions:"Continue current regimen — no modifications. Albuterol PRN for asthma. Excellent treatment response — maintain schedule." },
  }),
  "v5-4": buildFilledSteps("immunotherapy", {
    vitals: { bp:"120/76", hr:"66", spo2:"99", temp:"97.9", weight:"175" },
    labs: { wbc:"5.8", anc:"3.4", hgb:"13.1", plt:"258", creatinine:"0.7", alt:"19", tsh:"2.4",
      notes:"All values normal. No lab concerns." },
    clearance: { cleared:"Yes", dose_mod:"",
      rationale:"Excellent tolerability to date. Proceed with C4 as scheduled." },
    infusion: { agent:"Pembrolizumab 200mg Q3W", dose:"200 mg", route:"IV",
      rate:"30 min infusion", premeds:"Dexamethasone 8mg IV", reactions:"None" },
    plan: { next:"Pembrolizumab C5D1", date:"Jun 18, 2026",
      referrals:"None",
      instructions:"PET scan scheduled prior to C5 to assess metabolic response. Continue activity as tolerated. No dietary restrictions." },
  }),

  // ── Diana Rourke — Nivolumab + Cabozantinib RCC ───────────────────────────
  "v6-10": buildFilledSteps("immunotherapy", {
    vitals: { bp:"148/90", hr:"70", spo2:"98", temp:"98.3", weight:"154" },
    labs: { wbc:"6.8", anc:"4.0", hgb:"12.1", plt:"198", creatinine:"1.2", alt:"51", tsh:"6.2",
      notes:"ALT mildly elevated — Cabozantinib hepatotoxicity probable. TSH elevated — irAE thyroiditis pattern. Endocrinology referral placed." },
    symptom: { wizard_results: makeWizardResults({
      skin: { grade: 1, notes: "Grade 1 HFS — bilateral palmar erythema, mild tenderness. Moisturizing regimen started. Cabozantinib dose reduced." },
      hepatitis: { grade: 1, labOverrides: { ast:"44", alt:"51", bilirubin:"0.7" }, notes: "ALT 1.5× ULN — Cabozantinib hepatotoxicity pattern. Monitoring; no steroid indicated at Grade 1." },
    }) },
    clearance: { cleared:"Yes — with dose modification", dose_mod:"Cabozantinib reduced to 40mg daily — HFS and ALT 1.5× ULN",
      rationale:"Nivolumab cleared at standard dose. Cabozantinib dose reduction per Grade 1 HFS and hepatotoxicity protocol. Levothyroxine initiated for immune thyroiditis." },
    infusion: { agent:"Nivolumab 240mg Q4W", dose:"240 mg", route:"IV",
      rate:"30 min infusion over 100 mL NS", premeds:"None required", reactions:"None" },
    plan: { next:"Nivolumab + Cabozantinib C11 Review", date:"Jul 9, 2026",
      referrals:"Endocrinology — immune-mediated thyroiditis, TSH 6.2",
      instructions:"Levothyroxine initiated — recheck TSH in 6 weeks. HFS skin care reviewed: moisturize and avoid pressure. Cabozantinib dose reduced to 40 mg daily." },
  }),
  "v6-9": buildFilledSteps("immunotherapy", {
    vitals: { bp:"144/88", hr:"72", spo2:"98", temp:"98.0", weight:"156" },
    labs: { wbc:"7.0", anc:"4.1", hgb:"12.4", plt:"204", creatinine:"1.1", alt:"38", tsh:"3.8",
      notes:"Labs within acceptable range. ALT trending up — watch Cabozantinib hepatotoxicity. TSH borderline high." },
    clearance: { cleared:"Yes", dose_mod:"",
      rationale:"Labs adequate. Minor ALT trend noted — will recheck at C10. Proceed with standard doses." },
    infusion: { agent:"Nivolumab 240mg Q4W", dose:"240 mg", route:"IV",
      rate:"30 min infusion", premeds:"None required", reactions:"None" },
    plan: { next:"Nivolumab + Cabozantinib C10D1", date:"Jun 11, 2026",
      referrals:"None",
      instructions:"Monitor for HFS — early symptoms discussed. Report any skin changes on hands or feet. Repeat LFTs at next visit. HTN management optimized." },
  }),
};

// ─── Pre-visit vitals (collected by MA) and lab prefill ──────────────────────

// Vitals collected by medical assistant at check-in, day of visit
const PATIENT_VITALS: Record<string, Record<string, string>> = {
  p1: { bp:"132/80", hr:"72",  spo2:"97", temp:"98.2", weight:"187" },
  p2: { bp:"114/72", hr:"86",  spo2:"99", temp:"97.9", weight:"134" },
  p3: { bp:"124/80", hr:"70",  spo2:"99", temp:"98.1", weight:"198" },
  p4: { bp:"140/88", hr:"82",  spo2:"95", temp:"98.5", weight:"162" },
  p5: { bp:"118/74", hr:"64",  spo2:"99", temp:"97.8", weight:"176" },
  p6: { bp:"150/92", hr:"70",  spo2:"98", temp:"98.3", weight:"154" },
};

// Lab date: day before each patient's in-progress visit (Jul 9, 2026)
const VISIT_LAB_DATES: Record<string, string> = {
  p1:"Jul 8, 2026", p2:"Jul 8, 2026", p3:"Jul 8, 2026",
  p4:"Jul 8, 2026", p5:"Jul 8, 2026", p6:"Jul 8, 2026",
};

function buildLabPrefill(patientId: string): Record<string, string> {
  const labs = MOCK_LABS[patientId] ?? [];
  const get = (label: string) => labs.find(l => l.label === label)?.value ?? "";
  const date = VISIT_LAB_DATES[patientId] ?? "";
  return {
    wbc: get("WBC"), anc: get("ANC"), hgb: get("Hgb"),
    plt: get("Platelets"), creatinine: get("Creatinine"),
    ast: get("AST"), alt: get("ALT"), bilirubin: get("Bilirubin"), tsh: get("TSH"),
    notes: date ? `Labs drawn ${date} · Pre-visit collection` : "",
  };
}

// Baseline labs drawn at treatment initiation — keyed same as buildLabPrefill
// so the wizard can compare current vs baseline for CTCAE grading.
function buildLabBaselines(patientId: string): Record<string, string> {
  const b = PATIENT_LAB_BASELINES[patientId];
  if (!b) return {};
  return {
    creatinine: b.creatinine, ast: b.ast, alt: b.alt,
    bilirubin: b.bilirubin, tsh: b.tsh,
  };
}

// ─── Patient baseline comparison data (CDS simulation) ───────────────────────

// Baseline labs drawn at treatment initiation
const PATIENT_LAB_BASELINES: Record<string, { tsh: string; creatinine: string; ast: string; alt: string; bilirubin: string }> = {
  p1: { tsh:"2.0",  creatinine:"1.2",  ast:"26", alt:"24", bilirubin:"0.6" },
  // p2 intentionally has baseline creatinine below LLN (0.6) — reflects
  // low muscle mass, common in oncology patients — so the nephritis module
  // demos its baseline-below-LLN grading branch.
  p2: { tsh:"2.8",  creatinine:"0.5",  ast:"22", alt:"20", bilirubin:"0.5" },
  p3: { tsh:"1.8",  creatinine:"0.8",  ast:"30", alt:"25", bilirubin:"0.4" },
  p4: { tsh:"1.6",  creatinine:"0.9",  ast:"24", alt:"21", bilirubin:"0.5" },
  p5: { tsh:"2.4",  creatinine:"0.7",  ast:"19", alt:"18", bilirubin:"0.4" },
  // p6 intentionally has ALT baseline > ULN (40) to demo the elevated-
  // baseline branch of CTCAE hepatic grading (baseline-anchored thresholds
  // vs the default ULN-anchored ones).
  p6: { tsh:"2.1",  creatinine:"0.9",  ast:"28", alt:"55", bilirubin:"0.5" },
};

// Baseline vitals drawn at treatment initiation
const PATIENT_VITAL_BASELINES: Record<string, { bp: string; hr: string; weight: string; temp: string }> = {
  p1: { bp:"128/76", hr:"70", weight:"192", temp:"98.0" },
  p2: { bp:"110/68", hr:"80", weight:"140", temp:"98.0" },
  p3: { bp:"118/76", hr:"66", weight:"200", temp:"98.0" },
  p4: { bp:"134/82", hr:"74", weight:"168", temp:"98.1" },
  p5: { bp:"116/72", hr:"62", weight:"178", temp:"97.8" },
  p6: { bp:"142/86", hr:"68", weight:"162", temp:"98.1" },
};

// Static clinical baselines (SpO₂, bowel, skin) per patient
const PATIENT_CLINICAL_BASELINES: Record<string, BaselineMetric[]> = {
  p1: [
    { label:"SpO₂ — Sitting (Rest)",     baseline:"97%",                      current:"97%",                                              flag:"green",  note:"Matches baseline" },
    { label:"SpO₂ — Walking (Exertion)", baseline:"94%",                      current:"92%",                                              flag:"yellow", note:"2-point drop from baseline measurement" },
    { label:"Bowel Pattern",             baseline:"Regular, no intervention", current:"Regular, no intervention",                         flag:"green",  note:"No change from baseline" },
    { label:"Skin / Integument",         baseline:"Intact, no lesions",       current:"Dry, flaking skin — bilateral forearms, new onset", flag:"yellow", note:"New finding not present at baseline" },
  ],
  p2: [
    { label:"SpO₂ — Sitting (Rest)",     baseline:"99%",                      current:"99%",                                              flag:"green",  note:"Matches baseline" },
    { label:"SpO₂ — Walking (Exertion)", baseline:"98%",                      current:"97%",                                              flag:"green",  note:"1-point variation, within expected range" },
    { label:"Bowel Pattern",             baseline:"Regular, no intervention", current:"Infrequent stools, straining — intervention started", flag:"yellow", note:"Change from baseline pattern; intervention added since last visit" },
    { label:"Skin / Integument",         baseline:"Intact, no lesions",       current:"Hair loss, scalp; increased scalp sensitivity",    flag:"yellow", note:"New finding not present at baseline" },
  ],
  p3: [
    { label:"SpO₂ — Sitting (Rest)",     baseline:"99%",                      current:"99%",                                              flag:"green",  note:"Matches baseline" },
    { label:"SpO₂ — Walking (Exertion)", baseline:"98%",                      current:"97%",                                              flag:"green",  note:"1-point variation, within expected range" },
    { label:"Bowel Pattern",             baseline:"Regular, 1× daily",        current:"Frequent loose stools — 4 to 6 times per day",     flag:"red",    note:"Marked increase from baseline frequency" },
    { label:"Skin / Integument",         baseline:"Intact, no lesions",       current:"Raised, blotchy rash — trunk and upper arms",      flag:"yellow", note:"New finding not present at baseline" },
  ],
  p4: [
    { label:"SpO₂ — Sitting (Rest)",     baseline:"96%",                      current:"95%",                                              flag:"yellow", note:"1-point drop from baseline measurement" },
    { label:"SpO₂ — Walking (Exertion)", baseline:"93%",                      current:"90%",                                              flag:"red",    note:"3-point drop from baseline measurement" },
    { label:"Bowel Pattern",             baseline:"Senna 2 tabs QHS (pre-existing)", current:"Ongoing constipation despite current regimen", flag:"yellow", note:"Inadequate response compared to prior regimen status" },
    { label:"Skin / Integument",         baseline:"Dry skin, intact",         current:"Tingling and numbness — bilateral feet",           flag:"yellow", note:"New symptom not present at baseline" },
  ],
  p5: [
    { label:"SpO₂ — Sitting (Rest)",     baseline:"99%",                      current:"99%",                                              flag:"green",  note:"Matches baseline" },
    { label:"SpO₂ — Walking (Exertion)", baseline:"98%",                      current:"98%",                                              flag:"green",  note:"Matches baseline" },
    { label:"Bowel Pattern",             baseline:"Regular, no intervention", current:"Regular, no intervention",                         flag:"green",  note:"No change from baseline" },
    { label:"Skin / Integument",         baseline:"Intact, no lesions",       current:"Intact, no lesions",                               flag:"green",  note:"No change from baseline" },
  ],
  p6: [
    { label:"SpO₂ — Sitting (Rest)",     baseline:"98%",                      current:"98%",                                              flag:"green",  note:"Matches baseline" },
    { label:"SpO₂ — Walking (Exertion)", baseline:"97%",                      current:"96%",                                              flag:"green",  note:"1-point variation, within expected range" },
    { label:"Bowel Pattern",             baseline:"Regular, no intervention", current:"Loose stools — 2 to 3 times per day",             flag:"yellow", note:"Change from baseline pattern" },
    { label:"Skin / Integument",         baseline:"Intact, no lesions",       current:"Redness, peeling, and tenderness — palms and soles", flag:"red",  note:"New finding with bilateral distribution, not present at baseline" },
  ],
};

function parseSystolic(bp: string): number { return parseInt(bp.split("/")[0]) || 0; }
function parseDiastolic(bp: string): number { return parseInt(bp.split("/")[1]) || 0; }

function buildPatientBaselines(patientId: string): BaselineMetric[] {
  const vBase = PATIENT_VITAL_BASELINES[patientId] ?? {};
  const lBase = PATIENT_LAB_BASELINES[patientId] ?? {};
  const currentVitals = PATIENT_VITALS[patientId] ?? {};
  const labs = MOCK_LABS[patientId] ?? [];
  const getLabVal = (label: string) => labs.find(l => l.label === label)?.value ?? "—";

  const metrics: BaselineMetric[] = [];

  // ── Vitals ──
  if (vBase.bp && currentVitals.bp) {
    const baseSys = parseSystolic(vBase.bp);
    const curSys  = parseSystolic(currentVitals.bp);
    const curDia  = parseDiastolic(currentVitals.bp);
    const sysDiff = curSys - baseSys;
    const flag: BaselineMetric["flag"] = curSys >= 160 || curDia >= 100 ? "red" : curSys >= 140 || curDia >= 90 || sysDiff >= 15 ? "yellow" : "green";
    const note = flag === "green"
      ? `Within normal range; ${sysDiff > 0 ? `+${sysDiff}` : sysDiff} mmHg systolic from baseline`
      : flag === "yellow"
      ? `Stage 1 HTN range or ≥15 mmHg above baseline systolic (${sysDiff > 0 ? "+" : ""}${sysDiff} mmHg)`
      : `Stage 2 HTN — ≥160/100; ${sysDiff > 0 ? "+" : ""}${sysDiff} mmHg above baseline systolic`;
    metrics.push({ label:"Blood Pressure", baseline:`${vBase.bp} mmHg`, current:`${currentVitals.bp} mmHg`, flag, note });
  }

  if (vBase.hr && currentVitals.hr) {
    const hr = parseInt(currentVitals.hr);
    const flag: BaselineMetric["flag"] = hr < 50 || hr > 110 ? "red" : hr < 60 || hr > 100 ? "yellow" : "green";
    const note = flag === "green" ? "Normal sinus range" : hr > 100 ? `Tachycardia — ${hr} bpm` : `Bradycardia — ${hr} bpm`;
    metrics.push({ label:"Heart Rate", baseline:`${vBase.hr} bpm`, current:`${currentVitals.hr} bpm`, flag, note });
  }

  if (vBase.weight && currentVitals.weight) {
    const baseW = parseFloat(vBase.weight);
    const curW  = parseFloat(currentVitals.weight);
    const pctChange = ((curW - baseW) / baseW) * 100;
    const flag: BaselineMetric["flag"] = pctChange < -10 ? "red" : Math.abs(pctChange) >= 3 ? "yellow" : "green";
    const note = flag === "green"
      ? `Stable weight (${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}% from baseline)`
      : flag === "yellow"
      ? `${Math.abs(pctChange).toFixed(1)}% ${pctChange < 0 ? "loss" : "gain"} from baseline — monitor`
      : `>10% weight loss from baseline — clinical evaluation warranted`;
    metrics.push({ label:"Weight", baseline:`${vBase.weight} lbs`, current:`${currentVitals.weight} lbs`, flag, note });
  }

  if (vBase.temp && currentVitals.temp) {
    const temp = parseFloat(currentVitals.temp);
    const flag: BaselineMetric["flag"] = temp >= 100.4 ? "red" : temp >= 99.5 ? "yellow" : "green";
    const note = flag === "green" ? "Afebrile" : flag === "yellow" ? "Low-grade elevation — monitor" : "Fever ≥100.4°F — evaluate for infection or irAE";
    metrics.push({ label:"Temperature", baseline:`${vBase.temp}°F`, current:`${currentVitals.temp}°F`, flag, note });
  }

  // ── Labs ──
  const tshCur = getLabVal("TSH");
  if (lBase.tsh && tshCur !== "—") {
    const v = parseFloat(tshCur);
    const flag: BaselineMetric["flag"] = v < 0.1 || v > 10 ? "red" : v < 0.5 || v > 4.5 ? "yellow" : "green";
    const note = flag === "green" ? "Within normal range (0.5–4.5 mIU/L)" : flag === "yellow" ? `Outside normal range — possible immune-mediated thyroid dysfunction` : `Markedly abnormal — evaluate for immune thyroiditis`;
    metrics.push({ label:"TSH", baseline:`${lBase.tsh} mIU/L`, current:`${tshCur} mIU/L`, flag, note });
  }

  const crCur = getLabVal("Creatinine");
  if (lBase.creatinine && crCur !== "—") {
    const baseV = parseFloat(lBase.creatinine);
    const curV  = parseFloat(crCur);
    const ratio = curV / baseV;
    const flag: BaselineMetric["flag"] = ratio > 3 || curV > 3.0 ? "red" : ratio > 1.5 || curV > 1.5 ? "yellow" : "green";
    const note = flag === "green" ? "Stable renal function" : flag === "yellow" ? `${ratio.toFixed(1)}× baseline — possible nephrotoxicity; monitor` : `>3× baseline — evaluate for immune-mediated nephritis`;
    metrics.push({ label:"Creatinine", baseline:`${lBase.creatinine} mg/dL`, current:`${crCur} mg/dL`, flag, note });
  }

  const astCur = getLabVal("AST");
  if (lBase.ast && astCur !== "—") {
    const v = parseFloat(astCur);
    const flag: BaselineMetric["flag"] = v > 120 ? "red" : v > 40 ? "yellow" : "green";
    const note = flag === "green" ? "Within ULN (≤40 U/L)" : flag === "yellow" ? `${(v/40).toFixed(1)}× ULN — monitor for hepatotoxicity` : `>3× ULN — evaluate for immune-mediated hepatitis`;
    metrics.push({ label:"AST", baseline:`${lBase.ast} U/L`, current:`${astCur} U/L`, flag, note });
  }

  const altCur = getLabVal("ALT");
  if (lBase.alt && altCur !== "—") {
    const v = parseFloat(altCur);
    const flag: BaselineMetric["flag"] = v > 120 ? "red" : v > 40 ? "yellow" : "green";
    const note = flag === "green" ? "Within ULN (≤40 U/L)" : flag === "yellow" ? `${(v/40).toFixed(1)}× ULN — monitor for hepatotoxicity` : `>3× ULN — evaluate for immune-mediated hepatitis`;
    metrics.push({ label:"ALT", baseline:`${lBase.alt} U/L`, current:`${altCur} U/L`, flag, note });
  }

  const bilCur = getLabVal("Bilirubin") !== "—" ? getLabVal("Bilirubin") : "0.5";
  if (lBase.bilirubin) {
    const v = parseFloat(bilCur);
    const flag: BaselineMetric["flag"] = v > 1.5 ? "red" : v > 1.0 ? "yellow" : "green";
    const note = flag === "green" ? "Within normal range (≤1.0 mg/dL)" : flag === "yellow" ? "Mildly elevated — monitor trend" : ">1.5× ULN — evaluate for hepatic involvement";
    metrics.push({ label:"Bilirubin", baseline:`${lBase.bilirubin} mg/dL`, current:`${bilCur} mg/dL`, flag, note });
  }

  // ── Clinical (SpO₂, bowel, skin) ──
  return [...metrics, ...(PATIENT_CLINICAL_BASELINES[patientId] ?? [])];
}

// ─── Encounter detail (within visit tab) ─────────────────────────────────────

// ─── Symptom Assessment Wizard ────────────────────────────────────────────────

function buildEhrAutoMessage(results: ModuleResult[], _baselineMetrics: BaselineMetric[]): string {
  const lines: string[] = [
    "CTCAE TOXICITY NOTIFICATION — NURSE-TO-PROVIDER",
    `Assessment Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
    "",
  ];
  const highGrade = CTCAE_MODULES.map((m, i) => ({ m, r: results[i] })).filter(({ r }) => r.screening === "yes" && (r.grade ?? 0) >= 2);
  if (highGrade.length > 0) {
    lines.push("GRADE ≥2 CTCAE FINDINGS:");
    highGrade.forEach(({ m, r }) => {
      lines.push(`• ${m.label} — Grade ${r.grade}`);
      if (r.checkedSymptoms.length > 0) lines.push(`  Symptoms: ${r.checkedSymptoms.join(", ")}`);
      if (r.customValue && m.customField) lines.push(`  ${m.customField.label}: ${r.customValue} ${m.customField.unit}`);
      if (r.notes) lines.push(`  Notes: ${r.notes}`);
    });
  }

  // Free-text findings (Other module) — no numeric grade; the nurse writes
  // the CTCAE grade into the note itself, so include whenever they answered
  // "yes" and typed anything.
  const freeText = CTCAE_MODULES
    .map((m, i) => ({ m, r: results[i] }))
    .filter(({ m, r }) => m.freeText && r.screening === "yes" && (r.notes ?? "").trim() !== "");
  if (freeText.length > 0) {
    if (highGrade.length > 0) lines.push("");
    lines.push("OTHER FINDINGS (nurse-documented, grade per CTCAE per nurse):");
    freeText.forEach(({ m, r }) => {
      lines.push(`• ${m.label}`);
      lines.push(`  ${r.notes}`);
    });
  }

  return lines.join("\n");
}

// ─── Provider orders (mock generator) ────────────────────────────────────────
// In production these would come from the physician's order-entry system.
// For the mockup, we synthesize a plausible order set from the Grade ≥2
// CTCAE findings so the display feels patient-specific.

function buildProviderOrders(results: ModuleResult[]): ProviderOrderSet {
  const orders: ProviderOrder[] = [];
  // Map Grade ≥2 findings to representative oncology orders.
  CTCAE_MODULES.forEach((m, i) => {
    const r = results[i];
    if (r.screening !== "yes" || (r.grade ?? 0) < 2) return;
    const g = r.grade ?? 0;
    const tag = `Grade ${g} ${m.label.toLowerCase()}`;

    if (m.id === "pneumonitis") {
      orders.push({ category: "medication", title: "Prednisone 1 mg/kg PO daily", detail: "Taper over 4–6 weeks after clinical improvement", rationale: tag });
      orders.push({ category: "imaging",    title: "CT chest with contrast",       detail: "Rule out progression; compare to baseline",           rationale: tag });
      if (g >= 3) orders.push({ category: "consult", title: "Pulmonology consult", detail: "Urgent — same-day review", rationale: tag });
    } else if (m.id === "colitis") {
      orders.push({ category: "medication", title: "Prednisone 1–2 mg/kg PO daily", detail: "Taper over 4–6 weeks; consider infliximab if refractory", rationale: tag });
      orders.push({ category: "lab",        title: "CBC, CMP q3d",                  detail: "Monitor electrolytes and hydration status",                rationale: tag });
      orders.push({ category: "consult",    title: "GI consult",                    detail: "Endoscopy consideration if refractory",                    rationale: tag });
    } else if (m.id === "skin") {
      orders.push({ category: "medication", title: g >= 3 ? "Prednisone 0.5–1 mg/kg PO daily" : "Triamcinolone 0.1% cream topical BID", detail: g >= 3 ? "Systemic steroids for severe rash" : "Apply to affected areas", rationale: tag });
      if (g >= 3) orders.push({ category: "consult", title: "Dermatology consult", detail: "Same-day review", rationale: tag });
    } else if (m.id === "hepatitis") {
      orders.push({ category: "medication", title: "Prednisone 1 mg/kg PO daily", detail: "Taper over 4–6 weeks after LFT normalization", rationale: tag });
      orders.push({ category: "lab",        title: "AST, ALT, T. bilirubin q48h",  detail: "Monitor for continued elevation",                rationale: tag });
      if (g >= 3) orders.push({ category: "consult", title: "Hepatology consult", detail: "Rule out other causes; consider biopsy", rationale: tag });
    } else if (m.id === "nephritis") {
      orders.push({ category: "medication", title: "Prednisone 1 mg/kg PO daily", detail: "Taper over 4–6 weeks",                    rationale: tag });
      orders.push({ category: "lab",        title: "BMP, urinalysis q48h",         detail: "Monitor creatinine trend and proteinuria", rationale: tag });
      if (g >= 3) orders.push({ category: "consult", title: "Nephrology consult", detail: "Rule out other causes", rationale: tag });
    } else if (m.id === "diarrhea") {
      orders.push({ category: "medication", title: "Loperamide 4 mg PO after each unformed stool", detail: "Max 16 mg/day; hold if no improvement in 48h", rationale: tag });
      orders.push({ category: "lab",        title: "Stool studies + BMP",                          detail: "Rule out infectious cause; check electrolytes", rationale: tag });
    } else if (m.id === "other") {
      // Free-text findings → the provider's own note captures orders; skip auto-generation.
    }
  });

  // Every escalation gets a follow-up visit and a check-in window.
  if (orders.length > 0) {
    orders.push({ category: "follow-up", title: "Return clinic visit in 5–7 days", detail: "Reassess symptoms and repeat labs", rationale: "Standard irAE monitoring" });
    orders.push({ category: "follow-up", title: "Nurse phone check-in in 48h",     detail: "Confirm symptom trajectory and medication tolerance" });
  }

  // Providers typically leave a brief context note; here we synthesize one.
  const highGrade = CTCAE_MODULES
    .map((m, i) => ({ m, r: results[i] }))
    .filter(({ r }) => r.screening === "yes" && (r.grade ?? 0) >= 2);
  const labels = highGrade.map(({ m, r }) => `Grade ${r.grade} ${m.label.toLowerCase()}`).join(" and ");
  const providerNotes = highGrade.length > 0
    ? `Reviewed with nursing. Findings consistent with ${labels}. Plan as above. Family updated on rationale and return precautions. Will reassess at next visit or sooner if symptoms worsen.`
    : "";

  return { orders, providerNotes };
}

// ─── Auto-grade helpers ────────────────────────────────────────────────────────

// CTCAE grade threshold tables per hep metric. Each entry is the UPPER bound
// of that grade's range (inclusive on the low side, exclusive on the high
// side of the *next* threshold). Grade 4 has an implicit +Infinity ceiling.
//
// - `normal[]` multipliers are applied against ULN when baseline ≤ ULN or is
//   missing.
// - `elevated[]` multipliers are applied against BASELINE when baseline > ULN.
// - `elevatedG3CapMultiple` handles the AST/ALT "up to 5× ULN" cap on G3.
//   Bilirubin has no such cap (undefined here).
const HEP_THRESHOLDS: Record<string, HepThresholds> = {
  alt: {
    normal:   [3, 5, 20, 20],    // >ULN–3, >3–5, >5–20, >20
    elevated: [1.5, 2, 4, 4],    // 1.0–1.5, >1.5–2, >2–4, >4  (of baseline)
    elevatedG3CapMultiple: 5,
  },
  ast: {
    normal:   [3, 5, 20, 20],
    elevated: [1.5, 2, 4, 4],
    elevatedG3CapMultiple: 5,
  },
  bilirubin: {
    normal:   [1.5, 3, 10, 10],  // >ULN–1.5, >1.5–3, >3–10, >10
    elevated: [1.5, 2.5, 10, 10],// 1.0–1.5, >1.5–2.5, >2.5–10, >10  (of baseline)
    // No G3 cap for bilirubin.
  },
};

// CTCAE grading for hepatic metrics with baseline-aware thresholds.
// - If baseline was normal (≤ULN) or missing: grade from multiples of ULN.
// - If baseline was elevated (>ULN): grade from multiples of baseline;
//   AST/ALT additionally cap G3 at 5× ULN (moving anything above to G4).
// - Grade 0 when baseline >ULN: current ≤ baseline (no worsening from
//   pre-treatment state). Grade 0 when baseline ≤ULN: current ≤ ULN.
function autoGradeHepMetric(
  key: string,
  valueStr: string,
  opts?: { baseline?: string; uln?: number }
): number | null {
  const v = parseFloat(valueStr);
  if (isNaN(v) || valueStr.trim() === "") return null;
  const uln = opts?.uln ?? (key === "bilirubin" ? 1.0 : 40);
  const t = HEP_THRESHOLDS[key];
  if (!t) return null;
  const baselineStr = opts?.baseline;
  const baseline = baselineStr ? parseFloat(baselineStr) : NaN;
  const baselineIsElevated = !isNaN(baseline) && baseline > uln;

  if (baselineIsElevated) {
    if (v <= baseline) return 0;
    const g3UpperRaw = t.elevated[2] * baseline;
    const g3Upper = t.elevatedG3CapMultiple !== undefined
      ? Math.min(g3UpperRaw, t.elevatedG3CapMultiple * uln)
      : g3UpperRaw;
    if (v > g3Upper)                return 4;
    if (v > t.elevated[1] * baseline) return 3;
    if (v > t.elevated[0] * baseline) return 2;
    if (v > 1.0 * baseline)           return 1;
    return 0;
  }
  // Baseline normal or missing — ULN-anchored.
  if (v > t.normal[2] * uln) return 4;
  if (v > t.normal[1] * uln) return 3;
  if (v > t.normal[0] * uln) return 2;
  if (v > uln)               return 1;
  return 0;
}

// Build the paired CTCAE grade descriptions for any hepatic metric (AST,
// ALT, bilirubin) using its HEP_THRESHOLDS entry. The `activeSet` field
// tells the render layer which column is live.
function buildHepGradePair(
  key: string,
  baseline: number | null,
  uln: number,
  unit: string
): { activeSet: "normal" | "elevated" | "unknown"; rows: PairedGradeRow[] } {
  const t = HEP_THRESHOLDS[key];
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  const hasBaseline = baseline !== null && !isNaN(baseline);
  const baselineElevated = hasBaseline && (baseline as number) > uln;
  const activeSet: "normal" | "elevated" | "unknown" =
    !hasBaseline ? "unknown" : baselineElevated ? "elevated" : "normal";
  if (!t) return { activeSet, rows: [] };

  const b = baseline ?? 0;
  const [n1, n2, n3] = t.normal;   // n{i} = grade-i upper multiple of ULN
  const [e1, e2, e3] = t.elevated; // e{i} = grade-i upper multiple of baseline
  const g3ElevRaw = e3 * b;
  const g3ElevCapped = t.elevatedG3CapMultiple !== undefined
    ? Math.min(g3ElevRaw, t.elevatedG3CapMultiple * uln)
    : g3ElevRaw;

  const normalDesc = (g: number) => {
    switch (g) {
      case 0: return `Within normal range (≤${fmt(uln)} ${unit})`;
      case 1: return `>ULN – ${fmt(n1)}× ULN  (>${fmt(uln)} – ${fmt(n1 * uln)} ${unit})`;
      case 2: return `>${fmt(n1)} – ${fmt(n2)}× ULN  (>${fmt(n1 * uln)} – ${fmt(n2 * uln)} ${unit})`;
      case 3: return `>${fmt(n2)} – ${fmt(n3)}× ULN  (>${fmt(n2 * uln)} – ${fmt(n3 * uln)} ${unit})`;
      case 4: return `>${fmt(n3)}× ULN  (>${fmt(n3 * uln)} ${unit})`;
      default: return "";
    }
  };
  const g3CapNote = t.elevatedG3CapMultiple !== undefined
    ? `, up to ${fmt(t.elevatedG3CapMultiple)}× ULN`
    : "";
  const elevatedDesc = (g: number) => {
    if (!hasBaseline) {
      switch (g) {
        case 0: return `No worsening from baseline`;
        case 1: return `1.0 – ${fmt(e1)}× baseline`;
        case 2: return `>${fmt(e1)} – ${fmt(e2)}× baseline`;
        case 3: return `>${fmt(e2)} – ${fmt(e3)}× baseline${g3CapNote}`;
        case 4: return `>${fmt(e3)}× baseline`;
        default: return "";
      }
    }
    switch (g) {
      case 0: return `No worsening from baseline (≤${fmt(b)} ${unit})`;
      case 1: return `1.0 – ${fmt(e1)}× baseline  (>${fmt(b)} – ${fmt(e1 * b)} ${unit})`;
      case 2: return `>${fmt(e1)} – ${fmt(e2)}× baseline  (>${fmt(e1 * b)} – ${fmt(e2 * b)} ${unit})`;
      case 3: return `>${fmt(e2)} – ${fmt(e3)}× baseline${g3CapNote}  (>${fmt(e2 * b)} – ${fmt(g3ElevCapped)} ${unit})`;
      case 4: return `>${fmt(e3)}× baseline  (>${fmt(g3ElevCapped)} ${unit})`;
      default: return "";
    }
  };
  const rows: PairedGradeRow[] = [0, 1, 2, 3, 4].map(g => ({
    grade: g,
    normalDesc: normalDesc(g),
    elevatedDesc: elevatedDesc(g),
  }));
  return { activeSet, rows };
}

// CTCAE grading for creatinine (nephritis).
// Asymmetric rule structure: G1 (>ULN–1.5× ULN) and G4 (>6× ULN) are
// ULN-anchored regardless of baseline. Only G2 and G3 differ.
// - baseline < LLN: G2 = >1.5–3× baseline; G3 = >3× baseline (up to 6× ULN)
// - baseline ≥ LLN (or missing): G2 = >1.5–3× ULN; G3 = >3–6× ULN
// Build the paired CTCAE grade description set for creatinine (nephritis).
// The "active" side flips based on whether baseline is BELOW LLN (not >ULN
// like the hep metrics). G1 and G4 are ULN-anchored regardless of baseline
// so both columns show the same text for those grades — greyed on the
// inactive side and full opacity on the active side so users read the row
// consistently.
function buildNephritisGradePair(
  baseline: number | null,
  uln: number,
  lln: number,
  unit: string
): { activeSet: "normal" | "elevated" | "unknown"; rows: PairedGradeRow[] } {
  // We reuse "normal" / "elevated" naming from the hep pair for render
  // symmetry: "normal" = baseline ≥ LLN (rule set anchored to ULN);
  // "elevated" (misnomer here) = baseline < LLN branch. Rendering only
  // cares about which of the two columns is active.
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  const hasBaseline = baseline !== null && !isNaN(baseline);
  const baselineBelowLln = hasBaseline && (baseline as number) < lln;
  const activeSet: "normal" | "elevated" | "unknown" =
    !hasBaseline ? "unknown" : baselineBelowLln ? "elevated" : "normal";
  const b = baseline ?? 0;

  const normalDesc = (g: number) => {
    switch (g) {
      case 0: return `Within normal range (≤${fmt(uln)} ${unit})`;
      case 1: return `>ULN – 1.5× ULN  (>${fmt(uln)} – ${fmt(1.5 * uln)} ${unit})`;
      case 2: return `>1.5 – 3.0× ULN  (>${fmt(1.5 * uln)} – ${fmt(3 * uln)} ${unit})`;
      case 3: return `>3.0 – 6.0× ULN  (>${fmt(3 * uln)} – ${fmt(6 * uln)} ${unit})`;
      case 4: return `>6.0× ULN  (>${fmt(6 * uln)} ${unit})`;
      default: return "";
    }
  };
  const elevatedDesc = (g: number) => {
    // G1 and G4 are identical to the baseline-normal branch.
    if (g === 0 || g === 1 || g === 4) return normalDesc(g);
    if (!hasBaseline) {
      switch (g) {
        case 2: return `>1.5 – 3.0× baseline`;
        case 3: return `>3.0× baseline`;
        default: return "";
      }
    }
    switch (g) {
      case 2: return `>1.5 – 3.0× baseline  (>${fmt(1.5 * b)} – ${fmt(3 * b)} ${unit})`;
      case 3: return `>3.0× baseline  (>${fmt(3 * b)} ${unit})`;
      default: return "";
    }
  };
  const rows: PairedGradeRow[] = [0, 1, 2, 3, 4].map(g => ({
    grade: g,
    normalDesc: normalDesc(g),
    elevatedDesc: elevatedDesc(g),
  }));
  return { activeSet, rows };
}

function autoGradeNephritis(
  valueStr: string,
  opts?: { baseline?: string; uln?: number; lln?: number }
): number | null {
  const v = parseFloat(valueStr);
  if (isNaN(v) || valueStr.trim() === "") return null;
  const uln = opts?.uln ?? 1.0;
  const lln = opts?.lln ?? 0.6;
  const baselineStr = opts?.baseline;
  const baseline = baselineStr ? parseFloat(baselineStr) : NaN;
  const baselineBelowLln = !isNaN(baseline) && baseline < lln;

  // G0 and G4 are fixed at both edges.
  if (v <= uln)    return 0;
  if (v > 6 * uln) return 4;

  // G1: same in both rule sets. Anchor to ULN; a value in (1.5*ULN, ...]
  // moves to G2/G3.
  if (v <= 1.5 * uln) return 1;

  // G2 / G3 diverge by rule set.
  if (baselineBelowLln) {
    if (v > 3 * baseline)   return 3;
    if (v > 1.5 * baseline) return 2;
    return 2; // Should be unreachable given v > 1.5*uln > 1.5*baseline here.
  }
  if (v > 3 * uln) return 3;
  return 2;
}

function autoGradeDiarrhea(valueStr: string): number | null {
  const v = parseFloat(valueStr);
  if (isNaN(v) || valueStr.trim() === "") return null;
  if (v >= 7) return 3;
  if (v >= 4) return 2;
  if (v >= 1) return 1;
  return 0;
}

function SymptomAssessmentWizard({
  labValues, labBaselines = {}, savedResults, savedEscalation, onResultsChange, onEscalationChange, onComplete, readOnly = false, baselineMetrics = [],
}: {
  labValues: Record<string, string>;
  labBaselines?: Record<string, string>;
  savedResults?: ModuleResult[];
  savedEscalation?: EscalationState;
  onResultsChange: (rs: ModuleResult[]) => void;
  onEscalationChange?: (e: EscalationState) => void;
  onComplete: () => void;
  readOnly?: boolean;
  baselineMetrics?: BaselineMetric[];
}) {
  const initResults = (): ModuleResult[] =>
    CTCAE_MODULES.map(mod => {
      // Pre-compute auto-grades from pre-filled lab values. Nephritis and
      // hepatitis share this branch — nephritis uses autoGradeNephritis
      // (needs LLN too), hepatitis metrics use autoGradeHepMetric.
      if (mod.perMetricGrades && mod.labFields) {
        const pmg: Record<string, number | null> = {};
        for (const lf of mod.labFields) {
          const val = lf.sourceKey ? (labValues[lf.sourceKey] ?? "") : "";
          const baseline = lf.sourceKey ? labBaselines[lf.sourceKey] : undefined;
          pmg[lf.key] = val
            ? (mod.id === "nephritis"
                ? autoGradeNephritis(val, { baseline, uln: lf.uln, lln: lf.lln })
                : autoGradeHepMetric(lf.key, val, { baseline, uln: lf.uln }))
            : null;
        }
        const grades = Object.values(pmg).filter(g => g !== null) as number[];
        const overall = grades.length > 0 ? Math.max(...grades) : null;
        return { screening: null, checkedSymptoms: [], notes: "", labOverrides: {}, customValue: "", grade: overall, gradeIsAuto: overall !== null, perMetricGrades: pmg };
      }
      return { screening: null, checkedSymptoms: [], notes: "", labOverrides: {}, customValue: "", grade: null, gradeIsAuto: false, perMetricGrades: {} };
    });

  const isAllDone = (rs: ModuleResult[]) =>
    rs.every((r, i) => {
      if (r.screening === "no") return true;
      // Free-text modules complete on non-empty notes; others on a picked grade.
      if (CTCAE_MODULES[i]?.freeText) return (r.notes ?? "").trim() !== "";
      return r.grade !== null;
    });

  const [moduleIdx, setModuleIdx] = useState(0);
  const [phase, setPhase] = useState<"screening" | "detail" | "grade">("screening");
  const [results, setResults] = useState<ModuleResult[]>(savedResults ?? initResults);
  const [showSummary, setShowSummary] = useState(() => !!savedResults && isAllDone(savedResults));
  const [escalation, setEscalation] = useState<EscalationState>(savedEscalation ?? { ...DEFAULT_ESCALATION });
  // Tracks per-metric acknowledgement that the user picked a grade from the
  // rule-set that doesn't match the patient's baseline (e.g. clicked a
  // baseline-normal grade for a patient whose baseline is >ULN). Applies to
  // any paired-grade hep metric (AST, ALT, bilirubin). Cleared when they
  // pick from the active set or when the value changes.
  const [hepOverrideWarnings, setHepOverrideWarnings] = useState<Record<string, boolean>>({});

  // Rule of Nines BSA calculator state (skin toxicity only)
  const [bsaOpen, setBsaOpen] = useState(false);
  const BSA_REGIONS = [
    { key: "head",     label: "Head and face",  options: [0, 4.5, 9]  },
    { key: "torso",    label: "Torso (front)",   options: [0, 9, 18]   },
    { key: "back",     label: "Back",            options: [0, 9, 18]   },
    { key: "rightArm", label: "Right arm",       options: [0, 4.5, 9]  },
    { key: "leftArm",  label: "Left arm",        options: [0, 4.5, 9]  },
    { key: "genitals", label: "Genital area",    options: [0, 1]       },
    { key: "rightLeg", label: "Right leg",       options: [0, 9, 18]   },
    { key: "leftLeg",  label: "Left leg",        options: [0, 9, 18]   },
  ] as const;
  type BsaKey = typeof BSA_REGIONS[number]["key"];
  const [bsaSelections, setBsaSelections] = useState<Partial<Record<BsaKey, number>>>({});
  const bsaTotal = Object.values(bsaSelections).reduce((s, v) => s + (v ?? 0), 0);
  function setBsaRegion(key: BsaKey, val: number) {
    const next = { ...bsaSelections, [key]: val };
    setBsaSelections(next);
    const total = Object.values(next).reduce((s, v) => s + (v ?? 0), 0);
    if (total > 50) {
      updateRes({ grade: 3, gradeIsAuto: true });
    }
  }

  const mod = CTCAE_MODULES[moduleIdx];
  const res = results[moduleIdx];

  function updateRes(patch: Partial<ModuleResult>) {
    const next = results.map((r, i) => i === moduleIdx ? { ...r, ...patch } : r);
    setResults(next);
    onResultsChange(next);
  }

  // Smart lab-override update: recomputes auto-grades when values change
  function updateLabOverride(key: string, value: string) {
    const newOverrides = { ...res.labOverrides, [key]: value };
    if (mod.perMetricGrades && mod.labFields) {
      // Hep-style modules (hepatitis, nephritis): recompute per-metric
      // grades from current inputs. Grader picked by module id.
      const newPmg: Record<string, number | null> = { ...(res.perMetricGrades ?? {}) };
      const effective = (k: string) => {
        const overrideVal = newOverrides[k];
        if (overrideVal !== undefined && overrideVal !== "") return overrideVal;
        const lf = mod.labFields!.find(f => f.key === k);
        return lf?.sourceKey ? (labValues[lf.sourceKey] ?? "") : "";
      };
      for (const lf of mod.labFields) {
        const v = effective(lf.key);
        const baseline = lf.sourceKey ? labBaselines[lf.sourceKey] : undefined;
        newPmg[lf.key] = v
          ? (mod.id === "nephritis"
              ? autoGradeNephritis(v, { baseline, uln: lf.uln, lln: lf.lln })
              : autoGradeHepMetric(lf.key, v, { baseline, uln: lf.uln }))
          : null;
      }
      const grades = Object.values(newPmg).filter(g => g !== null) as number[];
      const overall = grades.length > 0 ? Math.max(...grades) : null;
      updateRes({ labOverrides: newOverrides, perMetricGrades: newPmg, grade: overall, gradeIsAuto: true });
      // A value change re-runs auto-grading, so any previous manual "wrong
      // rule-set" pick is superseded — clear the warning banner for this key.
      if (hepOverrideWarnings[key]) {
        setHepOverrideWarnings(w => ({ ...w, [key]: false }));
      }
    } else {
      updateRes({ labOverrides: newOverrides });
    }
  }

  function updateCustomValue(value: string) {
    if (mod.id === "diarrhea") {
      const g = autoGradeDiarrhea(value);
      updateRes({ customValue: value, grade: g, gradeIsAuto: g !== null });
    } else {
      updateRes({ customValue: value });
    }
  }

  function updateEsc(patch: Partial<EscalationState>) {
    const next = { ...escalation, ...patch };
    setEscalation(next);
    onEscalationChange?.(next);
  }

  function gradeSelectedColor(g: number) {
    if (g === 0 || g === 1) return { bg: "var(--sev-ok-bg)", border: "#86efac", text: "var(--sev-ok-fg)" };
    if (g === 2) return { bg: "var(--sev-warning-bg)", border: "#fcd34d", text: "var(--sev-warning-fg)" };
    if (g === 3) return { bg: "var(--sev-critical-bg)", border: "#fca5a5", text: "var(--grade-3-fg)" };
    return { bg: "#fdf4ff", border: "#d8b4fe", text: "#7c3aed" };
  }

  // For hepatitis, goBack from detail goes to screening (no separate grade phase)
  function goBack() {
    if (phase === "grade") {
      setPhase(mod.symptoms || mod.customField || mod.labFields || mod.freeText ? "detail" : "screening");
    } else if (phase === "detail") {
      setPhase("screening");
    } else if (moduleIdx > 0) {
      setModuleIdx(i => i - 1);
      // Go to detail if prev module has detail content, otherwise grade
      const prevMod = CTCAE_MODULES[moduleIdx - 1];
      setPhase(prevMod.perMetricGrades || prevMod.freeText ? "detail" : "grade");
    }
  }

  function advanceModule() {
    if (moduleIdx < CTCAE_MODULES.length - 1) {
      setModuleIdx(i => i + 1);
      setPhase("screening");
    } else {
      setShowSummary(true);
    }
  }

  // For modules with perMetricGrades (hepatitis, nephritis): all per-metric
  // grades must be non-null to advance
  const allMetricsGraded = mod.perMetricGrades && mod.labFields
    ? mod.labFields.every(lf => (res.perMetricGrades ?? {})[lf.key] !== null && (res.perMetricGrades ?? {})[lf.key] !== undefined)
    : false;

  function getLabVal(sourceKey?: string) {
    if (!sourceKey) return "";
    return labValues[sourceKey] ?? "";
  }

  const canGoBack = phase !== "screening" || moduleIdx > 0;

  if (showSummary) {
    const highGradeModules = CTCAE_MODULES.filter((_, i) => results[i].screening === "yes" && (results[i].grade ?? 0) >= 2);
    const hasHighGrade = highGradeModules.length > 0;
    const allGrades = results.map(r => r.grade ?? 0);
    const maxGrade = Math.max(...allGrades);
    const maxGradeColor = maxGrade >= 4 ? "#7c3aed" : maxGrade >= 3 ? "var(--grade-3-fg)" : maxGrade >= 2 ? "var(--sev-warning-fg)" : "var(--sev-ok-fg)";

    // Escalation completion checks
    const notifDone = escalation.notificationConfirmed && escalation.notificationMethod !== "";
    const treatmentDone = escalation.treatmentDecision !== "";
    const followUpDone = escalation.nurseFollowUp.trim().length > 0;
    // Orders are optional (a "continue treatment, no orders" decision is valid).
    // Completion gates on: nurse notes → notification → treatment decision → clinical notes.
    const escalationComplete = !hasHighGrade || (escalation.nurseNotes.trim().length > 0 && notifDone && treatmentDone && followUpDone);

    const ehrAutoText = buildEhrAutoMessage(results, baselineMetrics);

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} style={{ color: "var(--sev-ok-fg)" }} />
            <span className="text-sm font-semibold text-foreground">Assessment Summary</span>
          </div>
          {!readOnly && (
            <button onClick={() => { setShowSummary(false); setModuleIdx(0); setPhase("screening"); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Edit Responses
            </button>
          )}
        </div>

        {/* Highest grade banner */}
        {maxGrade > 0 && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded border" style={{ background: maxGrade >= 2 ? "var(--sev-warning-bg)" : "var(--sev-ok-bg)", borderColor: maxGrade >= 2 ? "#fcd34d" : "#86efac" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Highest Grade Identified</span>
            <span className="text-sm font-bold" style={{ color: maxGradeColor }}>Grade {maxGrade}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{maxGrade <= 1 ? "Routine documentation" : "Provider review recommended"}</span>
          </div>
        )}

        {/* Module summary grid */}
        <div className="rounded border overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
          <div className="grid px-4 py-2 border-b" style={{ gridTemplateColumns: "1fr 5rem", background: "#f8fafc", borderColor: "rgba(15,39,68,0.07)" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a0aab8" }}>Module</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-right" style={{ color: "#a0aab8" }}>Grade</span>
          </div>
          {CTCAE_MODULES.map((m, i) => {
            const r = results[i];
            const g = r.screening === "no" ? null : r.grade;
            const gc = g !== null ? gradeSelectedColor(g) : null;
            const isLast = i === CTCAE_MODULES.length - 1;
            const isFreeText = !!m.freeText;
            const freeTextFilled = isFreeText && (r.notes ?? "").trim() !== "";
            return (
              <div key={m.id} className={`flex items-start gap-3 px-4 py-3 ${!isLast ? "border-b" : ""}`}
                style={{ borderColor: "rgba(15,39,68,0.07)" }}>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground">{m.label}</div>
                  {r.screening === "no"
                    ? <div className="text-xs text-muted-foreground mt-0.5">No symptoms reported</div>
                    : isFreeText
                      ? freeTextFilled
                        ? <div className="text-xs mt-0.5" style={{ color: "var(--sev-info-fg)" }}>Free-text entry documented</div>
                        : <div className="text-xs text-muted-foreground mt-0.5">Symptoms reported — no details entered</div>
                      : r.grade !== null
                        ? <div className="text-xs mt-0.5" style={{ color: gc?.text }}>Grade {r.grade} documented</div>
                        : <div className="text-xs text-muted-foreground mt-0.5">Symptoms reported — no grade selected</div>
                  }
                  {r.screening === "yes" && r.checkedSymptoms.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-0.5">{r.checkedSymptoms.join(", ")}</div>
                  )}
                  {r.screening === "yes" && r.customValue && (
                    <div className="text-xs text-muted-foreground mt-0.5">{r.customValue} {CTCAE_MODULES[i].customField?.unit}</div>
                  )}
                  {r.notes && <div className="text-xs text-muted-foreground mt-0.5 italic">{r.notes}</div>}
                </div>
                <div className="flex-none text-right">
                  {r.screening === "no"
                    ? <span className="text-xs px-2 py-0.5 rounded-sm font-medium" style={{ background: "var(--sev-ok-bg)", color: "var(--sev-ok-fg)" }}>None</span>
                    : isFreeText
                      ? freeTextFilled
                        ? <span className="text-xs px-2 py-0.5 rounded-sm font-medium" style={{ background: "var(--sev-info-bg)", color: "var(--sev-info-fg)", border: "1px solid var(--sev-info-border)" }}>Documented</span>
                        : <span className="text-xs px-2 py-0.5 rounded-sm font-medium" style={{ background: "#f4f6fa", color: "var(--muted-foreground)" }}>Pending</span>
                      : r.grade !== null && gc
                        ? <span className="text-xs px-2 py-0.5 rounded-sm font-medium" style={{ background: gc.bg, color: gc.text, border: `1px solid ${gc.border}` }}>
                            Grade {r.grade}
                          </span>
                        : <span className="text-xs px-2 py-0.5 rounded-sm font-medium" style={{ background: "#f4f6fa", color: "var(--muted-foreground)" }}>Pending</span>
                  }
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Escalation Workflow (grade ≥ 2 only) ───────────────────────────── */}
        {hasHighGrade && !readOnly && (
          <div className="space-y-3">
            {/* Alert */}
            <div className="rounded border px-3 py-3 flex items-start gap-2.5" style={{ background: "var(--sev-critical-bg)", borderColor: "#fca5a5" }}>
              <AlertCircle size={14} style={{ color: "var(--grade-3-fg)", marginTop: 1 }} className="flex-none" />
              <div>
                <div className="text-sm font-bold" style={{ color: "var(--grade-3-fg)" }}>Provider Review Recommended</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {highGradeModules.length} Grade ≥2 {highGradeModules.length === 1 ? "toxicity" : "toxicities"} identified:{" "}
                  {highGradeModules.map((m, i) => {
                    const idx = CTCAE_MODULES.indexOf(m);
                    return <span key={m.id}>{i > 0 ? " · " : ""}{m.label} (Grade {results[idx].grade})</span>;
                  })}
                </div>
              </div>
            </div>

            {/* Section wrapper helper */}
            {/* ── 1. Nurse Assessment Notes ── */}
            <div className="rounded border overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
              <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ background: "#f8fafc", borderColor: "rgba(15,39,68,0.08)" }}>
                <span className="text-xs font-semibold text-foreground">Nurse Assessment Notes</span>
              </div>
              <div className="px-4 py-3">
                <label className="block text-xs text-muted-foreground mb-1.5">Document your clinical assessment and relevant context</label>
                <textarea rows={3} value={escalation.nurseNotes} placeholder="Document clinical observations, patient-reported symptoms, relevant context, and any immediate interventions initiated..."
                  onChange={e => updateEsc({ nurseNotes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-white text-foreground focus:outline-none focus:border-accent resize-none" />
              </div>
            </div>

            {/* ── 2. Provider Notification ── */}
            {escalation.nurseNotes.trim().length > 0 && (
              <div className="rounded border overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
                <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ background: "#f8fafc", borderColor: "rgba(15,39,68,0.08)" }}>
                  <span className="text-xs font-semibold text-foreground">Provider Notification</span>
                  {notifDone && <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-sm" style={{ background: "var(--sev-ok-bg)", color: "var(--sev-ok-fg)" }}>Confirmed</span>}
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Notification Method</div>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { val: "ehr",            label: "EHR Notification" },
                        { val: "in-person",      label: "In-Person Discussion" },
                        { val: "phone",          label: "Phone Call" },
                        { val: "secure-message", label: "Secure Message" },
                        { val: "other",          label: "Other" },
                      ] as const).map(opt => {
                        const sel = escalation.notificationMethod === opt.val;
                        return (
                          <button key={opt.val}
                            onClick={() => {
                              const patch: Partial<EscalationState> = { notificationMethod: opt.val, notificationConfirmed: false };
                              if (opt.val === "ehr") patch.ehrMessageOverride = ehrAutoText;
                              updateEsc(patch);
                            }}
                            className="py-2 px-3 text-xs font-medium rounded-sm border text-left transition-all"
                            style={{
                              background: sel ? "var(--accent-soft-bg)" : "#fff",
                              borderColor: sel ? "#93c5fd" : "rgba(15,39,68,0.12)",
                              color: sel ? "var(--accent)" : "var(--primary)",
                            }}>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* EHR auto-populate */}
                  {escalation.notificationMethod === "ehr" && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>EHR Notification — Auto-Populated</label>
                        <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{ background: "var(--accent-soft-bg)", color: "var(--accent)" }}>Auto-generated</span>
                      </div>
                      <textarea rows={10} value={escalation.ehrMessageOverride !== "" ? escalation.ehrMessageOverride : ehrAutoText}
                        onChange={e => updateEsc({ ehrMessageOverride: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-sm border border-border bg-white text-foreground focus:outline-none focus:border-accent resize-none"
                        style={{ fontFamily: "'DM Mono', monospace" }} />
                      <p className="text-xs text-muted-foreground mt-1">Lists Grade ≥2 findings with symptoms and notes. Edit as needed before confirming.</p>
                    </div>
                  )}

                  {/* Additional message */}
                  {escalation.notificationMethod !== "" && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted-foreground)" }}>Additional Message</label>
                      <textarea rows={2} value={escalation.notificationMessage} placeholder="Any additional context or urgent details for the provider..."
                        onChange={e => updateEsc({ notificationMessage: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-white text-foreground focus:outline-none focus:border-accent resize-none" />
                    </div>
                  )}

                  {/* Confirm */}
                  {escalation.notificationMethod !== "" && !escalation.notificationConfirmed && (
                    <button onClick={() => updateEsc({ notificationConfirmed: true })}
                      className="w-full py-2 text-xs font-semibold rounded-sm transition-all"
                      style={{ background: "var(--primary)", color: "#fff" }}>
                      Confirm Provider Notification →
                    </button>
                  )}
                  {escalation.notificationConfirmed && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-sm" style={{ background: "var(--sev-ok-bg)", border: "1px solid #86efac" }}>
                      <CheckCircle2 size={13} style={{ color: "var(--sev-ok-fg)" }} />
                      <span className="text-xs font-semibold" style={{ color: "var(--sev-ok-fg)" }}>Notification documented and confirmed</span>
                      <button onClick={() => updateEsc({ notificationConfirmed: false })} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Edit</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── 3. Orders (provider-entered, displayed read-only) ── */}
            {notifDone && (() => {
              const { orders: providerOrders, providerNotes } = buildProviderOrders(results);
              const CAT_META: Record<OrderCategory, { label: string; Icon: IconComponent; tint: string; fg: string; border: string }> = {
                "medication": { label: "Medication", Icon: Pill,           tint: "#eef2ff", fg: "#3730a3", border: "#c7d2fe" },
                "lab":        { label: "Lab",        Icon: FlaskConical,   tint: "var(--accent-soft-bg)", fg: "var(--accent)", border: "#bfdbfe" },
                "imaging":    { label: "Imaging",    Icon: Camera,         tint: "#fdf4ff", fg: "#a21caf", border: "#f5d0fe" },
                "follow-up":  { label: "Follow-Up",  Icon: Calendar,       tint: "var(--sev-ok-bg)", fg: "var(--sev-ok-fg)", border: "var(--sev-ok-border)" },
                "consult":    { label: "Consult",    Icon: Users2,         tint: "var(--sev-warning-bg)", fg: "var(--sev-warning-fg)", border: "var(--sev-warning-border)" },
              };
              return (
                <div className="rounded border overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
                  <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ background: "#f8fafc", borderColor: "rgba(15,39,68,0.08)" }}>
                    <ClipboardCheck size={13} style={{ color: "var(--muted-foreground)" }} className="flex-none" />
                    <span className="text-xs font-semibold text-foreground">Orders</span>
                    <span className="text-xs text-muted-foreground">· Entered by provider · {providerOrders.length} order{providerOrders.length === 1 ? "" : "s"}</span>
                  </div>
                  <div className="px-4 py-3">
                    {providerOrders.length === 0 && !providerNotes ? (
                      <div className="text-xs text-muted-foreground italic">Provider has not entered any orders yet.</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {providerOrders.map((o, idx) => {
                          const meta = CAT_META[o.category];
                          const Icon = meta.Icon;
                          return (
                            <div key={idx} className="rounded-sm border bg-white overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
                              <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b" style={{ background: meta.tint, borderColor: "rgba(15,39,68,0.08)" }}>
                                <Icon size={11} style={{ color: meta.fg }} />
                                <span className="text-xs font-semibold" style={{ color: meta.fg, letterSpacing: "0.02em" }}>{meta.label}</span>
                              </div>
                              <div className="px-2.5 py-2">
                                <div className="text-sm font-medium text-foreground leading-snug">{o.title}</div>
                                {o.detail && <div className="text-xs text-muted-foreground mt-0.5">{o.detail}</div>}
                                {o.rationale && (
                                  <div className="text-xs mt-1.5 pt-1.5 border-t italic" style={{ borderColor: "rgba(15,39,68,0.06)", color: "#8fa0b4" }}>
                                    for: {o.rationale}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {providerNotes && (
                          <div className="rounded-sm border bg-white overflow-hidden col-span-2" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b" style={{ background: "#f4f6fa", borderColor: "rgba(15,39,68,0.08)" }}>
                              <FileText size={11} style={{ color: "var(--muted-foreground)" }} />
                              <span className="text-xs font-semibold" style={{ color: "var(--primary)", letterSpacing: "0.02em" }}>Provider Notes</span>
                            </div>
                            <div className="px-2.5 py-2">
                              <div className="text-sm text-foreground leading-relaxed">{providerNotes}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── 4. Provider Treatment Decision ── */}
            {notifDone && (
              <div className="rounded border overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
                <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ background: "#f8fafc", borderColor: "rgba(15,39,68,0.08)" }}>
                  <span className="text-xs font-semibold text-foreground">Provider Treatment Decision</span>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { val: "continue",     label: "Continue Treatment" },
                      { val: "hold",         label: "Hold Treatment" },
                      { val: "discontinue",  label: "Permanently Discontinue" },
                      { val: "other",        label: "Other" },
                    ] as const).map(opt => {
                      const sel = escalation.treatmentDecision === opt.val;
                      const isCont = opt.val === "continue";
                      const isDisc = opt.val === "discontinue";
                      return (
                        <button key={opt.val} onClick={() => updateEsc({ treatmentDecision: opt.val })}
                          className="py-2 px-3 text-xs font-medium rounded-sm border text-left transition-all"
                          style={{
                            background: sel ? (isCont ? "var(--sev-ok-bg)" : isDisc ? "var(--sev-critical-bg)" : "var(--sev-warning-bg)") : "#fff",
                            borderColor: sel ? (isCont ? "#86efac" : isDisc ? "#fca5a5" : "#fcd34d") : "rgba(15,39,68,0.12)",
                            color: sel ? (isCont ? "var(--sev-ok-fg)" : isDisc ? "var(--grade-3-fg)" : "var(--sev-warning-fg)") : "var(--primary)",
                          }}>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {escalation.treatmentDecision === "other" && (
                    <input type="text" placeholder="Specify treatment decision..." value={escalation.treatmentDecisionOther}
                      onChange={e => updateEsc({ treatmentDecisionOther: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-white text-foreground focus:outline-none focus:border-accent" />
                  )}
                </div>
              </div>
            )}

            {/* ── 5. Clinical Notes ── */}
            {treatmentDone && (
              <div className="rounded border overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
                <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ background: "#f8fafc", borderColor: "rgba(15,39,68,0.08)" }}>
                  <span className="text-xs font-semibold text-foreground">Clinical Notes</span>
                </div>
                <div className="px-4 py-3">
                  <textarea rows={3} value={escalation.nurseFollowUp} placeholder="Document what occurred after provider review — actions taken, patient response, any changes to care plan..."
                    onChange={e => updateEsc({ nurseFollowUp: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-white text-foreground focus:outline-none focus:border-accent resize-none" />
                </div>
              </div>
            )}

            {/* ── 6. Patient Education ── */}
            {treatmentDone && (
              <div className="rounded border overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
                <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ background: "#f8fafc", borderColor: "rgba(15,39,68,0.08)" }}>
                  <span className="text-xs font-semibold text-foreground">Patient Education</span>
                </div>
                <div className="px-4 py-3">
                  <textarea rows={3} value={escalation.patientEducation} placeholder="Document patient education provided, return precautions reviewed, follow-up instructions given..."
                    onChange={e => updateEsc({ patientEducation: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-white text-foreground focus:outline-none focus:border-accent resize-none" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Read-only escalation summary */}
        {hasHighGrade && readOnly && savedEscalation && (
          <div className="space-y-3">
            <div className="rounded border px-3 py-2.5 flex items-start gap-2" style={{ background: "var(--sev-critical-bg)", borderColor: "#fca5a5" }}>
              <AlertCircle size={13} style={{ color: "var(--grade-3-fg)", marginTop: 1 }} className="flex-none" />
              <div className="text-xs font-semibold" style={{ color: "var(--grade-3-fg)" }}>Grade ≥2 Escalation Documented</div>
            </div>
            {savedEscalation.nurseNotes && <div className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Nurse Notes:</span> {savedEscalation.nurseNotes}</div>}
            {savedEscalation.notificationMethod && <div className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Notification:</span> {savedEscalation.notificationMethod}</div>}
            {savedEscalation.treatmentDecision && <div className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Treatment Decision:</span> {savedEscalation.treatmentDecision}</div>}
          </div>
        )}

        {/* No high grade — routine */}
        {!hasHighGrade && !readOnly && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-sm" style={{ background: "var(--sev-ok-bg)", border: "1px solid #86efac" }}>
            <CheckCircle2 size={13} style={{ color: "var(--sev-ok-fg)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--sev-ok-fg)" }}>All findings Grade 0–1 — routine documentation. No escalation required.</span>
          </div>
        )}

        {!readOnly && (
          <button
            onClick={() => { onResultsChange(results); onEscalationChange?.(escalation); onComplete(); }}
            disabled={!escalationComplete}
            className="w-full py-2 text-xs font-semibold rounded-sm transition-all"
            style={{
              background: escalationComplete ? "var(--primary)" : "#dce4ef",
              color: escalationComplete ? "#fff" : "#8fa0b4",
              cursor: escalationComplete ? "pointer" : "not-allowed",
            }}>
            {hasHighGrade && !escalationComplete ? "Complete escalation workflow above to continue" : "Save & Complete Assessment"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Module progress nav */}
      <div className="flex gap-1 flex-wrap">
        {CTCAE_MODULES.map((m, i) => {
          const r = results[i];
          const done = r.screening === "no" || (r.screening === "yes" && r.grade !== null);
          const active = i === moduleIdx;
          return (
            <button key={m.id} onClick={() => { setModuleIdx(i); setPhase("screening"); }}
              className="px-2.5 py-1 rounded-sm text-xs font-medium transition-all border"
              style={{
                background: active ? "var(--primary)" : done ? "var(--sev-ok-bg)" : "#f4f6fa",
                color: active ? "#fff" : done ? "var(--sev-ok-fg)" : "var(--muted-foreground)",
                borderColor: active ? "var(--primary)" : done ? "#86efac" : "rgba(15,39,68,0.1)",
              }}>
              {done && !active ? "✓ " : ""}{m.label}
            </button>
          );
        })}
      </div>

      {/* Module card */}
      <div className="rounded border overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.12)" }}>
        <div className="px-4 py-3 flex items-center gap-2 border-b" style={{ background: "#f8fafc", borderColor: "rgba(15,39,68,0.08)" }}>
          <BookOpen size={13} style={{ color: "var(--muted-foreground)" }} />
          <span className="text-sm font-semibold text-foreground">{mod.label}</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {phase === "screening" ? "Screening" : phase === "detail" ? "Detail" : "Grade Selection"} · Module {moduleIdx + 1}/{CTCAE_MODULES.length}
          </span>
        </div>

        <div className="px-4 py-4 space-y-4 bg-white">
          {/* Screening */}
          {phase === "screening" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">{mod.screeningQ}</p>
              <div className="flex gap-2">
                {(["yes", "no"] as const).map(ans => (
                  <button key={ans}
                    onClick={() => updateRes({ screening: ans, grade: ans === "no" ? null : res.grade })}
                    className="flex-1 py-2 text-sm font-semibold rounded-sm border transition-all"
                    style={{
                      background: res.screening === ans ? (ans === "no" ? "var(--sev-ok-bg)" : "var(--accent-soft-bg)") : "#fff",
                      borderColor: res.screening === ans ? (ans === "no" ? "#86efac" : "#93c5fd") : "rgba(15,39,68,0.15)",
                      color: res.screening === ans ? (ans === "no" ? "var(--sev-ok-fg)" : "var(--accent)") : "var(--primary)",
                    }}>
                    {ans === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                {canGoBack
                  ? <button onClick={goBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</button>
                  : <span />
                }
                <button
                  disabled={res.screening === null}
                  onClick={() => {
                    if (res.screening === "no") advanceModule();
                    else setPhase(mod.symptoms || mod.customField || mod.labFields || mod.freeText ? "detail" : "grade");
                  }}
                  className="px-4 py-1.5 text-xs font-semibold rounded-sm transition-all"
                  style={{
                    background: res.screening !== null ? "var(--primary)" : "#dce4ef",
                    color: res.screening !== null ? "#fff" : "#8fa0b4",
                    cursor: res.screening !== null ? "pointer" : "not-allowed",
                  }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Detail: symptoms + labs + custom */}
          {phase === "detail" && mod.freeText && (
            <div className="space-y-4">
              {/* Instruction + reference link */}
              <div className="rounded-sm px-3 py-2.5" style={{ background: "var(--sev-info-bg)", border: "1px solid var(--sev-info-border)" }}>
                <div className="text-xs leading-relaxed" style={{ color: "var(--sev-info-fg)" }}>
                  {mod.freeText.instruction}
                  {mod.freeText.ctcaeLink && (
                    <>
                      {" "}Refer to the{" "}
                      <a
                        href={mod.freeText.ctcaeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold"
                        style={{ color: "var(--sev-info-fg)" }}>
                        CTCAE v6 reference (PDF)
                      </a>
                      {" "}for grading criteria.
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                  Symptom · Severity · Grade
                </label>
                <textarea
                  rows={6}
                  value={res.notes}
                  placeholder={mod.freeText.placeholder ?? "Symptom, severity, and CTCAE grade..."}
                  onChange={e => updateRes({ notes: e.target.value })}
                  className="w-full px-2.5 py-2 text-sm rounded-sm border border-border bg-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <button onClick={goBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</button>
                <button
                  disabled={(res.notes ?? "").trim() === ""}
                  onClick={advanceModule}
                  className="px-4 py-1.5 text-xs font-semibold rounded-sm transition-all"
                  style={{
                    background: (res.notes ?? "").trim() !== "" ? "var(--primary)" : "#dce4ef",
                    color: (res.notes ?? "").trim() !== "" ? "#fff" : "#8fa0b4",
                    cursor: (res.notes ?? "").trim() !== "" ? "pointer" : "not-allowed",
                  }}>
                  {moduleIdx < CTCAE_MODULES.length - 1 ? "Next Module →" : "Review Summary →"}
                </button>
              </div>
            </div>
          )}
          {phase === "detail" && !mod.freeText && (
            <div className="space-y-4">
              {mod.symptoms && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Symptoms Present</div>
                  <div className="flex flex-col gap-1.5">
                    {mod.symptoms.map(sym => {
                      const checked = res.checkedSymptoms.includes(sym);
                      return (
                        <label key={sym} className="flex items-center gap-2.5 cursor-pointer">
                          <input type="checkbox" checked={checked}
                            onChange={() => {
                              const nextSymptoms = checked
                                ? res.checkedSymptoms.filter(s => s !== sym)
                                : [...res.checkedSymptoms, sym];
                              // Symptom-based auto-grade (pneumonitis, colitis):
                              // any checked symptom → Grade 2 (user can override in the grade step).
                              // We only auto-set while the grade is still auto or unset —
                              // never overwrite a user's manual pick.
                              const isSymptomOnlyModule =
                                mod.symptoms && !mod.labFields && !mod.customField;
                              const canAutoGrade =
                                isSymptomOnlyModule && (res.grade === null || res.gradeIsAuto);
                              if (canAutoGrade) {
                                const autoGrade = nextSymptoms.length > 0 ? 2 : null;
                                updateRes({
                                  checkedSymptoms: nextSymptoms,
                                  grade: autoGrade,
                                  gradeIsAuto: autoGrade !== null,
                                });
                              } else {
                                updateRes({ checkedSymptoms: nextSymptoms });
                              }
                            }}
                            className="w-3.5 h-3.5 rounded-sm" style={{ accentColor: "var(--accent)" }} />
                          <span className="text-sm text-foreground">{sym}</span>
                        </label>
                      );
                    })}
                  </div>
                  {mod.symptoms && !mod.labFields && !mod.customField && res.checkedSymptoms.length > 0 && res.grade !== null && res.gradeIsAuto && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-xs px-1.5 py-0.5 rounded-sm font-medium" style={{ background: "var(--accent-soft-bg)", color: "var(--accent)" }}>Auto-selected</span>
                      <span className="text-xs text-muted-foreground">Grade {res.grade} based on reported symptoms — adjust in next step if needed</span>
                    </div>
                  )}
                </div>
              )}

              {/* Hepatitis: per-metric lab + grade cards (value and grades shown together per marker).
                  labNote intentionally not rendered here — the per-metric column headers below
                  already display ULN / LLN / baseline where they're clinically relevant. */}
              {mod.perMetricGrades && mod.labFields ? (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Lab Values &amp; CTCAE Grade</div>
                  {mod.labFields.map(lf => {
                    const prefill = lf.sourceKey ? getLabVal(lf.sourceKey) : "";
                    const inputVal = res.labOverrides[lf.key] ?? prefill;
                    const metricGrade = (res.perMetricGrades ?? {})[lf.key] ?? null;
                    const gradeIsAuto = res.gradeIsAuto && !(lf.key in (res.labOverrides ?? {}));
                    const baselineRaw = lf.sourceKey ? (labBaselines[lf.sourceKey] ?? "") : "";
                    const baselineNum = baselineRaw ? parseFloat(baselineRaw) : NaN;
                    const hasBaseline = !isNaN(baselineNum);
                    // Paired baseline-aware layout: hepatic metrics use
                    // HEP_THRESHOLDS; nephritis creatinine has its own asymmetric
                    // rule structure (baseline < LLN vs ≥ LLN).
                    const pair = (mod.id === "nephritis" && lf.key === "creatinine")
                      ? buildNephritisGradePair(hasBaseline ? baselineNum : null, lf.uln ?? 1.0, lf.lln ?? 0.6, lf.unit)
                      : HEP_THRESHOLDS[lf.key]
                        ? buildHepGradePair(lf.key, hasBaseline ? baselineNum : null, lf.uln ?? (lf.key === "bilirubin" ? 1.0 : 40), lf.unit)
                        : null;
                    const grades = mod.perMetricGrades![lf.key] ?? [];
                    const overrideWarn = hepOverrideWarnings[lf.key] === true;
                    const normalIsActive   = pair?.activeSet === "normal";
                    const elevatedIsActive = pair?.activeSet === "elevated";
                    // Nephritis switches the column split from "baseline vs ULN"
                    // to "baseline vs LLN" and shows LLN in the header too.
                    const isNephritis = mod.id === "nephritis" && lf.key === "creatinine";
                    const normalHeader   = isNephritis ? "If baseline ≥ LLN" : "If baseline ≤ ULN";
                    const elevatedHeader = isNephritis ? "If baseline < LLN" : "If baseline > ULN";
                    const rationaleActive = pair?.activeSet === "elevated"
                      ? (isNephritis ? "below LLN" : "above ULN")
                      : (isNephritis ? "at or above LLN" : "at or below ULN");
                    const rationaleThreshold = isNephritis
                      ? `LLN ${lf.lln ?? 0.6} ${lf.unit}`
                      : `ULN ${lf.uln} ${lf.unit}`;
                    return (
                      <div key={lf.key} className="rounded border overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
                        {/* Value input header — now streamlined: label + input.
                            Baseline / ULN moved into the paired-column headers below. */}
                        <div className="flex items-center gap-3 px-3 py-2.5 border-b" style={{ background: "#f8fafc", borderColor: "rgba(15,39,68,0.08)" }}>
                          <span className="text-xs font-semibold text-foreground flex-none">{lf.label}</span>
                          <div className="flex-1" />
                          {prefill && !(lf.key in res.labOverrides) && (
                            <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{ background: "var(--accent-soft-bg)", color: "var(--accent)" }}>
                              Pre-filled from labs
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 flex-none">
                            <input
                              type="number"
                              value={inputVal}
                              placeholder={prefill || "—"}
                              onChange={e => updateLabOverride(lf.key, e.target.value)}
                              className="w-20 px-2 py-1 text-sm rounded-sm border border-border bg-white focus:outline-none focus:border-accent text-right"
                            />
                            <span className="text-xs text-muted-foreground">{lf.unit}</span>
                          </div>
                        </div>
                        {/* Per-metric grade options */}
                        <div className="px-3 py-2 space-y-1 bg-white">
                          {pair ? (
                            <>
                              {/* Two-column rule-set header — active side gets a subtle
                                  colored top-border accent; inactive side is muted grey.
                                  Baseline / ULN values live INSIDE the header. */}
                              <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: "4rem 1fr 1fr" }}>
                                <span />
                                <div className="rounded-sm px-2 py-1.5"
                                  style={{
                                    background: "#f4f6fa",
                                    border: "1px solid rgba(15,39,68,0.1)",
                                    borderTop: normalIsActive ? "2px solid var(--sev-ok-fg)" : "2px solid transparent",
                                    opacity: normalIsActive || pair.activeSet === "unknown" ? 1 : 0.55,
                                  }}>
                                  <span className="text-eyebrow" style={{ color: "var(--primary)" }}>{normalHeader}</span>
                                  <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                                    ULN: <span className="font-semibold" style={{ color: "var(--primary)" }}>{lf.uln} {lf.unit}</span>
                                    {isNephritis && lf.lln !== undefined && (
                                      <>
                                        {" · "}LLN: <span className="font-semibold" style={{ color: "var(--primary)" }}>{lf.lln} {lf.unit}</span>
                                      </>
                                    )}
                                    {hasBaseline && (
                                      <>
                                        {" · "}Baseline: <span className="font-semibold" style={{ color: "var(--primary)" }}>{baselineRaw} {lf.unit}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="rounded-sm px-2 py-1.5"
                                  style={{
                                    background: "#f4f6fa",
                                    border: "1px solid rgba(15,39,68,0.1)",
                                    borderTop: elevatedIsActive ? "2px solid var(--sev-warning-fg)" : "2px solid transparent",
                                    opacity: elevatedIsActive || pair.activeSet === "unknown" ? 1 : 0.55,
                                  }}>
                                  <span className="text-eyebrow" style={{ color: "var(--primary)" }}>{elevatedHeader}</span>
                                  <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                                    ULN: <span className="font-semibold" style={{ color: "var(--primary)" }}>{lf.uln} {lf.unit}</span>
                                    {isNephritis && lf.lln !== undefined && (
                                      <>
                                        {" · "}LLN: <span className="font-semibold" style={{ color: "var(--primary)" }}>{lf.lln} {lf.unit}</span>
                                      </>
                                    )}
                                    {hasBaseline && (
                                      <>
                                        {" · "}Baseline: <span className="font-semibold" style={{ color: "var(--primary)" }}>{baselineRaw} {lf.unit}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {pair.rows.map(row => {
                                const selected = metricGrade === row.grade;
                                const sc = selected ? gradeSelectedColor(row.grade) : null;
                                const setPmgTo = (gVal: number, fromInactiveSet: boolean) => {
                                  const newPmg = { ...(res.perMetricGrades ?? {}), [lf.key]: gVal };
                                  const vals = Object.values(newPmg).filter(v => v !== null) as number[];
                                  const overall = vals.length > 0 ? Math.max(...vals) : null;
                                  updateRes({ perMetricGrades: newPmg, grade: overall, gradeIsAuto: false });
                                  setHepOverrideWarnings(w => ({ ...w, [lf.key]: fromInactiveSet }));
                                };
                                const inactiveOpacity = 0.5;
                                // Only the SELECTED cell picks up the sc color.
                                // Non-selected cells stay neutral so the header is what
                                // communicates "active rule-set", not the cell fills.
                                const cellStyle = (isSelectedHere: boolean, columnActive: boolean) => ({
                                  borderColor: isSelectedHere ? sc!.border : "rgba(15,39,68,0.08)",
                                  background: isSelectedHere ? sc!.bg : "transparent",
                                  opacity: columnActive ? 1 : inactiveOpacity,
                                });
                                return (
                                  <div key={row.grade} className="grid gap-2 items-stretch" style={{ gridTemplateColumns: "4rem 1fr 1fr" }}>
                                    {/* Grade-number gutter — mirrors selected grade's color */}
                                    <div className="flex items-center justify-center rounded-sm text-xs font-semibold"
                                      style={{
                                        background: selected ? sc!.bg : "#fff",
                                        border: `1px solid ${selected ? sc!.border : "rgba(15,39,68,0.08)"}`,
                                        color: selected ? sc!.text : "var(--primary)",
                                      }}>
                                      Grade {row.grade}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setPmgTo(row.grade, !normalIsActive)}
                                      className="text-left px-2.5 py-2 rounded-sm border transition-all cursor-pointer"
                                      style={cellStyle(selected && normalIsActive, normalIsActive || pair.activeSet === "unknown")}>
                                      <span className="text-xs" style={{ color: selected && normalIsActive ? sc!.text : "var(--muted-foreground)" }}>
                                        {row.normalDesc}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setPmgTo(row.grade, !elevatedIsActive)}
                                      className="text-left px-2.5 py-2 rounded-sm border transition-all cursor-pointer"
                                      style={cellStyle(selected && elevatedIsActive, elevatedIsActive || pair.activeSet === "unknown")}>
                                      <span className="text-xs" style={{ color: selected && elevatedIsActive ? sc!.text : "var(--muted-foreground)" }}>
                                        {row.elevatedDesc}
                                      </span>
                                    </button>
                                  </div>
                                );
                              })}
                              {/* Auto-select hint + rationale for which rule set applies */}
                              <div className="mt-2 space-y-1">
                                {metricGrade !== null && gradeIsAuto && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs px-1.5 py-0.5 rounded-sm font-medium" style={{ background: "var(--accent-soft-bg)", color: "var(--accent)" }}>
                                      Auto-selected based on value
                                    </span>
                                    <span className="text-xs text-muted-foreground">· Click another grade to override</span>
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  {pair.activeSet === "unknown"
                                    ? `No baseline on file — defaulting to ${isNephritis ? "ULN-anchored thresholds" : "ULN-anchored thresholds"}.`
                                    : `Rule set chosen because baseline ${baselineRaw} ${lf.unit} is ${rationaleActive} ${rationaleThreshold}.`}
                                </div>
                              </div>
                              {overrideWarn && (
                                <div className="mt-1 flex items-start gap-1.5 rounded-sm px-2 py-1.5" style={{ background: "var(--sev-warning-bg)", border: "1px solid var(--sev-warning-border)" }}>
                                  <AlertTriangle size={12} style={{ color: "var(--sev-warning-fg)", marginTop: 2 }} className="flex-none" />
                                  <span className="text-xs" style={{ color: "var(--sev-warning-fg)" }}>
                                    Manual override: you picked from the {isNephritis
                                      ? (pair.activeSet === "elevated" ? "baseline-at-or-above-LLN" : "baseline-below-LLN")
                                      : (pair.activeSet === "elevated" ? "baseline-normal" : "baseline-elevated")
                                    } rule set, which doesn't match this patient's baseline. Confirm this is intentional.
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            grades.map(g => {
                              const selected = metricGrade === g.grade;
                              const sc = selected ? gradeSelectedColor(g.grade) : null;
                              return (
                                <button key={g.grade}
                                  onClick={() => {
                                    const newPmg = { ...(res.perMetricGrades ?? {}), [lf.key]: g.grade };
                                    const vals = Object.values(newPmg).filter(v => v !== null) as number[];
                                    const overall = vals.length > 0 ? Math.max(...vals) : null;
                                    updateRes({ perMetricGrades: newPmg, grade: overall, gradeIsAuto: false });
                                  }}
                                  className="w-full text-left px-2.5 py-2 rounded-sm border transition-all"
                                  style={{
                                    borderColor: selected ? sc!.border : "rgba(15,39,68,0.08)",
                                    background: selected ? sc!.bg : "transparent",
                                  }}>
                                  <span className="text-xs font-semibold" style={{ color: selected ? sc!.text : "var(--primary)" }}>Grade {g.grade}: </span>
                                  <span className="text-xs" style={{ color: selected ? sc!.text : "var(--muted-foreground)" }}>{g.description}</span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* Overall computed grade (hepatitis has 3 markers, so the
                      "highest of" note applies; nephritis has one metric so we
                      skip the summary — the per-metric card already shows it). */}
                  {res.grade !== null && mod.id === "hepatitis" && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-sm border" style={{ background: gradeSelectedColor(res.grade).bg, borderColor: gradeSelectedColor(res.grade).border }}>
                      <span className="text-xs font-semibold" style={{ color: gradeSelectedColor(res.grade).text }}>
                        Overall Hepatitis Grade: {res.grade}
                      </span>
                      <span className="text-xs text-muted-foreground">(highest of AST, ALT, Bilirubin)</span>
                    </div>
                  )}
                </div>
              ) : null}

              {mod.customField && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                    {mod.customField.label} ({mod.customField.unit})
                  </label>
                  <input type="number" value={res.customValue} placeholder={mod.customField.placeholder}
                    onChange={e => updateCustomValue(e.target.value)}
                    className="w-48 px-2.5 py-1.5 text-sm rounded-sm border border-border bg-white focus:outline-none focus:border-accent" />
                  {mod.id === "diarrhea" && res.customValue && res.grade !== null && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-xs px-1.5 py-0.5 rounded-sm font-medium" style={{ background: "var(--accent-soft-bg)", color: "var(--accent)" }}>Auto-selected</span>
                      <span className="text-xs text-muted-foreground">Grade {res.grade} based on {res.customValue} stools above baseline</span>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted-foreground)" }}>Clinical Notes</label>
                <textarea rows={2} value={res.notes} placeholder="Additional observations..."
                  onChange={e => updateRes({ notes: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-sm rounded-sm border border-border bg-white focus:outline-none focus:border-accent resize-none" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <button onClick={goBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</button>
                {mod.perMetricGrades
                  /* Hep-style modules (hepatitis, nephritis): advance directly
                     from detail (grades live inline; no separate grade phase) */
                  ? (
                    <button
                      disabled={!allMetricsGraded}
                      onClick={advanceModule}
                      className="px-4 py-1.5 text-xs font-semibold rounded-sm transition-all"
                      style={{
                        background: allMetricsGraded ? "var(--primary)" : "#dce4ef",
                        color: allMetricsGraded ? "#fff" : "#8fa0b4",
                        cursor: allMetricsGraded ? "pointer" : "not-allowed",
                      }}>
                      {moduleIdx < CTCAE_MODULES.length - 1 ? "Next Module →" : "Review Summary →"}
                    </button>
                  ) : (
                    <button onClick={() => setPhase("grade")}
                      className="px-4 py-1.5 text-xs font-semibold rounded-sm"
                      style={{ background: "var(--primary)", color: "#fff" }}>
                      Select CTCAE Grade →
                    </button>
                  )
                }
              </div>
            </div>
          )}

          {/* Grade selection (pneumonitis, colitis, skin, diarrhea) */}
          {phase === "grade" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>CTCAE Grade Selection</span>
                {res.gradeIsAuto && res.grade !== null && (
                  <span className="text-xs px-1.5 py-0.5 rounded-sm font-medium" style={{ background: "var(--accent-soft-bg)", color: "var(--accent)" }}>
                    Grade {res.grade} auto-selected · Click to override
                  </span>
                )}
              </div>

              {/* Rule of Nines — skin only */}
              {mod.id === "skin" && (
                <div className="mb-3 rounded border overflow-hidden" style={{ borderColor: "rgba(15,39,68,0.1)" }}>
                  <button
                    onClick={() => setBsaOpen(o => !o)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
                    style={{ background: bsaOpen ? "var(--sev-ok-bg)" : "#f8fafc" }}>
                    {/* Calculator icon */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="var(--sev-ok-fg)" strokeWidth="1.2"/>
                      <rect x="4" y="3" width="8" height="3" rx="0.5" fill="var(--sev-ok-fg)" opacity="0.15" stroke="var(--sev-ok-fg)" strokeWidth="0.8"/>
                      <circle cx="5" cy="9" r="0.8" fill="var(--sev-ok-fg)"/>
                      <circle cx="8" cy="9" r="0.8" fill="var(--sev-ok-fg)"/>
                      <circle cx="11" cy="9" r="0.8" fill="var(--sev-ok-fg)"/>
                      <circle cx="5" cy="12" r="0.8" fill="var(--sev-ok-fg)"/>
                      <circle cx="8" cy="12" r="0.8" fill="var(--sev-ok-fg)"/>
                      <rect x="10" y="11" width="2.2" height="0.9" rx="0.4" fill="var(--sev-ok-fg)"/>
                      <rect x="10.65" y="11.05" width="0.9" height="2.2" rx="0.4" fill="var(--sev-ok-fg)"/>
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: "var(--sev-ok-fg)" }}>Rule of Nines</span>
                    <span className="text-xs text-muted-foreground">— BSA calculator (optional)</span>
                    {bsaTotal > 0 && (
                      <span className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-sm"
                        style={{ background: bsaTotal > 50 ? "var(--sev-critical-bg)" : "var(--sev-ok-bg)", color: bsaTotal > 50 ? "var(--grade-3-fg)" : "var(--sev-ok-fg)" }}>
                        {bsaTotal.toFixed(1)}% TBSA
                      </span>
                    )}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto transition-transform"
                      style={{ transform: bsaOpen ? "rotate(180deg)" : "rotate(0deg)", marginLeft: bsaTotal > 0 ? "0" : "auto" }}>
                      <path d="M2 4l4 4 4-4" stroke="var(--muted-foreground)" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {bsaOpen && (
                    <div className="border-t" style={{ borderColor: "rgba(15,39,68,0.08)", background: "#fff" }}>
                      {/* Header explanation */}
                      <div className="px-3 py-3 border-b" style={{ borderColor: "rgba(15,39,68,0.06)", background: "#f8fafc" }}>
                        <div className="text-xs font-semibold text-foreground mb-0.5">Rule of Nines — Total Body Surface Area</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          A tool to estimate the percentage of TBSA affected by skin conditions.{" "}
                          <span className="font-medium" style={{ color: "var(--primary)" }}>TBSA = Σ(BSA of individual affected body parts)</span>
                        </div>
                      </div>

                      {/* Body diagrams */}
                      <div className="px-3 py-3 flex justify-center gap-6 border-b" style={{ borderColor: "rgba(15,39,68,0.06)", background: "var(--sev-ok-bg)" }}>
                        {/* Front view */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>Front</span>
                          <svg width="90" height="200" viewBox="0 0 90 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Head */}
                            <ellipse cx="45" cy="14" rx="11" ry="13" fill="#0d9488" opacity="0.85"/>
                            <text x="45" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">4.5%</text>
                            {/* Neck */}
                            <rect x="40" y="26" width="10" height="7" rx="1" fill="#0d9488" opacity="0.6"/>
                            {/* Upper torso */}
                            <rect x="26" y="33" width="38" height="30" rx="2" fill="#0d9488" opacity="0.75"/>
                            <text x="45" y="52" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">9%</text>
                            {/* Dashed waist line */}
                            <line x1="26" y1="63" x2="64" y2="63" stroke="white" strokeWidth="1" strokeDasharray="3,2"/>
                            {/* Lower torso */}
                            <rect x="28" y="63" width="34" height="24" rx="2" fill="#0d9488" opacity="0.75"/>
                            <text x="45" y="78" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">9%</text>
                            {/* Genitals */}
                            <rect x="38" y="87" width="14" height="8" rx="2" fill="#0d9488" opacity="0.6"/>
                            <text x="45" y="94" textAnchor="middle" fill="white" fontSize="5.5" fontWeight="600">1%</text>
                            {/* Left arm (viewer right) */}
                            <rect x="9" y="33" width="15" height="52" rx="5" fill="#0d9488" opacity="0.7"/>
                            <text x="16.5" y="57" textAnchor="middle" fill="white" fontSize="6" fontWeight="600" transform="rotate(-90,16.5,57)">4.5%</text>
                            {/* Right arm (viewer left) */}
                            <rect x="66" y="33" width="15" height="52" rx="5" fill="#0d9488" opacity="0.7"/>
                            <text x="73.5" y="60" textAnchor="middle" fill="white" fontSize="6" fontWeight="600" transform="rotate(90,73.5,60)">4.5%</text>
                            {/* Left leg */}
                            <rect x="26" y="96" width="16" height="96" rx="5" fill="#0d9488" opacity="0.75"/>
                            <text x="34" y="148" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">9%</text>
                            {/* Right leg */}
                            <rect x="48" y="96" width="16" height="96" rx="5" fill="#0d9488" opacity="0.75"/>
                            <text x="56" y="148" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">9%</text>
                          </svg>
                        </div>
                        {/* Back view */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>Back</span>
                          <svg width="90" height="200" viewBox="0 0 90 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Head */}
                            <ellipse cx="45" cy="14" rx="11" ry="13" fill="#0d9488" opacity="0.85"/>
                            <text x="45" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">4.5%</text>
                            {/* Neck */}
                            <rect x="40" y="26" width="10" height="7" rx="1" fill="#0d9488" opacity="0.6"/>
                            {/* Upper back */}
                            <rect x="26" y="33" width="38" height="30" rx="2" fill="#0d9488" opacity="0.75"/>
                            <text x="45" y="52" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">9%</text>
                            {/* Dashed waist line */}
                            <line x1="26" y1="63" x2="64" y2="63" stroke="white" strokeWidth="1" strokeDasharray="3,2"/>
                            {/* Lower back */}
                            <rect x="28" y="63" width="34" height="28" rx="2" fill="#0d9488" opacity="0.75"/>
                            <text x="45" y="80" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">9%</text>
                            {/* Left arm */}
                            <rect x="9" y="33" width="15" height="52" rx="5" fill="#0d9488" opacity="0.7"/>
                            <text x="16.5" y="57" textAnchor="middle" fill="white" fontSize="6" fontWeight="600" transform="rotate(-90,16.5,57)">4.5%</text>
                            {/* Right arm */}
                            <rect x="66" y="33" width="15" height="52" rx="5" fill="#0d9488" opacity="0.7"/>
                            <text x="73.5" y="60" textAnchor="middle" fill="white" fontSize="6" fontWeight="600" transform="rotate(90,73.5,60)">4.5%</text>
                            {/* Left leg */}
                            <rect x="26" y="92" width="16" height="100" rx="5" fill="#0d9488" opacity="0.75"/>
                            <text x="34" y="146" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">9%</text>
                            {/* Right leg */}
                            <rect x="48" y="92" width="16" height="100" rx="5" fill="#0d9488" opacity="0.75"/>
                            <text x="56" y="146" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">9%</text>
                            {/* Glute curve hint */}
                            <path d="M30 92 Q45 100 62 92" stroke="white" strokeWidth="1" fill="none" opacity="0.5"/>
                          </svg>
                        </div>
                      </div>

                      {/* Region selectors */}
                      <div className="px-3 py-2 space-y-0">
                        {BSA_REGIONS.map((region, idx) => {
                          const sel = bsaSelections[region.key] ?? null;
                          return (
                            <div key={region.key}
                              className="flex items-center gap-3 py-2"
                              style={{ borderBottom: idx < BSA_REGIONS.length - 1 ? "1px solid rgba(15,39,68,0.06)" : "none" }}>
                              <span className="text-xs text-foreground w-28 flex-none">{region.label}</span>
                              <div className="flex gap-1.5 flex-1">
                                {region.options.map(opt => {
                                  const isSelected = sel === opt;
                                  return (
                                    <button key={opt}
                                      onClick={() => setBsaRegion(region.key, opt)}
                                      className="flex-1 py-1.5 text-xs font-semibold rounded-sm border transition-all"
                                      style={{
                                        background: isSelected ? "#0d9488" : "#fff",
                                        borderColor: isSelected ? "#0d9488" : "rgba(15,39,68,0.15)",
                                        color: isSelected ? "#fff" : "#374151",
                                      }}>
                                      {opt}%
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total + result */}
                      <div className="px-3 py-3 border-t flex items-center gap-3" style={{ borderColor: "rgba(15,39,68,0.08)", background: "#f8fafc" }}>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold" style={{ color: bsaTotal > 50 ? "var(--grade-3-fg)" : "#0d9488" }}>
                              {bsaTotal.toFixed(1)}%
                            </span>
                            <span className="text-xs text-muted-foreground">TBSA affected</span>
                          </div>
                          {bsaTotal > 50 && (
                            <div className="text-xs font-semibold mt-0.5" style={{ color: "var(--grade-3-fg)" }}>
                              ⚠ &gt;50% TBSA — Grade 3 auto-selected below
                            </div>
                          )}
                          {bsaTotal > 0 && bsaTotal <= 50 && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Below 50% threshold — select grade manually
                            </div>
                          )}
                        </div>
                        {/* Mini progress bar */}
                        <div className="flex-1 max-w-24">
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(15,39,68,0.08)" }}>
                            <div className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(bsaTotal, 100)}%`,
                                background: bsaTotal > 50 ? "var(--grade-3-fg)" : "#0d9488",
                              }} />
                          </div>
                          <div className="flex justify-between mt-0.5">
                            <span className="text-xs text-muted-foreground">0%</span>
                            <span className="text-xs font-medium" style={{ color: "var(--grade-3-fg)" }}>50%</span>
                            <span className="text-xs text-muted-foreground">100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {(mod.id === "nephritis" ? mod.grades : [{ grade: 0, description: "No adverse event" }, ...mod.grades]).map(g => {
                const selected = res.grade === g.grade;
                const sc = selected ? gradeSelectedColor(g.grade) : null;
                const isAutoSelected = selected && res.gradeIsAuto;
                return (
                  <button key={g.grade}
                    onClick={() => updateRes({ grade: g.grade, gradeIsAuto: false })}
                    className="w-full text-left px-3 py-2.5 rounded-sm border transition-all"
                    style={{
                      borderColor: selected ? sc!.border : "rgba(15,39,68,0.1)",
                      background: selected ? sc!.bg : "#fff",
                    }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm leading-snug">
                        <span className="font-semibold" style={{ color: selected ? sc!.text : "var(--primary)" }}>Grade {g.grade}:</span>{" "}
                        <span style={{ color: selected ? sc!.text : "#374151" }}>{g.description}</span>
                      </div>
                      {isAutoSelected && (
                        <span className="text-xs px-1.5 py-0.5 rounded-sm font-medium flex-none" style={{ background: "var(--sev-info-bg)", color: "var(--sev-info-fg)" }}>Auto</span>
                      )}
                    </div>
                  </button>
                );
              })}
              <div className="flex items-center justify-between pt-2">
                <button onClick={goBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</button>
                <button
                  disabled={res.grade === null}
                  onClick={advanceModule}
                  className="px-4 py-1.5 text-xs font-semibold rounded-sm transition-all"
                  style={{
                    background: res.grade !== null ? "var(--primary)" : "#dce4ef",
                    color: res.grade !== null ? "#fff" : "#8fa0b4",
                    cursor: res.grade !== null ? "pointer" : "not-allowed",
                  }}>
                  {moduleIdx < CTCAE_MODULES.length - 1 ? "Next Module →" : "Review Summary →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Shared severity map — single source of truth for CDS flag colors.
// Values are hex mirrors of the --sev-* tokens in theme.css. Keep in sync.
const SEV = {
  green:  { Icon: CheckCircle2,  fg:"var(--sev-ok-fg)", rowBg:"#fff",     className:"sev-ok" },
  yellow: { Icon: AlertTriangle, fg:"var(--sev-warning-fg)", rowBg:"#fffcf0",  className:"sev-warning" },
  red:    { Icon: AlertCircle,   fg:"var(--sev-critical-fg)", rowBg:"#fff5f5",  className:"sev-critical" },
} as const;

const BASELINE_GRID = "1rem 1.8fr 1.2fr 1.4fr 2fr";

function BaselinePanel({ metrics }: { metrics: BaselineMetric[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    vitals: true, labs: true, observational: true,
  });
  const panelId = "baseline-panel-body";

  const redCount    = metrics.filter(m => m.flag === "red").length;
  const yellowCount = metrics.filter(m => m.flag === "yellow").length;

  // Categorize metrics into vitals / labs / observational by label.
  function categorize(m: BaselineMetric): "vitals" | "labs" | "observational" {
    const l = m.label.toLowerCase();
    if (l.startsWith("spo") || l.includes("blood pressure") || l.includes("heart rate") ||
        l.includes("weight") || l.includes("temperature")) return "vitals";
    if (l.includes("tsh") || l.includes("ast") || l.includes("alt") ||
        l.includes("bilirubin") || l.includes("creatinine")) return "labs";
    return "observational";
  }
  const groups: Array<{ key: "vitals"|"labs"|"observational"; title: string; items: BaselineMetric[] }> = [
    { key:"vitals",        title:"Vitals",        items: metrics.filter(m => categorize(m) === "vitals") },
    { key:"labs",          title:"Labs",          items: metrics.filter(m => categorize(m) === "labs") },
    { key:"observational", title:"Assessments", items: metrics.filter(m => categorize(m) === "observational") },
  ];

  function groupFlagCounts(items: BaselineMetric[]) {
    return {
      red: items.filter(m => m.flag === "red").length,
      yellow: items.filter(m => m.flag === "yellow").length,
    };
  }

  function renderRow(m: BaselineMetric, i: number, hasAnyAlert: boolean) {
    const sev = SEV[m.flag];
    const isAlert = m.flag !== "green";
    // Drop zebra when the group has a red/yellow row — the tinted-white
    // reads as a faint yellow flag next to real alerts.
    const rowBg = isAlert ? sev.rowBg : hasAnyAlert ? "#fff" : (i % 2 === 0 ? "#fff" : "#fafbfc");
    const leftBorder = isAlert ? `3px solid ${sev.fg}` : "3px solid transparent";
    return (
      <div key={i}
        className="grid items-center gap-x-6 px-1 py-2.5"
        style={{
          gridTemplateColumns: BASELINE_GRID,
          background: rowBg,
          borderLeft: leftBorder,
          borderTop: i > 0 ? "1px solid rgba(15,39,68,0.06)" : "none",
        }}>
        <div className="flex items-center justify-center">
          <sev.Icon size={13} style={{ color: sev.fg }} />
        </div>
        <div className="text-sm font-medium" style={{ color: isAlert ? sev.fg : "#374151" }}>{m.label}</div>
        <div className="text-sm text-muted-foreground">{m.baseline}</div>
        <div className="text-sm" style={{ color: isAlert ? sev.fg : "#374151", fontWeight: isAlert ? 600 : 400 }}>{m.current}</div>
        <div className="text-xs leading-relaxed" style={{ color: isAlert ? sev.fg : "#8fa0b4", fontWeight: isAlert ? 500 : 400 }}>{m.note}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded border overflow-hidden card-shadow" style={{ borderColor:"rgba(15,39,68,0.1)" }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(v => !v)}
        aria-expanded={!collapsed}
        aria-controls={panelId}
        className="w-full flex items-center gap-3 px-5 py-4 text-left bg-white">
        <GitBranch size={13} className="text-muted-foreground flex-none" />
        <span className="text-sm font-semibold" style={{ color:"var(--primary)" }}>Baseline Comparison</span>
        <span className="sev-chip sev-info flex-none" style={{ fontFamily:"'DM Mono',monospace" }}>
          <Zap size={11}/>CDS · Auto-populated
        </span>
        <div className="flex items-center gap-1.5 flex-none">
          {redCount > 0 && (
            <span className="sev-chip sev-critical" role="status" aria-label={`${redCount} critical alert${redCount > 1 ? "s" : ""}`}>
              <AlertCircle size={11}/>{redCount} alert{redCount > 1 ? "s" : ""}
            </span>
          )}
          {yellowCount > 0 && (
            <span className="sev-chip sev-warning" role="status" aria-label={`${yellowCount} warning${yellowCount > 1 ? "s" : ""}`}>
              <AlertTriangle size={11}/>{yellowCount} flag{yellowCount > 1 ? "s" : ""}
            </span>
          )}
          {redCount === 0 && yellowCount === 0 && (
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color:"var(--sev-ok-fg)" }}>
              <CheckCircle2 size={11}/>All normal
            </span>
          )}
        </div>
        <div className="flex-1" />
        <ChevronRight size={14} className="text-muted-foreground flex-none" style={{ transform: collapsed ? "rotate(0deg)" : "rotate(90deg)", transition:"transform 0.15s" }} />
      </button>

      {!collapsed && (
        <div id={panelId} className="border-t px-5 py-4 space-y-3" style={{ borderColor:"rgba(15,39,68,0.08)" }}>
          {groups.map(group => {
            if (group.items.length === 0) return null;
            const open = openGroups[group.key];
            const { red, yellow } = groupFlagCounts(group.items);
            const hasAnyAlert = red > 0 || yellow > 0;
            const groupId = `baseline-group-${group.key}`;
            return (
              <div key={group.key} className="rounded overflow-hidden" style={{ border:"1px solid rgba(15,39,68,0.1)" }}>
                <button
                  type="button"
                  onClick={() => setOpenGroups(g => ({ ...g, [group.key]: !g[group.key] }))}
                  aria-expanded={open}
                  aria-controls={groupId}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left"
                  style={{ background:"#f6f8fb" }}>
                  <ChevronRight size={12} className="text-muted-foreground flex-none" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition:"transform 0.15s" }} />
                  <span className="text-eyebrow" style={{ color:"var(--primary)" }}>{group.title}</span>
                  <span className="text-xs" style={{ color:"#8fa0b4" }}>· {group.items.length} metric{group.items.length === 1 ? "" : "s"}</span>
                  <div className="flex-1" />
                  {red > 0 && (
                    <span className="sev-chip sev-critical" style={{ padding:"0.125rem 0.375rem" }}>
                      <AlertCircle size={10}/>{red}
                    </span>
                  )}
                  {yellow > 0 && (
                    <span className="sev-chip sev-warning" style={{ padding:"0.125rem 0.375rem" }}>
                      <AlertTriangle size={10}/>{yellow}
                    </span>
                  )}
                  {red === 0 && yellow === 0 && (
                    <span className="flex items-center gap-1 text-xs font-medium" style={{ color:"var(--sev-ok-fg)" }}>
                      <CheckCircle2 size={10}/>Normal
                    </span>
                  )}
                </button>
                {open && (
                  <div id={groupId}>
                    {/* Column headers */}
                    <div className="grid px-1 pt-2 pb-1 gap-x-6 border-t" style={{ gridTemplateColumns: BASELINE_GRID, borderColor:"rgba(15,39,68,0.08)" }}>
                      {["","Metric","Baseline","Current","CDS Note"].map(h => (
                        <span key={h} className="text-eyebrow">{h}</span>
                      ))}
                    </div>
                    {group.items.map((m, i) => renderRow(m, i, hasAnyAlert))}
                  </div>
                )}
              </div>
            );
          })}

          <p className="text-xs italic mt-3" style={{ color:"#b0bcc8" }}>
            Auto-populated from patient baseline flowsheet. Syncs from structured documentation and triggers real-time CDS alerts in production.
          </p>
        </div>
      )}
    </div>
  );
}

function EncounterDetail({ visit, onBack, savedNote, onSave, patientMeds, baselineMetrics, patientId }: {
  visit: VisitRecord;
  onBack: () => void;
  savedNote: WorkflowStep[] | null;
  onSave: (steps: WorkflowStep[]) => void;
  patientMeds: string[];
  baselineMetrics: BaselineMetric[];
  patientId: string;
}) {
  const [steps, setSteps] = useState<WorkflowStep[]>(() => {
    if (savedNote) return savedNote;
    return buildRequiredSteps(visit.category).map(s => {
      if (s.id === "infusion" && patientMeds.length > 0)
                               return { ...s, fieldValues: { ...s.fieldValues, agent: patientMeds[0] } };
      return s;
    });
  });
  const [expandedId, setExpandedId] = useState<string|null>(steps[0]?.instanceId ?? null);
  const [saved, setSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  // Completed visits with a saved note default to read-only view.
  // No `setReadOnly` today — this stays true for the lifetime of the view;
  // if we later add an "edit signed note" flow, the setter is here.
  const [readOnly] = useState(savedNote !== null && visit.status === "completed");

  function isComplete(step: WorkflowStep) {
    if (step.id === "symptom") return (step.fieldValues["assessment_complete"] ?? "") === "true";
    return step.fields.every(f => (step.fieldValues[f.key] ?? "").trim() !== "");
  }
  function isAccessible(index: number) {
    return steps.slice(0, index).every(s => isComplete(s));
  }
  function updateField(instanceId: string, key: string, val: string) {
    setSteps(prev => prev.map(s =>
      s.instanceId === instanceId ? { ...s, fieldValues: { ...s.fieldValues, [key]: val } } : s
    ));
  }
  function toggleSection(instanceId: string, index: number) {
    if (!isAccessible(index)) return;
    setExpandedId(prev => prev === instanceId ? null : instanceId);
  }
  function completeAndAdvance(_instanceId: string, index: number) {
    setExpandedId(index < steps.length - 1 ? steps[index + 1].instanceId : null);
  }
  function addOptionalStep(t: StepTemplate) {
    const instanceId = uid();
    setSteps(prev => [...prev, { ...t, instanceId, fieldValues: Object.fromEntries(t.fields.map(f => [f.key, f.value])) }]);
    setShowMenu(false);
  }
  const completedCount = steps.filter(s => isComplete(s)).length;
  const symptomComplete = steps.find(s => s.id === "symptom")?.fieldValues["assessment_complete"] === "true";
  const canSave = symptomComplete;

  // ── Read-only view for saved completed visits ──
  if (readOnly) {
    return (
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-white flex-none">
          <button onClick={onBack} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex-none">
            ← All Visits
          </button>
          <div className="w-px h-4 bg-border flex-none" />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-foreground">{visit.type}</span>
            <span className="text-xs text-muted-foreground ml-2">{visit.cycle} · {visit.date} · {visit.provider}</span>
          </div>
          <span
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-sm flex-none"
            style={{ background:"var(--primary)", color:"#fff" }}
            aria-label={`Signed by ${visit.provider} on ${visit.date}`}>
            <Lock size={11}/> Signed · {visit.provider} · {visit.date}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="px-6 py-5 space-y-3">
            {baselineMetrics.length > 0 && <BaselinePanel metrics={baselineMetrics} />}
            {steps.map(step => {
              const Icon = step.icon;
              const filledFields = step.fields.filter(f => (step.fieldValues[f.key] ?? "").trim() !== "");
              return (
                <div key={step.instanceId} className="bg-white rounded border overflow-hidden" style={{ borderColor:"var(--sev-ok-border)", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center gap-4 px-5 py-3.5" style={{ background:"var(--sev-ok-bg)" }}>
                    <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-none" style={{ background:step.bg, border:`1px solid ${step.color}25` }}>
                      <Icon size={13} style={{ color:step.color }} />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{step.label}</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-sm" style={{ background:"var(--sev-ok-bg)", color:"var(--sev-ok-fg)" }}>Complete</span>
                    </div>
                  </div>
                  {step.id === "symptom" ? (
                    <div className="px-5 py-4">
                      <SymptomAssessmentWizard
                        labValues={{}}
                        readOnly
                        baselineMetrics={baselineMetrics}
                        savedResults={(() => {
                          const raw = step.fieldValues["wizard_results"];
                          if (!raw) return undefined;
                          try { return JSON.parse(raw) as ModuleResult[]; } catch { return undefined; }
                        })()}
                        savedEscalation={(() => {
                          const raw = step.fieldValues["escalation_data"];
                          if (!raw) return undefined;
                          try { return JSON.parse(raw) as EscalationState; } catch { return undefined; }
                        })()}
                        onResultsChange={() => {}}
                        onEscalationChange={() => {}}
                        onComplete={() => {}}
                      />
                    </div>
                  ) : filledFields.length > 0 ? (
                    <div className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-3">
                      {filledFields.map(f => (
                        <div key={f.key} className={f.type === "textarea" ? "col-span-2" : ""}>
                          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--muted-foreground)" }}>{f.label}</div>
                          <div className="text-sm text-foreground">{step.fieldValues[f.key]}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Editable accordion view ──
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-white flex-none">
        <button onClick={onBack} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex-none">
          ← All Visits
        </button>
        <div className="w-px h-4 bg-border flex-none" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-foreground">{visit.type}</span>
          <span className="text-xs text-muted-foreground ml-2">{visit.cycle} · {visit.date} · {visit.provider}</span>
        </div>
        {/* Progress dots */}
        <div className="flex items-center gap-2 flex-none">
          <div className="flex gap-1">
            {steps.map((s, i) => (
              <div key={s.instanceId} className="w-2 h-2 rounded-full transition-colors"
                style={{ background: isComplete(s) ? "var(--sev-ok-fg)" : isAccessible(i) ? "var(--accent)" : "rgba(15,39,68,0.15)" }} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{completedCount}/{steps.length}</span>
        </div>
        {/* Add optional section */}
        <div className="relative flex-none">
          <button onClick={() => setShowMenu(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all"
            style={{ background:"#fff", borderColor:"rgba(15,39,68,0.15)", color:"var(--primary)" }}>
            + Add Section
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded shadow-lg z-50 py-1 w-52">
              {STEP_TEMPLATES.map(t => {
                const Icon = t.icon;
                const added = steps.some(s => s.id === t.id);
                return (
                  <button key={t.id} onClick={() => !added && addOptionalStep(t)} disabled={added}
                    className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs transition-colors"
                    style={{ color: added ? "#a0aab8" : "var(--primary)", cursor: added ? "default" : "pointer" }}
                    onMouseEnter={e => { if (!added) e.currentTarget.style.background = "#f8fafc"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    <div className="w-5 h-5 rounded-sm flex items-center justify-center flex-none" style={{ background: t.bg }}>
                      <Icon size={11} style={{ color: t.color }} />
                    </div>
                    <span className="font-medium flex-1">{t.label}</span>
                    {added && <span style={{ color:"#a0aab8" }}>Added</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <button
          onClick={() => { onSave(steps); setSaved(true); setTimeout(() => setSaved(false), 2500); }}
          disabled={!canSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition-all flex-none"
          style={{ background: saved ? "var(--sev-ok-fg)" : canSave ? "var(--primary)" : "#dce4ef", color: canSave ? "#fff" : "#8fa0b4", cursor: canSave ? "pointer" : "not-allowed" }}>
          <Save size={11} />{saved ? "Saved ✓" : "Save Note"}
        </button>
      </div>

      {/* Accordion sections */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="px-6 py-5 space-y-3">
          {baselineMetrics.length > 0 && <BaselinePanel metrics={baselineMetrics} />}
          {/* Workflow-gating banner — shown while any step is still locked. */}
          {(() => {
            const firstLockedIdx = steps.findIndex((_, i) => !isAccessible(i));
            if (firstLockedIdx <= 0) return null;
            const gatingStep = steps[firstLockedIdx - 1];
            return (
              <div
                role="status"
                className="flex items-center gap-3 rounded border px-4 py-2.5 text-xs"
                style={{ background:"var(--sev-info-bg)", borderColor:"var(--sev-info-border)", color:"var(--sev-info-fg)" }}>
                <Lock size={13} className="flex-none" />
                <span>
                  <span className="font-semibold">Workflow order:</span>{" "}
                  Finish <span className="font-semibold">{gatingStep.label}</span> to unlock the sections below.
                </span>
              </div>
            );
          })()}
          {steps.map((step, index) => {
            const Icon = step.icon;
            const complete = isComplete(step);
            const accessible = isAccessible(index);
            const locked = !accessible;
            const expanded = expandedId === step.instanceId && accessible;
            const isSymptom = step.id === "symptom";
            const isInfusion = step.id === "infusion";
            const sectionId = `step-body-${step.instanceId}`;
            const stepNum = String(index + 1).padStart(2, "0");

            return (
              <div key={step.instanceId}
                className="bg-white rounded border overflow-hidden transition-all"
                style={{
                  borderColor: complete ? "var(--sev-ok-border)" : expanded ? step.color + "40" : "rgba(15,39,68,0.1)",
                  boxShadow: expanded ? `0 0 0 1px ${step.color}20, 0 2px 8px rgba(0,0,0,0.06)` : "0 1px 3px rgba(0,0,0,0.04)",
                  opacity: locked ? 0.72 : 1,
                }}>
                {/* Section header */}
                <button
                  onClick={() => toggleSection(step.instanceId, index)}
                  disabled={locked}
                  aria-expanded={expanded}
                  aria-controls={sectionId}
                  aria-disabled={locked}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                  style={{ cursor: locked ? "not-allowed" : "pointer", background: complete ? "var(--sev-ok-bg)" : "#fff" }}>
                  <div className="flex items-center gap-3 flex-none">
                    <span
                      aria-hidden="true"
                      className="text-eyebrow flex-none"
                      style={{ minWidth: "1.75rem", color: locked ? "#c0cada" : complete ? "var(--sev-ok-fg)" : "#a0aab8" }}>
                      {stepNum}
                    </span>
                    <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-none"
                      style={{ background: complete ? "var(--sev-ok-bg)" : locked ? "#f0f2f5" : step.bg, border: `1px solid ${complete ? "var(--sev-ok-border)" : locked ? "transparent" : step.color + "25"}` }}>
                      {complete
                        ? <CheckCircle2 size={15} style={{ color:"var(--sev-ok-fg)" }} />
                        : locked
                          ? <Lock size={13} style={{ color:"#a0aab8" }} />
                          : <Icon size={13} style={{ color: step.color }} />
                      }
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: locked ? "#a0aab8" : "var(--primary)" }}>{step.label}</span>
                      {locked && <span className="text-xs" style={{ color:"#8fa0b4" }}>Locked</span>}
                      {complete && <span className="sev-chip sev-ok">Complete</span>}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: locked ? "#c0cada" : "var(--muted-foreground)" }}>{step.description}</p>
                  </div>
                  {!locked && (
                    <div className="flex-none" style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition:"transform 0.15s" }}>
                      <ChevronRight size={15} className="text-muted-foreground" />
                    </div>
                  )}
                </button>

                {/* Expanded content */}
                {expanded && (
                  <div id={sectionId} className="border-t px-6 py-5" style={{ borderColor:"rgba(15,39,68,0.08)" }}>
                    {isSymptom ? (
                      <SymptomAssessmentWizard
                        labValues={buildLabPrefill(patientId)}
                        labBaselines={buildLabBaselines(patientId)}
                        baselineMetrics={baselineMetrics}
                        savedResults={(() => {
                          const raw = step.fieldValues["wizard_results"];
                          if (!raw) return undefined;
                          try { return JSON.parse(raw) as ModuleResult[]; } catch { return undefined; }
                        })()}
                        savedEscalation={(() => {
                          const raw = step.fieldValues["escalation_data"];
                          if (!raw) return undefined;
                          try { return JSON.parse(raw) as EscalationState; } catch { return undefined; }
                        })()}
                        onResultsChange={rs => updateField(step.instanceId, "wizard_results", JSON.stringify(rs))}
                        onEscalationChange={esc => updateField(step.instanceId, "escalation_data", JSON.stringify(esc))}
                        onComplete={() => {
                          const updatedSteps = steps.map(s =>
                            s.instanceId === step.instanceId
                              ? { ...s, fieldValues: { ...s.fieldValues, assessment_complete: "true" } }
                              : s
                          );
                          updateField(step.instanceId, "assessment_complete", "true");
                          onSave(updatedSteps);
                          setSaved(true);
                          setTimeout(() => setSaved(false), 2500);
                          completeAndAdvance(step.instanceId, index);
                        }}
                      />
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                          {step.fields.map(field => {
                            const isTextarea = field.type === "textarea";
                            const isMedAgent = isInfusion && field.key === "agent";
                            return (
                              <div key={field.key} className={isTextarea ? "col-span-2" : ""}>
                                <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color:"var(--muted-foreground)" }}>
                                  {field.label}
                                </label>
                                {isMedAgent ? (
                                  <MedCombobox
                                    value={step.fieldValues[field.key] ?? ""}
                                    meds={patientMeds}
                                    onChange={val => updateField(step.instanceId, field.key, val)}
                                  />
                                ) : field.type === "select" ? (
                                  <select
                                    value={step.fieldValues[field.key] ?? field.value}
                                    onChange={e => updateField(step.instanceId, field.key, e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-white text-foreground focus:outline-none focus:border-accent appearance-none">
                                    <option value="">— Select —</option>
                                    {(field.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
                                  </select>
                                ) : isTextarea ? (
                                  <textarea rows={3} placeholder={`Enter ${field.label.toLowerCase()}...`}
                                    value={step.fieldValues[field.key] ?? ""}
                                    onChange={e => updateField(step.instanceId, field.key, e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-white text-foreground focus:outline-none focus:border-accent resize-none" />
                                ) : (
                                  <input type={field.type === "number" ? "number" : "text"} placeholder="—"
                                    value={step.fieldValues[field.key] ?? ""}
                                    onChange={e => updateField(step.instanceId, field.key, e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-white text-foreground focus:outline-none focus:border-accent" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            {step.fields.filter(f => (step.fieldValues[f.key] ?? "").trim() !== "").length} of {step.fields.length} fields filled
                          </span>
                          <button
                            onClick={() => {
                              if (complete) {
                                onSave(steps);
                                setSaved(true);
                                setTimeout(() => setSaved(false), 2500);
                                completeAndAdvance(step.instanceId, index);
                              }
                            }}
                            disabled={!complete}
                            className="px-4 py-2 text-xs font-semibold rounded-sm transition-all"
                            style={{ background: complete ? step.color : "#dce4ef", color: complete ? "#fff" : "#a0aab8", cursor: complete ? "pointer" : "not-allowed" }}>
                            {index === steps.length - 1 ? "Save Section ✓" : "Save & Continue →"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Patient Record ───────────────────────────────────────────────────────────

function PatientRecord({ patient, initialTab, appt, onBack }: {
  patient: Patient; initialTab: PatientTab; appt?: Appointment; onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<PatientTab>(initialTab);
  const [selectedVisit, setSelectedVisit] = useState<VisitRecord|null>(() =>
    initialTab === "visit" ? (MOCK_VISITS[patient.id] ?? []).find(v => v.status === "in-progress") ?? null : null
  );
  const [savedEncounters, setSavedEncounters] = useState<Record<string, WorkflowStep[]>>(() => {
    const initial: Record<string, WorkflowStep[]> = {};
    (MOCK_VISITS[patient.id] ?? []).forEach(v => {
      if (MOCK_ENCOUNTERS[v.id]) initial[v.id] = MOCK_ENCOUNTERS[v.id];
    });
    return initial;
  });
  const p = patient;
  const labs = MOCK_LABS[p.id] ?? [];
  const docs = MOCK_DOCS[p.id] ?? [];
  const visits = MOCK_VISITS[p.id] ?? [];

  const TABS: { id: PatientTab; label: string }[] = [
    { id:"profile",     label:"Profile"      },
    { id:"visit",       label:"Visit"        },
    { id:"labs",        label:"Labs"         },
    { id:"medications", label:"Medications"  },
    { id:"documents",   label:"Documents"    },
  ];

  // Route lab-flag chips through the shared severity tokens so "critical"
  // reads identically to CDS red alerts elsewhere in the app.
  const flagStyle = (flag?:"H"|"L"|"C") => {
    if (flag==="C") return { bg:"var(--sev-critical-bg)", text:"var(--sev-critical-fg)", border:"var(--sev-critical-border)" };
    if (flag==="H"||flag==="L") return { bg:"var(--sev-warning-bg)", text:"var(--sev-warning-fg)", border:"var(--sev-warning-border)" };
    return null;
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">

      {/* ── Patient header ── */}
      <div className="flex-none" style={{ background:"var(--primary)" }}>
        {/* Name row */}
        <div className="flex items-center gap-3 px-6 pt-3 pb-2 border-b" style={{ borderColor:"rgba(255,255,255,0.08)" }}>
          <button onClick={onBack} className="sidebar-item text-xs font-medium flex-none rounded-sm px-1.5 py-1" style={{ color:"rgba(200,216,236,0.85)" }}>
            ← Back
          </button>
          <div className="w-px h-4 opacity-20" style={{ background:"#c8d8ec" }} />
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-none text-xs font-bold" style={{ background:"var(--accent)", color:"#fff" }}>
            {p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
          </div>
          <span className="text-base font-bold text-white" style={{ fontFamily:"'Libre Baskerville',serif", letterSpacing:"-0.01em" }}>{p.name}</span>
          <span className="text-xs px-2 py-0.5 rounded-sm" style={{ fontFamily:"'DM Mono',monospace", background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.75)" }}>{p.mrn}</span>
          {p.allergies.length>0 && (
            <div className="flex items-center gap-1.5 ml-1">
              <AlertCircle size={11} style={{ color:"#f87171" }}/>
              <span className="text-xs font-medium" style={{ color:"#f87171" }}>Allergies: {p.allergies.join(", ")}</span>
            </div>
          )}
          <div className="flex-1"/>
          {appt && <CategoryPill category={appt.visitCategory}/>}
          {appt && <StatusBadge status={appt.status}/>}
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm border transition-all"
            style={{ borderColor:"rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.7)", background:"transparent" }}>
            <Edit3 size={11}/>Edit
          </button>
        </div>

        {/* Demographics strip */}
        <div className="flex items-stretch overflow-x-auto">
          {[
            { label:"DOB",       value:`${p.dob} (${p.age}y)`   },
            { label:"SEX",       value:p.gender                  },
            { label:"INSURANCE", value:p.insurance               },
            { label:"PHONE",     value:p.phone                   },
            { label:"ECOG",      value:p.ecog                    },
            { label:"LAST VISIT",value:p.lastVisit               },
            { label:"ONCOLOGIST",value:p.oncologist              },
            { label:"NURSE",     value:p.nurse                   },
          ].map(item=>(
            <div key={item.label} className="flex flex-col justify-center px-4 py-2.5 border-r flex-none" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
              <div className="text-eyebrow" style={{ color:"rgba(200,216,236,0.75)" }}>{item.label}</div>
              <div className="text-xs font-medium text-white whitespace-nowrap mt-0.5">{item.value}</div>
            </div>
          ))}
          {/* Diagnosis — expands */}
          <div className="flex flex-col justify-center px-4 py-2.5 flex-1 min-w-0">
            <div className="text-eyebrow" style={{ color:"rgba(200,216,236,0.75)" }}>DIAGNOSIS</div>
            <div className="text-xs font-semibold text-white mt-0.5 truncate">{p.diagnosis}</div>
            <div className="text-xs truncate mt-0.5" style={{ color:"rgba(200,216,236,0.72)" }}>{p.stage}</div>
          </div>
        </div>

        {/* Regimen bar */}
        <div className="flex items-center gap-2 px-6 py-1.5 border-t" style={{ borderColor:"rgba(255,255,255,0.06)", background:"rgba(0,0,0,0.2)" }}>
          <span className="text-eyebrow flex-none" style={{ color:"rgba(200,216,236,0.75)" }}>REGIMEN</span>
          <span className="text-xs font-medium text-white">{p.cycleInfo}</span>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex items-center px-6 border-b border-border bg-white flex-none">
        {TABS.map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            className="px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors duration-150"
            style={{ borderBottomColor:activeTab===tab.id?"var(--accent)":"transparent", color:activeTab===tab.id?"var(--accent)":"var(--muted-foreground)" }}>
            {tab.label}
            {tab.id==="visit" && visits.length > 0 && <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ background:"var(--accent-soft-bg)", color:"var(--accent)" }}>{visits.length}</span>}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}

      {/* PROFILE */}
      {activeTab==="profile" && (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-2 gap-5">

            {/* Contact */}
            <div className="card-shadow bg-white rounded border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border text-xs font-semibold uppercase tracking-wider" style={{ color:"var(--muted-foreground)" }}>Contact Information</div>
              <div className="px-5 py-4 space-y-3">
                {[{icon:Phone,label:"Phone",value:p.phone},{icon:Mail,label:"Email",value:p.email},{icon:MapPin,label:"Address",value:p.address}].map(row=>(
                  <div key={row.label} className="flex items-start gap-3">
                    <row.icon size={13} className="flex-none mt-0.5 text-muted-foreground"/>
                    <div><div className="text-xs text-muted-foreground">{row.label}</div><div className="text-sm text-foreground mt-0.5">{row.value}</div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnosis */}
            <div className="card-shadow bg-white rounded border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border text-xs font-semibold uppercase tracking-wider" style={{ color:"var(--muted-foreground)" }}>Oncology Summary</div>
              <div className="px-5 py-4 space-y-3">
                <div><div className="text-xs text-muted-foreground">Diagnosis</div><div className="text-sm font-semibold text-foreground mt-0.5">{p.diagnosis}</div></div>
                <div><div className="text-xs text-muted-foreground">Stage</div><div className="text-sm text-foreground mt-0.5">{p.stage}</div></div>
                <div><div className="text-xs text-muted-foreground">Current Regimen</div><div className="text-sm text-foreground mt-0.5">{p.cycleInfo}</div></div>
                <div><div className="text-xs text-muted-foreground">ECOG Performance Status</div><div className="text-sm text-foreground mt-0.5">{p.ecog}</div></div>
              </div>
            </div>

            {/* Comorbidities */}
            <div className="card-shadow bg-white rounded border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border text-xs font-semibold uppercase tracking-wider" style={{ color:"var(--muted-foreground)" }}>Comorbidities</div>
              <div className="px-5 py-4">
                {p.conditions.length===0
                  ? <span className="text-xs text-muted-foreground">None documented</span>
                  : <div className="flex flex-wrap gap-2">{p.conditions.map(c=><span key={c} className="text-xs px-2.5 py-1 rounded-sm border" style={{ background:"#f4f6fa", borderColor:"rgba(15,39,68,0.1)", color:"var(--primary)" }}>{c}</span>)}</div>}
                {p.allergies.length>0 && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold mb-2" style={{ color:"var(--sev-critical-fg)" }}>Allergies</div>
                    <div className="flex flex-wrap gap-2">{p.allergies.map(a=><span key={a} className="text-xs px-2.5 py-1 rounded-sm" style={{ background:"var(--sev-critical-bg)", color:"var(--sev-critical-fg)", border:"1px solid #fecaca" }}>{a}</span>)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Care team */}
            <div className="card-shadow bg-white rounded border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border text-xs font-semibold uppercase tracking-wider" style={{ color:"var(--muted-foreground)" }}>Care Team</div>
              <div className="px-5 py-4 space-y-3">
                {[{role:"Oncologist",name:p.oncologist},{role:"Oncology Nurse",name:p.nurse},{role:"Insurance",name:p.insurance}].map(r=>(
                  <div key={r.role} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-none" style={{ background:"var(--accent-soft-bg)", color:"var(--accent)" }}>{r.name.split(" ").find(n=>n.match(/[A-Z]/))?.slice(0,1)??r.name[0]}</div>
                    <div><div className="text-xs text-muted-foreground">{r.role}</div><div className="text-sm font-medium text-foreground">{r.name}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISIT */}
      {activeTab==="visit" && (
        selectedVisit
          ? <EncounterDetail
              visit={selectedVisit}
              onBack={() => setSelectedVisit(null)}
              savedNote={savedEncounters[selectedVisit.id] ?? null}
              onSave={steps => setSavedEncounters(prev => ({ ...prev, [selectedVisit.id]: steps }))}
              patientMeds={patient.medications}
              baselineMetrics={buildPatientBaselines(patient.id)}
              patientId={patient.id}
            />
          : <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="card-shadow bg-white rounded border border-border overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} style={{ color:"var(--accent)" }}/>
                    <span className="text-sm font-semibold text-foreground">Visit History</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{visits.length} visits total</span>
                </div>

                {/* Current / in-progress section */}
                {visits.filter(v => v.status === "in-progress").length > 0 && (
                  <>
                    <div className="px-5 py-2 border-b border-border" style={{ background:"var(--sev-ok-bg)" }}>
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color:"var(--sev-ok-fg)" }}>Current Visit</span>
                    </div>
                    {visits.filter(v => v.status === "in-progress").map(v => {
                      const catC = CATEGORY_CONFIG[v.category];
                      return (
                        <div key={v.id} onClick={() => setSelectedVisit(v)}
                          className="row-hover-green flex items-center gap-5 px-5 py-4 border-b border-border"
                          style={{ background:"var(--sev-ok-bg)" }}>
                          {/* Date block */}
                          <div className="flex-none w-28">
                            <div className="text-sm font-bold" style={{ fontFamily:"'DM Mono',monospace", color:"var(--primary)" }}>{v.date.split(",")[0]}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{v.date.split(", ")[1]}</div>
                          </div>
                          {/* Green accent bar */}
                          <div className="w-1 self-stretch rounded-full flex-none" style={{ background:"var(--sev-ok-fg)" }}/>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-foreground">{v.type}</span>
                              <span className="text-xs px-2 py-0.5 rounded-sm font-semibold" style={{ background:"var(--sev-ok-fg)", color:"#fff" }}>In Progress</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{ background:catC.bg, color:catC.color }}>{catC.label}</span>
                              <span className="text-xs text-muted-foreground">{v.cycle}</span>
                              <span className="text-xs text-muted-foreground">· {v.provider}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-none">
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-sm" style={{ background:"var(--primary)", color:"#fff" }}>Open Encounter →</span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Past visits section */}
                {visits.filter(v => v.status === "completed").length > 0 && (
                  <>
                    <div className="px-5 py-2 border-b border-border" style={{ background:"#f8fafc" }}>
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color:"var(--muted-foreground)" }}>Past Visits</span>
                    </div>
                    {/* Column headers */}
                    <div className="grid px-5 py-2 border-b border-border" style={{ gridTemplateColumns:"7rem 1fr 9rem 8rem 5rem", background:"#f8fafc", gap:"1rem" }}>
                      {["Date","Visit / Regimen","Type","Provider",""].map(h => (
                        <span key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color:"#a0aab8" }}>{h}</span>
                      ))}
                    </div>
                    <div className="divide-y divide-border">
                      {visits.filter(v => v.status === "completed").map(v => {
                        const catC = CATEGORY_CONFIG[v.category];
                        return (
                          <div key={v.id} onClick={() => setSelectedVisit(v)}
                            className="row-hover grid items-center px-5 py-3.5"
                            style={{ gridTemplateColumns:"7rem 1fr 9rem 8rem 5rem", gap:"1rem" }}>
                            <div className="flex-none">
                              <div className="text-sm font-medium" style={{ fontFamily:"'DM Mono',monospace", color:"var(--primary)" }}>{v.date.split(",")[0]}</div>
                              <div className="text-xs text-muted-foreground">{v.date.split(", ")[1]}</div>
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">{v.type}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{v.cycle}</div>
                            </div>
                            <div>
                              <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{ background:catC.bg, color:catC.color }}>{catC.label}</span>
                            </div>
                            <div className="text-xs text-muted-foreground truncate">{v.provider}</div>
                            <div className="flex items-center gap-1.5">
                              {savedEncounters[v.id] && (
                                <span className="text-xs font-medium px-1.5 py-0.5 rounded-sm flex-none" style={{ background:"var(--sev-ok-bg)", color:"var(--sev-ok-fg)" }}>Note</span>
                              )}
                              <ChevronRight size={13} className="text-muted-foreground"/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
      )}

      {/* LABS */}
      {activeTab==="labs" && (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="card-shadow bg-white rounded border border-border overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2"><FlaskConical size={13} style={{ color:"#d97706" }}/><span className="text-sm font-semibold text-foreground">Lab Results</span></div>
              <span className="text-xs text-muted-foreground">Most recent draw</span>
            </div>
            <div className="divide-y divide-border">
              {labs.map(lab=>{
                const fs=flagStyle(lab.flag);
                return (
                  <div key={lab.label} className="flex items-center px-5 py-3">
                    <span className="text-xs text-muted-foreground w-28 flex-none">{lab.label}</span>
                    <span className="text-sm font-semibold flex-1" style={{ fontFamily:"'DM Mono',monospace", color:fs?fs.text:"var(--primary)" }}>{lab.value}</span>
                    <span className="text-xs text-muted-foreground w-16 flex-none">{lab.unit}</span>
                    <span className="text-xs text-muted-foreground w-16 flex-none">{lab.date}</span>
                    {lab.flag
                      ? <span className="text-xs font-bold px-2 py-0.5 rounded-sm" style={{ background:fs!.bg, color:fs!.text, border:`1px solid ${fs!.border}` }}>{lab.flag}</span>
                      : <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MEDICATIONS */}
      {activeTab==="medications" && (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="card-shadow bg-white rounded border border-border overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
              <Pill size={13} style={{ color:"#db2777" }}/><span className="text-sm font-semibold text-foreground">Active Medications</span>
            </div>
            <div className="divide-y divide-border">
              {p.medications.map((med,i)=>(
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-2 h-2 rounded-full flex-none" style={{ background:"var(--accent)" }}/>
                  <span className="text-sm text-foreground flex-1">{med}</span>
                  <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background:"var(--sev-ok-bg)", color:"var(--sev-ok-fg)", border:"1px solid #bbf7d0" }}>Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTS */}
      {activeTab==="documents" && (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="card-shadow bg-white rounded border border-border overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
              <FileText size={13} style={{ color:"#7c3aed" }}/><span className="text-sm font-semibold text-foreground">Documents</span>
            </div>
            <div className="divide-y divide-border">
              {docs.map((doc,i)=>(
                <div key={i} className="row-hover flex items-start gap-4 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{doc.description}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{ background:"#f5f3ff", color:"#7c3aed", border:"1px solid #ede9fe" }}>{doc.type}</span>
                      <span className="text-xs text-muted-foreground">{doc.provider}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-none whitespace-nowrap">{doc.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Patients list ────────────────────────────────────────────────────────────

function PatientListView({ onSelectPatient }: { onSelectPatient: (p: Patient) => void }) {
  const [query, setQuery] = useState("");
  const filtered = ALL_PATIENTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.mrn.toLowerCase().includes(query.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily:"'Libre Baskerville',serif", letterSpacing:"-0.02em" }}>Patients</h1>
        <p className="text-sm text-muted-foreground mt-1">{ALL_PATIENTS.length} patients on record</p>
      </div>
      <div className="relative mb-5 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
        <input type="text" placeholder="Search by name, MRN, or diagnosis..." value={query} onChange={e=>setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-border rounded-sm focus:outline-none focus:border-accent text-foreground"/>
      </div>
      <div className="card-shadow bg-white rounded border border-border overflow-hidden">
        <div className="grid px-5 py-2.5 border-b border-border" style={{ gridTemplateColumns:"2fr 1.5fr 1.5fr 1fr 1fr" }}>
          {["Patient","Diagnosis","Regimen","Last Visit","ECOG"].map(h=>(
            <span key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color:"var(--muted-foreground)" }}>{h}</span>
          ))}
        </div>
        <div className="divide-y divide-border">
          {filtered.map(p=>(
            <div key={p.id} onClick={()=>onSelectPatient(p)}
              className="row-hover grid px-5 py-3.5 items-center"
              style={{ gridTemplateColumns:"2fr 1.5fr 1.5fr 1fr 1fr" }}>
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-none" style={{ background:"var(--accent-soft-bg)", color:"var(--accent)" }}>
                    {p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground" style={{ fontFamily:"'DM Mono',monospace" }}>{p.mrn}</div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-foreground leading-relaxed pr-4">{p.diagnosis.split("(")[0].trim()}</div>
              <div className="text-xs text-muted-foreground pr-4 truncate">{p.cycleInfo.split("·")[0].trim()}</div>
              <div className="text-xs text-muted-foreground">{p.lastVisit}</div>
              <div><span className="text-xs px-2 py-0.5 rounded-sm" style={{ background:"var(--accent-soft-bg)", color:"var(--accent)" }}>{p.ecog.split(" ")[0]+p.ecog.split(" ")[1]}</span></div>
            </div>
          ))}
          {filtered.length===0 && <div className="px-5 py-8 text-center text-sm text-muted-foreground">No patients match "{query}"</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardView({ onOpenEncounter }: { onOpenEncounter: (appt: Appointment) => void }) {
  const seen = SCHEDULE.filter(a=>a.status==="completed").length;
  const immunoCount = SCHEDULE.filter(a=>a.visitCategory==="immunotherapy").length;
  const remaining = SCHEDULE.filter(a=>a.status!=="completed").length;
  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily:"'Libre Baskerville',Georgia,serif", letterSpacing:"-0.02em" }}>Oncology Clinic</h1>
        <p className="text-sm text-muted-foreground mt-1">Wednesday, July 9, 2026 · Infusion &amp; Outpatient Services</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label:"Patients Today",  value:String(SCHEDULE.length), sub:`${seen} seen · ${remaining} remaining`, accent:"var(--accent)" },
          { label:"Immunotherapy",   value:String(immunoCount),     sub:"Checkpoint inhibitor infusions",        accent:"var(--sev-ok-fg)" },
          { label:"Pending Actions", value:"3",                     sub:"Lab flags · 1 hold decision",           accent:"#d97706" },
        ].map(card=>(
          <div key={card.label} className="card-shadow bg-white rounded border border-border overflow-hidden">
            <div className="h-0.5" style={{ background: card.accent }}/>
            <div className="px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{card.label}</div>
              <div className="text-3xl font-bold text-foreground" style={{ fontFamily:"'Libre Baskerville',serif", letterSpacing:"-0.02em" }}>{card.value}</div>
              <div className="text-xs text-muted-foreground mt-1.5">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card-shadow bg-white rounded border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <div className="flex items-center gap-2"><Calendar size={14} className="text-muted-foreground"/><span className="text-sm font-semibold text-foreground">Today's Appointments</span></div>
          <span className="text-xs text-muted-foreground">{SCHEDULE.length} scheduled</span>
        </div>
        <div className="divide-y divide-border">
          {SCHEDULE.map(appt=>(
            <div key={appt.id} onClick={()=>appt.status!=="completed"&&onOpenEncounter(appt)}
              className={`flex items-center gap-4 px-5 py-3.5${appt.status!=="completed"?" row-hover":""}`}
              style={{ cursor:appt.status!=="completed"?"pointer":"default" }}>
              <div className="w-20 flex-none text-right">
                <span className="text-sm font-medium" style={{ fontFamily:"'DM Mono',monospace", color:"var(--primary)" }}>{appt.time}</span>
                <div className="text-xs text-muted-foreground">{appt.duration}</div>
              </div>
              <div className="w-0.5 h-10 rounded-full flex-none" style={{ background:STATUS_CONFIG[appt.status].dot }}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{appt.patient.name}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{appt.patient.age}y {appt.patient.gender}</span>
                  <CategoryPill category={appt.visitCategory}/>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">{appt.type}</div>
              </div>
              <div className="flex items-center gap-3 flex-none">
                <StatusBadge status={appt.status}/>
                {appt.status!=="completed"&&<ChevronRight size={14} className="text-muted-foreground"/>}
                {appt.status==="completed"&&<CheckCircle2 size={14} style={{ color:"var(--sev-ok-fg)" }}/>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState<"dashboard"|"patients"|"schedule"|"notes"|"settings">("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [view, setView]           = useState<AppView>("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient|null>(null);
  const [selectedAppt,    setSelectedAppt]    = useState<Appointment|null>(null);
  const [initialTab,      setInitialTab]      = useState<PatientTab>("profile");

  function openFromAppointment(appt: Appointment) {
    setSelectedPatient(appt.patient);
    setSelectedAppt(appt);
    setInitialTab("visit");
    setView("patient-record");
  }

  function openFromPatientList(p: Patient) {
    setSelectedPatient(p);
    setSelectedAppt(null);
    setInitialTab("profile");
    setView("patient-record");
  }

  function goBack() {
    setView(activeNav==="patients" ? "patients" : "dashboard");
    setSelectedPatient(null);
    setSelectedAppt(null);
  }

  const NAV_ITEMS = [
    { id:"dashboard" as const, icon:Activity,  label:"Dashboard" },
    { id:"patients"  as const, icon:Users,      label:"Patients"  },
    { id:"schedule"  as const, icon:Calendar,   label:"Schedule"  },
    { id:"notes"     as const, icon:FileText,   label:"Notes"     },
    { id:"settings"  as const, icon:Settings,   label:"Settings"  },
  ];

  const currentView = view==="patient-record" ? "patient-record" : activeNav;

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Sidebar */}
      <aside
        aria-label="Primary navigation"
        className={`flex flex-col flex-none border-r transition-[width] duration-200 ease-out ${sidebarCollapsed ? "w-14" : "w-48"}`}
        style={{ background:"var(--sidebar)", borderColor:"var(--sidebar-border)" }}>
        <div className={`flex items-center h-14 border-b flex-none ${sidebarCollapsed ? "justify-center px-2" : "gap-2.5 px-4"}`} style={{ borderColor:"var(--sidebar-border)" }}>
          <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-none" style={{ background:"var(--accent)" }}><Heart size={13} style={{ color:"#fff" }}/></div>
          {!sidebarCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white leading-tight truncate">Oncology</div>
                <div className="text-xs leading-tight truncate" style={{ color:"rgba(200,216,236,0.85)" }}>Clinical Suite</div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
                aria-expanded={true}
                className="sidebar-item flex-none p-1 rounded-sm"
                style={{ color:"rgba(200,216,236,0.85)" }}>
                <ChevronsLeft size={16}/>
              </button>
            </>
          )}
        </div>
        {sidebarCollapsed && (
          <button
            type="button"
            onClick={() => setSidebarCollapsed(false)}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            aria-expanded={false}
            className="sidebar-item mx-2 mt-2 flex items-center justify-center py-2 rounded-sm"
            style={{ color:"rgba(200,216,236,0.85)" }}>
            <ChevronsRight size={16}/>
          </button>
        )}
        <nav aria-label="Main menu" className="flex flex-col gap-0.5 pt-3 flex-1 px-2">
          {NAV_ITEMS.map(item=>{
            const Icon=item.icon;
            const isActive = currentView===item.id;
            return (
              <button key={item.id} onClick={()=>{ setActiveNav(item.id); setView(item.id==="patients"?"patients":"dashboard"); setSelectedPatient(null); setSelectedAppt(null); }}
                title={sidebarCollapsed ? item.label : undefined}
                aria-label={sidebarCollapsed ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`sidebar-item flex items-center rounded-sm text-left w-full ${sidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"}${isActive?" sidebar-item-active":""}`}
                style={{ background:isActive?"var(--sidebar-accent)":"transparent", color:isActive?"#e8f0fb":"rgba(200,216,236,0.75)" }}
              >
                <Icon size={15} className="flex-none"/>
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="px-2 pb-4 border-t pt-3" style={{ borderColor:"var(--sidebar-border)" }}>
          <button
            title={sidebarCollapsed ? "Sign Out" : undefined}
            aria-label={sidebarCollapsed ? "Sign Out" : undefined}
            className={`sidebar-item flex items-center rounded-sm w-full ${sidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"}`}
            style={{ color:"rgba(200,216,236,0.72)" }}>
            <LogOut size={15} className="flex-none"/>
            {!sidebarCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 h-14 border-b border-border bg-white flex-none">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            {currentView==="patient-record" && selectedPatient ? (
              <>
                <span className="text-sm text-muted-foreground">{activeNav==="patients" ? "Patients" : "Dashboard"}</span>
                <ChevronRight size={12} className="text-muted-foreground flex-none"/>
                <span className="text-sm font-semibold text-foreground truncate">{selectedPatient.name}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-foreground">
                {currentView==="patients" ? "Patients" : activeNav==="dashboard" ? "Dashboard" : activeNav.charAt(0).toUpperCase()+activeNav.slice(1)}
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <input type="text" placeholder="Search patients..." className="pl-8 pr-3 py-1.5 text-sm bg-muted border border-border rounded-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 text-foreground w-48 transition-colors"/>
          </div>
          <button
            type="button"
            aria-label="Notifications: 3 unread alerts"
            className="relative p-1.5 rounded-sm hover:bg-muted transition-colors">
            <Bell size={15} className="text-muted-foreground"/>
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white leading-none"
              style={{ background:"var(--destructive)" }}>3</span>
          </button>
        </header>

        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {currentView==="patient-record" && selectedPatient
            ? <PatientRecord patient={selectedPatient} initialTab={initialTab} appt={selectedAppt??undefined} onBack={goBack}/>
            : currentView==="patients"
            ? <PatientListView onSelectPatient={openFromPatientList}/>
            : <DashboardView onOpenEncounter={openFromAppointment}/>}
        </div>
      </div>
    </div>
  );
}
