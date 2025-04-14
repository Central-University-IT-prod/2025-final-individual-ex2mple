import type {Exercise, ProgramExercise} from "@/types.ts";
import {filterItems} from "@/helpers/filterHelper.ts";

export function autoSelectExercises(tags: { [key: string]: any }, exercises: Exercise[], count: number = 5) {
    const matchedExercises = filterItems(exercises, tags) as Exercise[];

    const shuffledExercises = matchedExercises.sort(() => Math.random() - 0.5);
    const selectedExercises = shuffledExercises.slice(0, count);
    const result: ProgramExercise[] = [];

    selectedExercises.forEach(exercise => {
        result.push({
            exercise: exercise,
            goalType: '',
            goal: 0
        });
    });

    return result;
}
