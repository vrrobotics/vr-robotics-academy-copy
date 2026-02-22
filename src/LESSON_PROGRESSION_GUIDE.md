# 🎮 Candy Crush-Style Lesson Progression Map

## Overview
The Lesson Progression Map transforms the traditional linear lesson view into an engaging, game-like progression system inspired by Candy Crush. Students see lessons as nodes on a map that unlock sequentially as they complete previous lessons.

---

## 📦 Component: `LessonProgressionMap`

### Location
`/src/components/LessonProgressionMap.tsx`

### Features
✨ **Candy Crush-style nodes** with glowing effects  
🎯 **Sequential unlock logic** - complete one lesson to unlock the next  
📊 **Visual progression tracking** with completion stars  
🔗 **Connection lines** showing the learning path  
📱 **Responsive grid layout** (3 columns on desktop, 1 on mobile)  
⭐ **Completion badges** with smooth animations  
📈 **Progress summary** showing overall completion percentage  

---

## 🚀 How to Use

### Basic Implementation
```typescript
import LessonProgressionMap from '@/components/LessonProgressionMap';

export default function StudentDashboard() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    'lesson-1',
    'lesson-2',
  ]);

  return (
    <LessonProgressionMap
      courseId="course-1"
      completedLessons={completedLessons}
      onLessonSelect={(lessonId) => {
        console.log('Selected lesson:', lessonId);
        // Navigate to lesson or show details
      }}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `courseId` | `string` | Yes | The ID of the course to load lessons for |
| `completedLessons` | `string[]` | No | Array of completed lesson IDs |
| `onLessonSelect` | `(lessonId: string) => void` | No | Callback when a lesson is selected |

---

## 🎨 Visual Design

### Node States

#### 1. **Locked Node** (Dimmed)
- Opacity: 50%
- Border: Gray (#404040)
- Background: Gray with low opacity
- User cannot interact
- Shows "Complete previous lesson" hint

#### 2. **Unlocked Node** (Active)
- Glowing effect with animated box-shadow
- Border: Primary color (#FF8C42)
- Background: Primary with transparency
- Hover scale: 1.15x
- Shows lesson number and duration

#### 3. **Completed Node** (Success)
- Checkmark (✓) instead of number
- Completion star (⭐) in top-right corner
- Primary color border and background
- Connection lines are solid (not dashed)
- Smooth spring animation on completion

### Connection Lines
- **Completed path**: Solid orange (#FF8C42)
- **Locked path**: Dashed gray (#404040)
- **Opacity**: 1 for completed, 0.5 for locked

---

## 📊 Data Structure

### Lesson Node Interface
```typescript
interface LessonNode {
  _id: string;
  title?: string;
  description?: string;
  orderNumber?: number;
  estimatedDuration?: string;
  isPublished?: boolean;
  isCompleted?: boolean;
  isUnlocked?: boolean;
}
```

### CMS Collection: `coursemodules`
The component fetches lessons from the `coursemodules` collection:

```typescript
{
  _id: "lesson-1",
  courseId: "course-1",
  title: "Introduction to Robotics",
  description: "Learn the basics of robot assembly and programming",
  orderNumber: 1,
  estimatedDuration: "5 min",
  isPublished: true
}
```

---

## 🔄 Unlock Logic

### Sequential Unlock System
1. **First lesson** is always unlocked
2. **Subsequent lessons** unlock when the previous lesson is completed
3. **Completed lessons** show a checkmark and star
4. **Locked lessons** are dimmed and non-interactive

### Example Flow
```
Lesson 1 (Unlocked) → Complete → Lesson 2 (Unlocked) → Complete → Lesson 3 (Unlocked)
                                                                    ↓
                                                              Lesson 4 (Locked)
```

---

## 🎯 Lesson Details Modal

When a student clicks on an unlocked lesson, a modal appears showing:

### Modal Content
- **Lesson Number**: Sequential position
- **Title**: Lesson name
- **Description**: Lesson overview
- **Duration**: Estimated time to complete
- **Status**: "Completed ✓" or "In Progress"
- **Action Button**: "Review Lesson" or "Start Lesson"

### Modal Features
- Backdrop blur effect
- Smooth scale-in animation
- Click outside to close
- Gradient button with hover effects

---

## 📈 Progress Summary

### Summary Stats
Shows at the bottom of the progression map:

| Stat | Description |
|------|-------------|
| **Total Lessons** | Number of lessons in the course |
| **Completed** | Number of completed lessons |
| **Progress %** | Percentage of course completed |
| **Progress Bar** | Animated bar showing visual progress |

### Progress Bar Animation
- Animates from 0% to current progress on mount
- Duration: 0.8 seconds
- Easing: easeOut
- Gradient: Primary to Secondary color

---

## 🎬 Animations

### Node Animations
```typescript
// Entrance animation
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ delay: index * 0.1 }}

// Hover effect
whileHover={{ scale: 1.15 }}

