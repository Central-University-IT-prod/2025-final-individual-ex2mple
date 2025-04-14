export interface BaseEntity {
  id?: number;
}

export interface Workout {
  id?: number;
  name: string;
  skipped: number;
  finished: number;
  duration: number;
  reps: number;
  date: Date
}

export interface User {
  id?: number;
  name: string;
  height: number;
  weight: number;
  goal: string;
  coins: number;

  // В список идет index последнего открытого элемента из категории.
  inventory: number[];

  // В список идет color примененного предмета для категории.
  equippedItems: string[];

  createdAt: string;
}

export interface Exercise {
  id?: number;
  name: string;
  description: string;
  images: string[];
  difficulty: "Простое" | "Среднее" | "Сложное";
  equipment: string;
  muscleGroup: string[];
  type: string;
}

export interface ProgramExercise {
  exercise: Exercise;
  goalType: 'Время' | 'Повторения' | 'Расстояние' | 'Вес' | '';
  goal: number;
}

export interface Program {
  id?: number;
  name: string;
  description: string;
  exercises: ProgramExercise[];
}