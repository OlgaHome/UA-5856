// Завдання 1. Сортування бульбашкою
function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let swapped = false;

        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;

                swapped = true;
            }
        }

        // Якщо замін не було — масив уже відсортований
        if (!swapped) {
            break;
        }
    }

    return arr;
}

// Завдання 2. Сортування вибором
function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            const temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }

    return arr;
}

// Завдання 3. Сортування вставками
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const current = arr[i];
        let j = i - 1;

        // Зсуваємо більші елементи праворуч
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = current;
    }

    return arr;
}

// Перевірка роботи
const numbers = [7, 3, -2, 8, 3, 0, 1];

// Передаємо окрему копію масиву кожній функції
console.log("Бульбашкою:", bubbleSort([...numbers]));
console.log("Вибором:", selectionSort([...numbers]));
console.log("Вставками:", insertionSort([...numbers]));

// Очікуваний результат кожного сортування:
// [-2, 0, 1, 3, 3, 7, 8]