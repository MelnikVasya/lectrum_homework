// Core
import React, { PureComponent } from "react";

// Instruments
import Styles from "./styles.m.css";
import cx from "classnames";

// Components
import Star from "theme/assets/Star";
import Edit from "theme/assets/Edit";
import Remove from "theme/assets/Remove";
import Checkbox from "theme/assets/Checkbox";

export default class Task extends PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            isTaskEditing: false,
            newMessage:    props.message,
        };
    }

    taskInput = React.createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskEditingState = (value) => {
        const { isTaskEditing: prevIsTaskEditing } = this.state;

        if (!prevIsTaskEditing && value) {
            this.taskInput.current.disabled = !value;
            this.taskInput.current.focus();
        }

        this.setState({ isTaskEditing: value });
    };

    _updateNewTaskMessage = (event) => {
        const { value: newMessage } = event.target;

        this.setState({ newMessage });
    };

    _updateTask = () => {
        this._setTaskEditingState(false);

        const { message, _updateTaskAsync } = this.props;
        const { newMessage } = this.state;

        if (newMessage === message) {
            return null;
        }

        const task = this._getTaskShape({ message: newMessage });

        _updateTaskAsync(task);
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }

        this._setTaskEditingState(true);
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;
        const { key: eventKey } = event;

        if (!newMessage) {
            return null;
        }

        if (eventKey === "Enter") {
            this._updateTask();
        } else if (eventKey === "Escape") {
            this._cancelUpdatingTaskMessage();
        }
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;
        const completedTask = this._getTaskShape({ completed: !completed });

        _updateTaskAsync(completedTask);
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;
        const completedTask = this._getTaskShape({ favorite: !favorite });

        _updateTaskAsync(completedTask);
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;

        this.setState({ isTaskEditing: false, newMessage: message });
    };

    render () {
        const { completed, favorite } = this.props;
        const { isTaskEditing, newMessage } = this.state;

        const taskStyles = cx({
            [Styles.task]:      true,
            [Styles.completed]: completed,
        });

        return (
            <li className = { taskStyles }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        height = { 25 }
                        width = { 25 }
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
