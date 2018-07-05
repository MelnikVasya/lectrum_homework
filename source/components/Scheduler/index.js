// Core
import React, { Component } from "react";
import { api } from "REST";

// Instruments
import Styles from "./styles.m.css";
import { sortTasksByGroup, filterTasks } from "instruments/helpers";

// Components
import Spinner from "components/Spinner";
import Task from "components/Task";
import Checkbox from "theme/assets/Checkbox";

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  "",
        tasksFilter:     "",
        isTasksFetching: false,
        tasks:           [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _updateTasksFilter = (event) => {
        const tasksFilter = event.target.value.toLocaleLowerCase();

        this.setState({ tasksFilter });
    };

    _updateNewTaskMessage = (event) => {
        const { value: newTaskMessage } = event.target;

        this.setState({ newTaskMessage });
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    };

    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({ isTasksFetching });
    };

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);

        try {
            const tasks = await api.fetchTasks();

            this.setState({ tasks });
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _createTaskAsync = async (event) => {
        event.preventDefault();

        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        }

        this._setTasksFetchingState(true);

        try {
            const newTask = await api.createTask(newTaskMessage);

            this.setState(({ tasks }) => ({
                tasks:          [newTask, ...tasks],
                newTaskMessage: "",
            }));
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateTaskAsync = async (taskParams) => {
        this._setTasksFetchingState(true);

        try {
            const updatedTask = await api.updateTask(taskParams);

            this.setState(({ tasks }) => ({
                tasks: tasks.map(
                    (task) => task.id === updatedTask.id ? updatedTask : task
                ),
            }));
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _removeTaskAsync = async (taskId) => {
        this._setTasksFetchingState(true);

        try {
            await api.removeTask(taskId);

            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== taskId),
            }));
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _completeAllTasksAsync = async () => {
        const { tasks } = this.state;
        const incompleteTasks = tasks.filter((task) => !task.completed);

        if (incompleteTasks.length === 0) {
            return null;
        }

        this._setTasksFetchingState(true);

        try {
            await api.completeAllTasks(incompleteTasks);

            this.setState({
                tasks: tasks.map((task) => ({ ...task, completed: true })),
            });
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    tasksJSX = () => {
        const { tasks, tasksFilter } = this.state;
        const sortedTasks = sortTasksByGroup(tasks);
        const filteredTasks = filterTasks(sortedTasks, tasksFilter);

        return filteredTasks.map((task) => (
            <Task
                key = { task.id }
                { ...task }
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
            />
        ));
    };

    render () {
        const { newTaskMessage, tasksFilter, isTasksFetching } = this.state;

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isTasksFetching } />
                    <header>
                        <h1 className = 'test'>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = 'createTask'
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = 'overlay'>
                            <ul>{this.tasksJSX()}</ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { this._getAllCompleted() }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
