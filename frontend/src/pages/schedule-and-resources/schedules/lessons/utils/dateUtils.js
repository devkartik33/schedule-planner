import moment from "moment";

/**
 * Утилиты для работы с датами календаря
 */

/**
 * Вычисляет период для загрузки уроков на основе текущего вида
 */
export const getDateRange = (date, view) => {
  const startOfWeek = moment(date).startOf("week");
  const endOfWeek = moment(date).endOf("week");

  switch (view) {
    case "day":
      return {
        date_from: moment(date).format("YYYY-MM-DD"),
        date_to: moment(date).format("YYYY-MM-DD"),
      };
    case "week":
    default:
      return {
        date_from: startOfWeek.format("YYYY-MM-DD"),
        date_to: endOfWeek.format("YYYY-MM-DD"),
      };
  }
};

/**
 * Форматирует время в формат HH:MM:SS
 */
export const formatTime = (date) => {
  return date.toTimeString().split(" ")[0]; // Получаем HH:MM:SS
};
