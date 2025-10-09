/**
 * Центральный экспорт всех утилит календаря
 */

// Утилиты для работы с ресурсами
export {
  getResourceId,
  getResourceTitle,
  createResourcesFromLessons,
} from "./resourceUtils";

// Утилиты для работы с событиями
export {
  transformLessonToEvent,
  transformLessonsToEvents,
  darkenColor,
} from "./eventUtils";

// Утилиты для работы с датами
export { getDateRange, formatTime } from "./dateUtils";

// Обработчики событий календаря
export {
  findValidSubjectAssignment,
  buildFullLessonData,
  createEventDropHandler,
  createEventResizeHandler,
} from "./eventHandlers";

// Навигационные обработчики
export {
  createNavigateToLessonsHandler,
  createNavigateToConflictHandler,
  createSelectEventHandler,
  createSelectSlotHandler,
  createNavigateHandler,
  createViewChangeHandler,
} from "./navigationHandlers";

// Отладочные утилиты
export { logDebugInfo } from "./debugUtils";
