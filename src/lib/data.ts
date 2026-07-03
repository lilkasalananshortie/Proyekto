import { RESEARCH_FIELD_LABELS } from '@/types'
import type { SelectOption } from '@/components/ui/Select'

// ============================================================
// Placeholder data — replace these with API calls later.
// Each function maps to what the Laravel API will return.
// ============================================================

/** GET /api/v1/institutions */
export const institutionOptions: SelectOption[] = [
  { value: 'placeholder_1', label: 'University of the Philippines System' },
  { value: 'placeholder_2', label: 'De La Salle University' },
  { value: 'placeholder_3', label: 'Ateneo de Manila University' },
  { value: 'placeholder_4', label: 'University of Santo Tomas' },
  { value: 'placeholder_5', label: 'Polytechnic University of the Philippines' },
  { value: 'placeholder_6', label: 'Mapua University' },
  { value: 'placeholder_7', label: 'University of the East' },
  { value: 'placeholder_8', label: 'Far Eastern University' },
  { value: 'placeholder_9', label: 'Adamson University' },
  { value: 'placeholder_10', label: 'University of San Carlos' },
  { value: 'placeholder_11', label: 'Silliman University' },
  { value: 'placeholder_12', label: 'Xavier University - Ateneo de Cagayan' },
  { value: 'placeholder_13', label: 'Central Luzon State University' },
  { value: 'placeholder_14', label: 'Visayas State University' },
  { value: 'placeholder_15', label: 'Carnegie Mellon University' },
  { value: 'placeholder_other', label: 'Other (not listed)' },
]

/** GET /api/v1/departments?institution_id={id} */
export const departmentOptions: SelectOption[] = [
  { value: 'placeholder_cs', label: 'College of Computer Studies' },
  { value: 'placeholder_eng', label: 'College of Engineering' },
  { value: 'placeholder_bus', label: 'College of Business & Accountancy' },
  { value: 'placeholder_arts', label: 'College of Arts & Sciences' },
  { value: 'placeholder_edu', label: 'College of Education' },
  { value: 'placeholder_health', label: 'College of Health Sciences' },
  { value: 'placeholder_archi', label: 'College of Architecture & Design' },
  { value: 'placeholder_law', label: 'College of Law' },
  { value: 'placeholder_crim', label: 'College of Criminal Justice' },
  { value: 'placeholder_maritime', label: 'College of Maritime Education' },
  { value: 'placeholder_agri', label: 'College of Agriculture & Fisheries' },
  { value: 'placeholder_hosp', label: 'College of Hospitality & Tourism Management' },
  { value: 'placeholder_comms', label: 'College of Communication & Media' },
  { value: 'placeholder_math', label: 'College of Mathematics & Statistics' },
  { value: 'placeholder_ssci', label: 'College of Social Sciences' },
  { value: 'placeholder_natsci', label: 'College of Natural Sciences' },
  { value: 'placeholder_other', label: 'Other (not listed)' },
]

/** Static — degree levels don't change */
export const degreeOptions: SelectOption[] = [
  { value: 'undergraduate', label: 'Undergraduate (College Level)' },
  { value: 'masteral', label: "Masteral (Master's Degree)" },
  { value: 'doctoral', label: 'Doctoral (Ph.D.)' },
]

/** Static — research fields don't change */
export const fieldOptions: SelectOption[] = Object.entries(RESEARCH_FIELD_LABELS).map(
  ([value, label]) => ({ value, label })
)