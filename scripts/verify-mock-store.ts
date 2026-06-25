#!/usr/bin/env npx tsx
/**
 * Type-check mock store by importing and running basic operations.
 * Run: npx tsx scripts/verify-mock-store.ts
 */
import {
  authenticateUser,
  getStudents,
  getTeachers,
  getClasses,
  getDashboardData,
  createStudent,
  getStudentFeeSummaries,
} from '../src/lib/mock-store'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAIL: ${message}`)
  console.log(`OK: ${message}`)
}

const admin = authenticateUser('admin@school.edu', 'admin123')
assert(admin !== null, 'admin login works')

const bad = authenticateUser('admin@school.edu', 'wrong')
assert(bad === null, 'bad password rejected')

const students = getStudents({ page: 1, limit: 5 })
assert(students.data.length > 0, 'students list returns data')
assert(students.total >= 30, 'has seeded students')

const teachers = getTeachers({})
assert(teachers.data.length > 0, 'teachers list works')

const classes = getClasses({})
assert(classes.data.length >= 4, 'classes list works')

const dashboard = getDashboardData()
assert(dashboard.stats.totalStudents > 0, 'dashboard stats work')

const fees = getStudentFeeSummaries()
assert(fees.length > 0, 'fee summaries work')

console.log('\nAll mock-store checks passed.')
