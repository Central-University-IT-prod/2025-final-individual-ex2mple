export function calculateGoal(
    targetType: string,
    weight: number,
    height: number,
    goal: string,
    difficulty: "Простое" | "Среднее" | "Сложное"
): number {
    const difficultyFactors = {
        "Простое": 1.0,
        "Среднее": 1.1,
        "Сложное": 1.2
    };
    const difficultyFactor = difficultyFactors[difficulty];

    if (targetType === "Время") {
        return Math.round((80 + 0.2 * weight) * (goal === "Похудеть" ? 1.2 : 1.0) * difficultyFactor);
    }
    if (targetType === "Повторения") {
        return Math.round((12 + 0.1 * weight) * (goal === "Похудеть" ? 1.3 : 1.0) * (1.2 - 0.1 * difficultyFactor));
    }
    if (targetType === "Расстояние") {
        return Math.round((height / 100) * (1 + 0.05 * weight) * (goal === "Похудеть" ? 1.3 : 1.0) / difficultyFactor);
    }
    if (targetType === "Вес") {
        return Math.round((0.7 * weight) * (goal === "Накачаться" ? 1.1 : 0.8) * difficultyFactor);
    }
    return 0;
}