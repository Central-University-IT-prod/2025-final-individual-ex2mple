import DBHelper from "@/helpers/dbHelper.ts";

export const importConfig = async (event: Event, store: string) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const answer = confirm('Все упражнения будут перезаписаны. Продолжить импорт?')
    if (!answer) return;

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async () => {
        try {
            const importedFile = JSON.parse(reader.result as string);

            const exerciseDB = new DBHelper(store);
            await exerciseDB.clearStore()

            for (const row of importedFile) {
                await exerciseDB.addItem(row);
            }

            window.location.reload();
        } catch (error) {
            alert('Ошибка при загрузке файла.');
        }
    };
};
