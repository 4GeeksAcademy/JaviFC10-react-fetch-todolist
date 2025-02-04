import React, { useEffect, useState } from "react";

export const FormToDo = () => {
    const url = "https://playground.4geeks.com/todo";
    const [newTask, setNewTask] = useState('');
    const [taskList, setTaskList] = useState([]);

    const handleNewTask = (event) => {
        setNewTask(event.target.value);
    };

    const handleNewTaskSubmit = (event) => {
        event.preventDefault();
        if (newTask.trim() === "") return;

        const updatedTasks = [...taskList, { label: newTask }];
        setTaskList(updatedTasks);
        setNewTask('');

        updateTasksOnAPI(updatedTasks);
    };

    const getToDos = async () => {
        const uri = `${url}/users/Javi_Fuentes`;
        const options = { method: 'GET' };
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log("error: ", response.status, response.statusText);
            return;
        }
        const data = await response.json();
        setTaskList(data.todos);
    };

    const updateTasksOnAPI = async (tasks) => {
        const uri = `${url}/users/Javi_Fuentes`;
        const options = {
            method: 'PUT',
            body: JSON.stringify({ todos: tasks }),
            headers: { "Content-Type": "application/json" }
        };
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log("Error al actualizar la API", response.statusText);
        }
    };

    const deleteAllTasks = async () => {
        setTaskList([]);

        const uri = `${url}/users/Javi_Fuentes`;
        const options = {
            method: 'PUT',
            body: JSON.stringify({ todos: [] }),
            headers: { "Content-Type": "application/json" }
        };
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log("Error al borrar todas las tareas", response.statusText);
        }
    };

    useEffect(() => { getToDos(); }, []);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <form onSubmit={handleNewTaskSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newTask}
                                        onChange={handleNewTask}
                                        placeholder="Enter new task"
                                    />
                                </div>
                            </form>
                            <ul className="list-group">
                                {taskList.map((task, index) => (
                                    <li className="list-group-item" key={index}>
                                        {task.label}
                                    </li>
                                ))}
                            </ul>

                            {taskList.length > 0 && (
                                <div className="text-center mt-3">
                                    <button className="btn btn-danger" onClick={deleteAllTasks}>
                                        Delete tasks
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
