// Базовые фильтры
export { useFacultyFilter } from "./FacultyFilter";
export { useDirectionFilter } from "./DirectionFilter";
export { useAcademicYearFilter } from "./AcademicYearFilter";
export { useSemesterFilter } from "./SemesterFilter";
export { usePeriodFilter } from "./PeriodFilter";
export { useStudyFormFilter } from "./StudyFormFilter";
// Примеры использования:

/**
 * 1. Все фильтры (факультет, направление, год, период, семестр):
 *
 * import { useAllFilters } from "@/components/datatable/toolbar/filters";
 *
 * export default function SubjectsPage() {
 *   const { filterSchema } = useAllFilters();
 *
 *   return (
 *     <DataTableWrapper
 *       entity="subject"
 *       filterSchema={filterSchema}
 *       // ... other props
 *     />
 *   );
 * }
 */

/**
 * 2. Только факультет и направление:
 *
 * import { useFacultyDirectionFilters } from "@/components/datatable/toolbar/filters";
 *
 * const { filterSchema } = useFacultyDirectionFilters();
 */

/**
 * 3. Только академические фильтры (год, период, семестр):
 *
 * import { useAcademicFilters } from "@/components/datatable/toolbar/filters";
 *
 * const { filterSchema } = useAcademicFilters();
 */

/**
 * 4. Кастомная комбинация:
 *
 * import { useAllFilters } from "@/components/datatable/toolbar/filters";
 *
 * const { filterSchema } = useAllFilters({
 *   includeFaculty: true,
 *   includeDirection: false,
 *   includeAcademicYear: true,
 *   includePeriod: true,
 *   includeSemester: false
 * });
 */
