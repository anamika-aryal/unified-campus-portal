export const teacher = {
  name: "Aarav Sharma",
  title: "Prof.",
  department: "Computer Engineering",
  specialization: "Machine Learning & Data Structures",
  email: "aarav.sharma@college.edu",
  phone: "+977 98-1234-5678",
  office: "Block B — Room 214",
  officeHours: "Mon–Fri · 2:00 – 4:00 PM",
  experience: "8 years",
  qualification: "Ph.D. in Computer Engineering",
  photo: "https://i.pravatar.cc/160?img=15",
  semester: "Fall 2026 · Semester 5",
};

// ---------------------------------------------------------------------------
// Department → Semester → Section → Course hierarchy
// ---------------------------------------------------------------------------

export type Department = { id: string; name: string; code: string };

export const departments: Department[] = [
  { id: "ce", name: "Computer Engineering", code: "CE" },
  { id: "ee", name: "Electrical Engineering", code: "EE" },
  { id: "cv", name: "Civil Engineering", code: "CV" },
];

export const semesterList = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type Section = { id: "D" | "M1" | "M2"; label: string };

export const sectionList: Section[] = [
  { id: "D", label: "Section D" },
  { id: "M1", label: "Section M1" },
  { id: "M2", label: "Section M2" },
];

export type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  dept: string; // department id
  sem: number;
  section: Section["id"];
  enrolled: number;
  attendance: number;
};

export const courses: Course[] = [
  { id: "cs501", code: "CS-501", name: "Machine Learning", credits: 4, dept: "ce", sem: 5, section: "D", enrolled: 52, attendance: 89 },
  { id: "cs502", code: "CS-502", name: "Machine Learning Lab", credits: 1, dept: "ce", sem: 5, section: "D", enrolled: 52, attendance: 91 },
  { id: "cs402", code: "CS-402", name: "Data Structures", credits: 3, dept: "ce", sem: 4, section: "M1", enrolled: 61, attendance: 84 },
  { id: "cs603", code: "CS-603", name: "Advanced Algorithms", credits: 4, dept: "ce", sem: 6, section: "M2", enrolled: 38, attendance: 91 },
  { id: "cs305", code: "CS-305", name: "Database Systems", credits: 3, dept: "ce", sem: 3, section: "D", enrolled: 35, attendance: 82 },
];

export function coursesFor(dept: string, sem: number, section: string) {
  return courses.filter((c) => c.dept === dept && c.sem === sem && c.section === section);
}

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------

export const students = Array.from({ length: 24 }).map((_, i) => ({
  id: `S${1000 + i}`,
  name: [
    "Anisha Karki", "Rohan Thapa", "Priya Rai", "Bikash Gurung", "Sneha Shrestha",
    "Aayush Basnet", "Nisha Adhikari", "Sujan Lama", "Manisha KC", "Prabin Sapkota",
    "Ritika Joshi", "Suman Bhattarai", "Kritika Poudel", "Ashish Magar", "Pooja Neupane",
    "Deepak Tamang", "Rekha Chhetri", "Sagar Pandey", "Muna Bhandari", "Nabin Regmi",
    "Sushmita Dahal", "Bibek Ghimire", "Anita Subedi", "Kiran Shah",
  ][i],
  enrollment: `CE-2023-${(i + 1).toString().padStart(3, "0")}`,
  photo: `https://i.pravatar.cc/120?img=${(i % 60) + 1}`,
  attendance: 65 + ((i * 7) % 33),
  internal: 25 + ((i * 11) % 25),
  status: "present" as "present" | "absent",
}));

export function studentsFor(courseId: string, count = 12) {
  // deterministic-but-varied subset per course
  const seed = courseId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return students.slice(seed % 6, seed % 6 + count);
}

// ---------------------------------------------------------------------------
// Internal marks component weightages (out of 50 total)
// ---------------------------------------------------------------------------

export const practicalComponents = [
  { key: "pAttendance", label: "Attendance & Class Participation", weightPct: 10, max: 2 },
  { key: "pLabReport", label: "Lab Report / Project Report", weightPct: 20, max: 4 },
  { key: "pExam", label: "Practical Exam / Project Work", weightPct: 40, max: 8 },
  { key: "pViva", label: "Viva", weightPct: 30, max: 6 },
] as const;

