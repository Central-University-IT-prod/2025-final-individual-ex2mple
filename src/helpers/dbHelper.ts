import type { BaseEntity } from '@/types.ts'

const DB_NAME: string = 'TrainingTrackerDB'
const DB_VERSION: number = 2
const stores = ["users", "exercises", "workouts", "programs"];


class DBHelper<T extends BaseEntity> {
  private db: IDBDatabase | null = null
  private readonly storeName: string

  constructor(storeName: string) {
    this.storeName = storeName
  }

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: "id", autoIncrement: true });
          }
        });
      }
      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve(this.db)
      }

      request.onerror = () => reject('Ошибка при открытии IndexedDB')
    })
  }

  async addItem(item: Omit<T, 'id'>): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const db = await this.openDB()
      const tx = db.transaction(this.storeName, 'readwrite')
      const store = tx.objectStore(this.storeName)
      const request = store.add(item)

      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject('Ошибка при добавлении элемента')
    })
  }

  async getItem(id: number): Promise<T | null> {
    return new Promise(async (resolve, reject) => {
      const db = await this.openDB()
      const tx = db.transaction(this.storeName, 'readonly')
      const store = tx.objectStore(this.storeName)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject('Ошибка при получении элемента')
    })
  }

  async getLastItem(): Promise<T | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.openDB();
        const tx = db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        const request = store.openCursor(null, "prev");

        request.onsuccess = () => {
          const cursor = request.result;
          resolve(cursor ? cursor.value : null);
        };

        request.onerror = () => reject("Ошибка при получении последнего элемента");
      } catch (error) {
        reject(`Ошибка при работе с IndexedDB: ${error}`);
      }
    });
  }

  async getAllItems(): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      const db = await this.openDB()
      const tx = db.transaction(this.storeName, 'readonly')
      const store = tx.objectStore(this.storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result as T[])
      request.onerror = () => reject('Ошибка при получении всех элементов')
    })
  }

  async updateItem(item: T): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const db = await this.openDB()
      const tx = db.transaction(this.storeName, 'readwrite')
      const store = tx.objectStore(this.storeName)
      const request = store.put(item)

      request.onsuccess = () => resolve(true)
      request.onerror = () => reject('Ошибка при обновлении элемента')
    })
  }

  async deleteItem(id: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const db = await this.openDB()
      const tx = db.transaction(this.storeName, 'readwrite')
      const store = tx.objectStore(this.storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve(true)
      request.onerror = () => reject('Ошибка при удалении элемента')
    })
  }

  async clearStore(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const db = await this.openDB()
      const tx = db.transaction(this.storeName, 'readwrite')
      const store = tx.objectStore(this.storeName)
      const request = store.clear()

      request.onsuccess = () => resolve(true)
      request.onerror = () => reject('Ошибка при очистке хранилища')
    })
  }
}

export default DBHelper
