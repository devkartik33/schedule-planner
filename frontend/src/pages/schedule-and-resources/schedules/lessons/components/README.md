# Schedule Conflicts Management System

## 🎯 Overview

Comprehensive conflict management system for lesson scheduling with:
- **Single Schedule Conflicts**: Issues within one schedule
- **Cross-Schedule Conflicts**: Issues between different schedules  
- **Type-based Grouping**: Room, Professor, and Group conflicts
- **Visual Navigation**: Click to jump to problematic lessons

## 📁 Components Structure

```
frontend/src/pages/schedules/lessons/
├── LessonsCalendar.jsx           # Main calendar component
├── LessonsCalendar.css          # Calendar styling
└── components/
    ├── ConflictsDropdown.jsx    # Conflicts dropdown menu
    └── EventComponent.jsx       # Calendar event display
```

## 🚀 API Endpoints

- `GET /api/lesson/conflicts` - Paginated conflicts list
- `GET /api/lesson/conflicts/summary` - Grouped conflicts summary

## 🎨 Features

### ConflictsDropdown
- **Smart Grouping**: Single vs Shared conflicts
- **Type Sections**: Room 🏢, Professor 👨‍🏫, Group 👥
- **Visual Hierarchy**: Clear separation of conflict types
- **Cross-Schedule Detection**: "Other Schedule" badges
- **Navigation**: Click to jump to conflict date

### EventComponent  
- **Adaptive Display**: Hides redundant info based on grouping
- **Icons**: Visual indicators for groups, professors, rooms
- **Responsive**: Works with all calendar views

### Backend Services
- **Efficient Queries**: Optimized with selectinload
- **Smart Filtering**: Automatic conflict detection
- **Scope Classification**: Single vs shared logic
- **Type Grouping**: Organized by conflict nature

## 💡 Usage

```jsx
// In your schedule component
<LessonsCalendar
  schedule={schedule}
  onEditLesson={handleEdit}
  onUpdateLesson={updateMutation}
  onCreateLesson={handleCreate}
  refreshTrigger={refreshTrigger}
/>
```

The ConflictsDropdown automatically:
1. Loads conflicts for the current schedule
2. Groups them by scope (single/shared) and type
3. Provides navigation to conflict dates
4. Shows clear visual hierarchy

## 🔧 Configuration

The system automatically detects conflicts based on:
- **Time Overlaps**: Same time slots
- **Resource Conflicts**: Room, professor, or group double-booking
- **Schedule Boundaries**: Cross-schedule detection

All configuration is handled automatically by the backend service layer.