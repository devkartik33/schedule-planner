/**
 * Утилиты для отладки календаря
 */

/**
 * Выводит отладочную информацию в консоль
 */
export const logDebugInfo = (
  currentView,
  groupBy,
  lessons,
  resources,
  events
) => {
  console.log("=== DEBUG INFO ===");
  console.log("Current view:", currentView);
  console.log("Group by:", groupBy);
  console.log("Total lessons:", lessons.length);
  console.log("Lessons data:", lessons);

  if (groupBy !== "none") {
    console.log("Resources generated:", resources);
    console.log("Events generated:", events.slice(0, 3)); // первые 3 события для проверки

    // Проверяем связь resourceId в событиях с ресурсами
    const eventResourceIds = events.map((e) => e.resourceId);
    const resourceIds = resources?.map((r) => r.resourceId) || [];
    console.log("Event resource IDs:", [...new Set(eventResourceIds)]);
    console.log("Available resource IDs:", resourceIds);

    // Проверяем есть ли события без ресурса
    const eventsWithoutResource = events.filter((e) => !e.resourceId);
    if (eventsWithoutResource.length > 0) {
      console.log("Events without resourceId:", eventsWithoutResource);
    }
  }
  console.log("=================");
};
