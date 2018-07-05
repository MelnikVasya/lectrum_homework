import { MAIN_URL, TOKEN } from "./config";

const headers = {
    "Content-Type": "application/json",
    Authorization:  TOKEN,
};

export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method: "GET",
            headers,
        });

        if (response.status !== 200) {
            throw new Error("Can't fetch all tasks");
        }

        const { data } = await response.json();

        return data;
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method: "POST",
            headers,
            body:   JSON.stringify({ message }),
        });

        if (response.status !== 200) {
            throw new Error("Can't create task");
        }

        const { data } = await response.json();

        return data;
    },

    async updateTask (task) {
        const response = await fetch(MAIN_URL, {
            method: "PUT",
            headers,
            body:   JSON.stringify([task]),
        });

        if (response.status !== 200) {
            throw new Error("Can't update task");
        }

        const { data } = await response.json();

        return data[0];
    },

    async removeTask (taskId) {
        const response = await fetch(`${MAIN_URL}/${taskId}`, {
            method: "DELETE",
            headers,
        });

        if (response.status !== 204) {
            throw new Error("Can't remove task");
        }
    },

    async completeTask (task) {
        const response = await fetch(MAIN_URL, {
            method: "PUT",
            headers,
            body:   JSON.stringify([{ ...task, completed: true }]),
        });

        if (response.status !== 200) {
            throw new Error("Can't complete task");
        }

        const { data } = await response.json();

        return data;
    },

    async completeAllTasks (tasks) {
        await Promise.all(tasks.map((task) => this.completeTask(task)));
    },
};
