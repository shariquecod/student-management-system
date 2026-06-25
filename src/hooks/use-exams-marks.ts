'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  fetchClasses,
  getClass,
  fetchExamResults,
  saveExamResults,
} from '@/services/school-api'
import type { Exam, ExamResult, Student, SubjectMark } from '@/types'
import { toast } from 'sonner'

function buildMarksMap(results: ExamResult[]) {
  const m: Record<string, Record<string, number>> = {}
  results.forEach((r) => {
    m[r.studentId] = {}
    r.marks.forEach((mk) => {
      m[r.studentId][mk.subject] = mk.score
    })
  })
  return m
}

interface UseExamsMarksOptions {
  allExams: Exam[]
  enabled: boolean
  t: (key: string, params?: Record<string, string | number>) => string
}

export function useExamsMarks({ allExams, enabled, t }: UseExamsMarksOptions) {
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [marks, setMarks] = useState<Record<string, Record<string, number>>>({})
  const [results, setResults] = useState<ExamResult[]>([])
  const [loadingRoster, setLoadingRoster] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!enabled || classes.length > 0) return
    fetchClasses({ limit: 50 })
      .then((r) => setClasses(r.data.map((c) => ({ id: c.id, name: c.name }))))
      .catch(console.error)
  }, [enabled, classes.length])

  useEffect(() => {
    if (!enabled || !selectedClass) return
    setLoadingRoster(true)
    getClass(selectedClass)
      .then((c) => {
        setStudents(c.students)
        if (!selectedExam) {
          setResults([])
          setMarks({})
          return
        }
        return fetchExamResults(selectedExam, selectedClass).then((res) => {
          setResults(res)
          setMarks(buildMarksMap(res))
        })
      })
      .catch(console.error)
      .finally(() => setLoadingRoster(false))
  }, [enabled, selectedExam, selectedClass])

  const selectedExamData = allExams.find((e) => e.id === selectedExam)
  const passCount = results.filter((r) => r.status === 'pass').length

  const saveMarks = useCallback(async () => {
    if (!selectedExamData || !selectedClass) return false
    setSaving(true)
    try {
      const payload = students.map((s) => ({
        studentId: s.id,
        marks: selectedExamData.subjects.map((sub) => ({
          subject: sub,
          score: marks[s.id]?.[sub] ?? 0,
          maxScore: selectedExamData.maxScore,
        })) as SubjectMark[],
      }))
      const saved = await saveExamResults(selectedExam, selectedClass, payload)
      setResults(saved)
      toast.success(t('exams.marksSaved'))
      return true
    } catch {
      toast.error(t('exams.saveFailed'))
      return false
    } finally {
      setSaving(false)
    }
  }, [selectedExamData, selectedClass, students, marks, selectedExam, t])

  const handleMarkChange = useCallback(
    (studentId: string, subject: string, score: number) => {
      setMarks((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], [subject]: score },
      }))
    },
    []
  )

  const enterMarks = useCallback((exam: Exam) => {
    setSelectedExam(exam.id)
  }, [])

  return {
    classes,
    selectedExam,
    setSelectedExam,
    selectedClass,
    setSelectedClass,
    students,
    marks,
    results,
    selectedExamData,
    passCount,
    loadingRoster,
    saving,
    saveMarks,
    handleMarkChange,
    enterMarks,
  }
}