export const theoryComponents = [
  { key: "tAttendance", label: "Attendance & Class Participation", weightPct: 10, max: 3 },
  { key: "tAssignment", label: "Assignment", weightPct: 20, max: 6 },
  { key: "tPresentation", label: "Presentation", weightPct: 10, max: 3 },
  { key: "tAssessment", label: "Internal Assessment", weightPct: 60, max: 18 },
] as const;

export const PRACTICAL_MAX = 20;
export const THEORY_MAX = 30;
export const TOTAL_INTERNAL_MAX = 50;

export type MarksEntry = Record<string, number>;

export function defaultMarksEntry(): MarksEntry {
  const entry: MarksEntry = {};
  [...practicalComponents, ...theoryComponents].forEach((c) => {
    entry[c.key] = Math.round(c.max * (0.6 + Math.random() * 0.35) * 10) / 10;
  });
  return entry;
}

export function practicalTotal(entry: MarksEntry) {
  return practicalComponents.reduce((s, c) => s + (entry[c.key] ?? 0), 0);
}
export function theoryTotal(entry: MarksEntry) {
  return theoryComponents.reduce((s, c) => s + (entry[c.key] ?? 0), 0);
}
export function internalTotal(entry: MarksEntry) {
  return practicalTotal(entry) + theoryTotal(entry);
}

// ---------------------------------------------------------------------------
// Charts / performance data
// ---------------------------------------------------------------------------

export const attendanceTrend = [
  { day: "Mon", value: 88 },
  { day: "Tue", value: 91 },
  { day: "Wed", value: 86 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 93 },
  { day: "Sat", value: 84 },
];

export const performanceTrend = [
  { month: "Jan", marks: 62 },
  { month: "Feb", marks: 65 },
  { month: "Mar", marks: 68 },
  { month: "Apr", marks: 66 },
  { month: "May", marks: 71 },
  { month: "Jun", marks: 74 },
  { month: "Jul", marks: 76 },
];

export const activities = [
  { icon: "check", title: "Attendance taken", desc: "CS-501 Machine Learning · 52 students", time: "20 min ago", tone: "success" },
  { icon: "award", title: "Marks published", desc: "CS-603 · Internal Assessment 2", time: "3 hrs ago", tone: "accent" },
  { icon: "bell", title: "Notice posted", desc: "Guest lecture on Transformers · Wed 4 PM", time: "Yesterday", tone: "warning" },
  { icon: "message", title: "Report generated", desc: "Internal marks report for CS-501", time: "2 days ago", tone: "primary" },
];

// ---------------------------------------------------------------------------
// Notices (view-only for teacher)
// ---------------------------------------------------------------------------

export const notices = [
  {
    id: "n1",
    title: "Guest Lecture: Transformers in NLP",
    type: "Course",
    audience: "CS-501",
    description:
      "A guest lecture on Transformer architectures and their applications in natural language processing will be held in Seminar Hall B. All students of CS-501 are required to attend.",
    attachment: "transformers-lecture.pdf",
    publishedDate: "2026-07-08",
  },
  {
    id: "n2",
    title: "Assignment 4 deadline extended",
    type: "Course",
    audience: "CS-402",
    description:
      "The deadline for Assignment 4 (Trees & Graphs) has been extended by 3 days due to multiple requests. New deadline is Friday, 11:59 PM.",
    attachment: null,
    publishedDate: "2026-07-06",
  },
  {
    id: "n3",
    title: "Department seminar on IoT",
    type: "Department",
    audience: "Computer Engg.",
    description:
      "The Department of Computer Engineering is organizing a seminar on Internet of Things and its industrial applications. Venue: Auditorium, 2:00 PM onwards.",
    attachment: "iot-seminar-agenda.pdf",
    publishedDate: "2026-07-05",
  },
  {
    id: "n4",
    title: "Library resource access",
    type: "General",
    audience: "All students",
    description:
      "Students can now access the digital library resources using their student portal credentials. Contact the library desk for any access issues.",
    attachment: null,
    publishedDate: "2026-07-03",
  },
  {
    id: "n5",
    title: "Mid-term examination routine published",
    type: "General",
    audience: "All students",
    description:
      "The mid-term examination routine for the current semester has been published. Please check the notice board and student portal for exact dates and venues.",
    attachment: "midterm-routine.pdf",
    publishedDate: "2026-07-01",
  },
];