// Tap effect
whileTap={{ scale: 0.95 }}
```

### Glow Effect
```typescript
// Pulsing glow on unlocked nodes
animate={{
  boxShadow: [
    '0 0 15px rgba(255, 140, 66, 0.4)',
    '0 0 30px rgba(255, 140, 66, 0.7)',
    '0 0 15px rgba(255, 140, 66, 0.4)',
  ],
}}
transition={{ duration: 2, repeat: Infinity }}
```

### Completion Star
```typescript
// Spring animation when lesson completes
initial={{ scale: 0, rotate: -180 }}
animate={{ scale: 1, rotate: 0 }}
transition={{ type: 'spring', stiffness: 200 }}
```

---

## 🔧 Customization

### Change Grid Layout
Edit the grid columns in `LessonProgressionMap.tsx`:
```typescript
const gridCols = 3; // Change to 2, 4, or 5
```

### Adjust Animation Timing
```typescript
// Stagger delay between nodes
transition={{ delay: index * 0.1 }} // Change 0.1 to desired value

// Glow animation speed
transition={{ duration: 2, repeat: Infinity }} // Change 2 to desired duration
```

### Customize Colors
Edit the Tailwind classes:
```typescript
// Primary color (orange)
className="border-primary" // Change to any Tailwind color

// Background gradient
className="bg-gradient-to-br from-primary/40 to-primary/20"
```

### Change Node Size
```typescript
// Current: 7rem (112px)
className="w-28 h-28" // Change to w-32 h-32, w-24 h-24, etc.
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 1 column, smaller nodes
- **Tablet**: 2 columns
- **Desktop**: 3 columns (default)

### Mobile Optimizations
- Reduced node size on small screens
- Larger touch targets (minimum 44x44px)
- Simplified modal on mobile
- Full-width progress bar

---

## 🔌 Integration with Student Dashboard

### Current Implementation
The `StudentDashboardPage` now includes the lesson progression map:

```typescript
<LessonProgressionMap
  courseId="course-1"
  completedLessons={completedLessons}
  onLessonSelect={(lessonId) => {
    console.log('Selected lesson:', lessonId);
  }}
/>
```

### State Management
```typescript
const [completedLessons, setCompletedLessons] = useState<string[]>([
  'lesson-1',
  'lesson-2',
]);
```

### Updating Completed Lessons
```typescript
// When a lesson is completed
setCompletedLessons([...completedLessons, 'lesson-3']);
```

---

## 🎓 Learning Experience

### Student Journey
1. **View Map**: Student sees all lessons as nodes
2. **See Progress**: First lesson is unlocked, others are locked
3. **Complete Lesson**: Student completes first lesson
4. **Unlock Next**: Second lesson automatically unlocks with animation
5. **Progress Tracking**: Star appears on completed lesson
6. **Repeat**: Continue through all lessons

### Gamification Elements
- ⭐ Completion stars for visual feedback
- 🎯 Clear progression path
- 🔓 Unlock mechanics for motivation
- 📊 Progress percentage for achievement
- ✨ Smooth animations for satisfaction

---

## 🐛 Troubleshooting

### Lessons Not Loading
**Problem**: No lessons appear on the map  
**Solution**: 
1. Check that `courseId` prop is correct
2. Verify lessons exist in `coursemodules` collection
3. Ensure `isPublished` is `true` for lessons
4. Check browser console for errors

### Unlock Logic Not Working
**Problem**: All lessons are locked or all are unlocked  
**Solution**:
1. Verify `completedLessons` array is passed correctly
2. Check that lesson IDs match exactly
3. Ensure first lesson has `orderNumber: 1`

### Animations Not Smooth
**Problem**: Animations are choppy or laggy  
**Solution**:
1. Reduce number of lessons (max 12-15 recommended)
2. Disable glow effect on lower-end devices
3. Use `will-change: transform` in CSS for performance

---

## 📚 Related Components

- **GamifiedMissionMap** - Similar component for missions
- **StudentDashboardPage** - Parent component
- **XPLevelingSystem** - Complements progression tracking
- **BadgesDisplay** - Shows achievements

---

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Difficulty levels (Easy, Medium, Hard)
- [ ] Time-based challenges
- [ ] Bonus lessons and side quests
- [ ] Leaderboard integration
- [ ] Peer comparison (optional)
- [ ] Lesson recommendations based on performance
- [ ] Video preview on hover
- [ ] Sound effects for completion

### Phase 3 Features
- [ ] Branching lesson paths
- [ ] Skill trees
- [ ] Cooperative lessons
- [ ] Timed speedrun challenges
- [ ] Lesson remixes and variations

---

## 📞 Support

For questions or issues:
1. Check the component documentation above
2. Review the implementation in `StudentDashboardPage.tsx`
3. Refer to the CMS collection structure
4. Check Framer Motion docs for animation customization

---

**Feature Status**: ✅ Complete  
**Last Updated**: November 28, 2025  
**Version**: 1.0.0
