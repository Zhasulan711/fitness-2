export type WorkoutCategory = "Back" | "Arms" | "Legs";

export type Workout = {
  id: string;
  category: WorkoutCategory;
  title: string;
  videos: string[];
  description: string;
  sets: number;
  weight: number | "custom";
  equipmentImages: string[];
};
