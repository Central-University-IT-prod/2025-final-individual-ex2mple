import type {Exercise} from "@/types.ts";

export function genTags(exercise: Exercise): string {
    const muscleGroup = exercise?.muscleGroup ? exercise?.muscleGroup[0] : null
    const tags = [muscleGroup, exercise?.difficulty, exercise?.type, exercise?.equipment].filter(tag => tag)
    return tags.join(' • ')
}

export function getTimeDelta(deltaMs: number): string {
    if (deltaMs < 0) return "Ошибка: некорректное время";

    const totalSeconds = Math.floor(deltaMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}