import React, { useEffect, useState } from "react";

export const FormToDo = () => {
    const url = "https://playground.4geeks.com/todo";
    const [newTask, setNewTask] = useState('');
    const [taskList, setTaskList] = useState([]);
    const handleNewTask = (event) => {
        setNewTask(event.target.value);
    };

    const handleNewTaskSubmit = async (event) => {
        event.preventDefault();
        if (newTask.trim() === "") return;
        const newTaskObject = { id: Date.now(), label: newTask };
        setTaskList(prevTasks => [...prevTasks, newTaskObject]);
        setNewTask('');

        try {
            const response = await fetch(`${url}/users/Javi_Fuentes/todos`, {
                method: 'POST',
                body: JSON.stringify({ label: newTask }),
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                console.log("Error al agregar tarea a la API:", response.statusText);
                return;
            }

            getToDos();
        } catch (error) {
            console.log("Error en la petición:", error);
        }
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

    const deleteTask = async (taskId) => {

        setTaskList(prevTasks => prevTasks.filter(task => task.id !== taskId));

        if (String(taskId).length > 10) {
            return;
        }

        try {
            const response = await fetch(`${url}/todos/${taskId}`, { method: 'DELETE' });

            if (!response.ok) {
                console.log("Error al borrar la tarea de la API:", response.statusText);
            }

            const updatedAPIList = await fetch(`${url}/users/Javi_Fuentes`);
            if (updatedAPIList.ok) {
                const data = await updatedAPIList.json();
                setTaskList(prevTasks => [
                    ...prevTasks.filter(task => String(task.id).length > 10),
                    ...data.todos
                ]);
            }
        } catch (error) {
            console.log("Error en la petición:", error);
        }
    };


    const deleteAllTasks = async () => {
        const uri = `${url}/users/Javi_Fuentes`;
        const options = {
            method: 'DELETE',
        };
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log("Error al borrar todas las tareas", response.statusText)
        };
        setTaskList([]);
    }


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
                                    <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                                        {task.label}
                                        <button className="btn btn-white btn-sm px-2 py-1 ms-auto text-white"
                                            onClick={() => deleteTask(task.id)}>
                                            ✖
                                        </button>

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
