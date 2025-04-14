import DBHelper from "@/helpers/dbHelper.ts";

export async function exportConfig(store: string) {
    const exerciseDB = new DBHelper(store);
    const exercises = await exerciseDB.getAllItems();

    if (exercises.length === 0) {
        console.warn("Нет данных для экспорта!");
        return;
    }

    const json = JSON.stringify(exercises, null, 2);
    const blob = new Blob([json], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${store}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}