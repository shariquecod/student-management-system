/** Internal mock-store seed data — not used by the students UI (real API). */

export interface StudentSeedRecord {
  serialNo: number
  fullName: string
  fullNameUr: string
  village: string
  classLabel: string
  school: string
  shift: string
  time: string
  mobile: string
  fee: number | null
}

export const studentSeedRecords: StudentSeedRecord[] = [
  {
    serialNo: 1,
    fullName: 'Abdul Jabir Parwan',
    fullNameUr: 'عبد الجبار پروان',
    village: 'Sangli',
    classLabel: '12th',
    school: 'Anglo Urdu College, Sangli',
    shift: 'Friday',
    time: '',
    mobile: '8412989048',
    fee: 1000,
  },
  {
    serialNo: 2,
    fullName: 'Yaseen Noor Ahmad Mulla',
    fullNameUr: 'یاسین نور احمد ملا',
    village: '',
    classLabel: '',
    school: '',
    shift: '',
    time: '',
    mobile: '9767902953',
    fee: 1500,
  },
  {
    serialNo: 3,
    fullName: 'Numan Imran Ghori',
    fullNameUr: 'نعمان عمران گھوری',
    village: '',
    classLabel: '',
    school: '',
    shift: '',
    time: '',
    mobile: '8793416835',
    fee: 1000,
  },
  {
    serialNo: 4,
    fullName: 'Asad Ali Patil Mulla',
    fullNameUr: 'اسد علی پاٹیل ملا',
    village: '',
    classLabel: '',
    school: '',
    shift: '',
    time: '',
    mobile: '7020277627',
    fee: 1500,
  },
  {
    serialNo: 5,
    fullName: 'Ziyan Zamir Kare Bahal',
    fullNameUr: 'ضیان ضمیر کری بہال',
    village: '',
    classLabel: '',
    school: '',
    shift: '',
    time: '',
    mobile: '8983869640',
    fee: 1500,
  },
  {
    serialNo: 6,
    fullName: 'Syed Abdul Haris Jawan',
    fullNameUr: 'سید عبدالحارث جوان',
    village: 'Miraj',
    classLabel: '9th',
    school: 'Jawahar School & College, Miraj',
    shift: 'Afternoon',
    time: '12:00-5:00',
    mobile: '8600660064',
    fee: 500,
  },
  {
    serialNo: 7,
    fullName: 'Sabreen Mohammad Tanveer Badri',
    fullNameUr: 'سبریٰن محمد تنوییر بدری',
    village: 'Miraj',
    classLabel: '10th',
    school: 'Jawahar School & College, Miraj',
    shift: 'Afternoon',
    time: '12:00-5:00',
    mobile: '8748919946',
    fee: 1000,
  },
  {
    serialNo: 8,
    fullName: 'Syed Mubarak Bahadur',
    fullNameUr: 'سید مبارک بہادر',
    village: 'Sangli',
    classLabel: '9th',
    school: 'Anglo Urdu College, Sangli',
    shift: 'Afternoon',
    time: '12:00-5:00',
    mobile: '9970500555',
    fee: 1000,
  },
  {
    serialNo: 9,
    fullName: 'Fazal Karim Farzad Ansari',
    fullNameUr: 'فضل کریم فرزند انصاری',
    village: 'Miraj',
    classLabel: '8th',
    school: 'Jawahar School & College, Miraj',
    shift: 'Afternoon',
    time: '12:00-5:00',
    mobile: '8805336463',
    fee: 1200,
  },
  {
    serialNo: 10,
    fullName: 'Mohammad Zubair Hafiz Musa Mulla',
    fullNameUr: 'محمد زبیر حافظ موسیٰ ملا',
    village: 'Miraj',
    classLabel: '8th',
    school: 'Jawahar School & College, Miraj',
    shift: 'Afternoon',
    time: '12:00-5:00',
    mobile: '8686731313',
    fee: 2200,
  },
  {
    serialNo: 11,
    fullName: 'Hasan Mubarak Khan',
    fullNameUr: 'حسن مبارک خان',
    village: 'Miraj',
    classLabel: '7th',
    school: 'Jawahar School & College, Miraj',
    shift: 'Afternoon',
    time: '12:00-5:00',
    mobile: '9096416241',
    fee: 2000,
  },
  {
    serialNo: 12,
    fullName: 'Sarfaraz Sikandar Mulla',
    fullNameUr: 'سرفراز سکندر ملا',
    village: 'Miraj',
    classLabel: '10th',
    school: 'Jawahar School & College, Miraj',
    shift: 'Morning',
    time: '07:00-12:00',
    mobile: '9309223525',
    fee: null,
  },
  {
    serialNo: 13,
    fullName: 'Alqama Taufiq Jahan',
    fullNameUr: 'القمعہ توفیق جہاں',
    village: 'Miraj',
    classLabel: '8th',
    school: 'Jawahar School & College, Miraj',
    shift: 'Afternoon',
    time: '12:00-5:00',
    mobile: '9359493919',
    fee: 1000,
  },
  {
    serialNo: 14,
    fullName: 'Sifat Farooq Usman',
    fullNameUr: 'صفت فاروق عثمان',
    village: 'Miraj',
    classLabel: '9th',
    school: 'Jawahar School & College, Miraj',
    shift: 'Morning',
    time: '07:00-12:00',
    mobile: '8484901051',
    fee: 1000,
  },
  {
    serialNo: 15,
    fullName: 'Abdul Karim Mahboob Taj',
    fullNameUr: 'عبدالکریم محبوب تاج',
    village: '',
    classLabel: '9th',
    school: '',
    shift: 'Exam Only',
    time: '',
    mobile: '9766307156',
    fee: 1500,
  },
]

const gradeClassMap: Record<string, { id: string; name: string; grade: string; year: number }> = {
  '7th': { id: 'cls_1', name: 'Grade 7', grade: '7', year: 2027 },
  '8th': { id: 'cls_2', name: 'Grade 8', grade: '8', year: 2027 },
  '9th': { id: 'cls_3', name: 'Grade 9', grade: '9', year: 2026 },
  '10th': { id: 'cls_4', name: 'Grade 10', grade: '10', year: 2026 },
  '12th': { id: 'cls_5', name: 'Grade 12', grade: '12', year: 2025 },
}

const unassignedClass = { id: 'cls_6', name: 'Unassigned', grade: '', year: 2026 }

export function splitStudentName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: 'Student', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

export function getStudentClassFromLabel(classLabel: string) {
  const normalized = classLabel.trim().toLowerCase()
  if (!normalized) return unassignedClass
  return gradeClassMap[normalized] ?? unassignedClass
}

export function buildStudentNotes(record: StudentSeedRecord) {
  const parts = [
    record.school && `School: ${record.school}`,
    record.shift && `Shift: ${record.shift}`,
    record.time && `Time: ${record.time}`,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : undefined
}

export function slugifyStudentEmail(fullName: string, serialNo: number) {
  const slug = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
  return `${slug || `student.${serialNo}`}@student.edu`
}
