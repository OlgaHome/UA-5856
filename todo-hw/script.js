// Єдиний глобальний масив завдань
const taskList = [];

// Поточні дата і час у форматі YYYY-MM-DD HH:mm
function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Клас одного завдання
class ToDoItem {
    constructor(title) {
        this.title = title;
        this.status = "todo";
        this.startDate = getCurrentDateTime();
        this.endDate = "";
    }

    complete() {
        // Повторний клік не змінює дату виконання
        if (this.status === "done") {
            return;
        }

        this.status = "done";
        this.endDate = getCurrentDateTime();
    }
}

// Клас керування додатком
class ToDoApp {
    constructor() {
        this.form = document.getElementById("task-form");
        this.input = document.getElementById("task-input");
        this.list = document.getElementById("task-list");
        this.emptyMessage = document.getElementById("empty-message");

        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.addTask();
        });

        this.render();
    }

    addTask() {
        const title = this.input.value.trim();

        // Не додаємо порожній текст або самі пробіли
        if (title === "") {
            this.input.value = "";
            this.input.focus();
            return;
        }

        const task = new ToDoItem(title);
        taskList.push(task);

        this.input.value = "";
        this.input.focus();

        this.render();
    }

    completeTask(task) {
        task.complete();
        this.render();
    }

    render() {
        this.list.replaceChildren();
        this.emptyMessage.hidden = taskList.length > 0;

        for (const task of taskList) {
            const button = document.createElement("button");
            button.type = "button";
            button.className =
                "list-group-item list-group-item-action text-start";

            const title = document.createElement("span");
            title.className = "d-block";
            title.textContent = task.title;

            if (task.status === "done") {
                title.classList.add(
                    "text-decoration-line-through",
                    "text-muted"
                );
                button.disabled = true;
            }

            const dates = document.createElement("small");
            dates.className = "d-block text-muted mt-1";
            dates.textContent = `Створено: ${task.startDate}`;

            if (task.status === "done") {
                dates.textContent += ` | Виконано: ${task.endDate}`;
            }

            button.append(title, dates);

            button.addEventListener("click", () => {
                this.completeTask(task);
            });

            this.list.append(button);
        }
    }
}

const app = new ToDoApp();