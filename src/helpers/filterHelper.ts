export function filterItems(items: object[], sortCriteria: { [key: string]: any }) {
    return [...items]
        .filter((item: any) => {
            let isContain: boolean[] = []
            for (let [key, value] of Object.entries(sortCriteria)) {
                if (value === '' || (Array.isArray(value) && value.every(v => v === ''))) continue
                if (value instanceof Array) {
                    if (item[key] instanceof Array) {
                        isContain.push(item[key].some((item: string) => value.includes(item)));
                    } else {
                        isContain.push(value.includes(item[key]));
                    }

                } else {
                    isContain.push(item[key].toLowerCase().includes(value.toLowerCase()))
                }
            }
            return isContain.every(state => state) || !isContain
        })
}
