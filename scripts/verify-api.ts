#!/usr/bin/env npx tsx
/**
 * Verify API route handlers via mock-store (server-side logic).
 * Run: npx tsx scripts/verify-api.ts
 */
import {
  authenticateUser,
  getStudents,
  getTeachers,
  getClasses,
  getDashboardData,
  getStudentFeeSummaries,
  getExams,
  getSchoolProfile,
  getAdminUsers,
} from '../src/lib/mock-store'

const checks: [string, () => boolean][] = [
  ['auth', () => authenticateUser('admin@school.edu', 'admin123') !== null],
  ['students', () => getStudents({}).data.length > 0],
  ['teachers', () => getTeachers({ limit: 50 }).total >= 12],
  ['classes', () => getClasses({}).data.length >= 8],
  ['dashboard', () => getDashboardData().stats.totalStudents > 0],
  ['fees', () => getStudentFeeSummaries().length > 0],
  ['exams', () => getExams().length > 0],
  ['settings profile', () => getSchoolProfile().name.length > 0],
  ['settings users', () => getAdminUsers().length >= 2],
]

let failed = 0
for (const [name, fn] of checks) {
  try {
    if (fn()) console.log(`OK: ${name}`)
    else { console.error(`FAIL: ${name}`); failed++ }
  } catch (e) {
    console.error(`ERROR: ${name}`, e)
    failed++
  }
}

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`)
  process.exit(1)
}
console.log('\nAll API/store checks passed.')
