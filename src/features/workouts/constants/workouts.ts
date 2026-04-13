import type { Workout } from "../types/workout";

export const WORKOUTS: Workout[] = [
  {
    id: "w-1",
    category: "Back",
    title: "Lat Pulldown",
    videos: ["/videos/test-1.mp4", "/videos/test-4.mp4"],
    description:
      "Sit tall, brace your core, and pull the bar to your upper chest with control. Pause briefly, then return with a full stretch at the top.",
    sets: 4,
    weight: 45,
    equipmentImages: ["/next.svg"],
  },
  {
    id: "w-2",
    category: "Arms",
    title: "Cable Curl",
    videos: ["/videos/test-2.mp4", "/videos/test-5.mp4"],
    description:
      "Keep elbows pinned to your sides. Curl smoothly without swinging your torso. Lower slowly for 2–3 seconds each rep.",
    sets: 3,
    weight: "custom",
    equipmentImages: ["/vercel.svg"],
  },
  {
    id: "w-3",
    category: "Legs",
    title: "Goblet Squat",
    videos: ["/videos/test-3.mp4", "/videos/test-1.mp4"],
    description:
      "Hold the weight at your chest, sit your hips back and down, then drive up through mid-foot while keeping ribs stacked over hips.",
    sets: 4,
    weight: 24,
    equipmentImages: ["/globe.svg"],
  },
  {
    id: "w-4",
    category: "Back",
    title: "Single-Arm Row",
    videos: ["/videos/test-4.mp4", "/videos/test-2.mp4"],
    description:
      "Hinge at the hips, keep your spine neutral, and row the elbow along your ribcage. Avoid rotating your torso for momentum.",
    sets: 3,
    weight: 30,
    equipmentImages: ["/window.svg"],
  },
  {
    id: "w-5",
    category: "Arms",
    title: "Triceps Pushdown",
    videos: ["/videos/test-5.mp4", "/videos/test-3.mp4"],
    description:
      "Lock shoulders down, elbows fixed at your sides, and extend fully without flaring wrists. Control the return.",
    sets: 3,
    weight: 20,
    equipmentImages: ["/file.svg"],
  },
];

export function getWorkoutById(id: string): Workout | undefined {
  return WORKOUTS.find((w) => w.id === id);
}
