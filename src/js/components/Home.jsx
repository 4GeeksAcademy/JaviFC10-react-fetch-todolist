import React from "react";
import { FormToDo } from "./FormToDo.jsx";


//create your first component
const Home = () => {
	return (
		<div className="text-center">
			<h1>Task List de Javi Fuentes</h1>
			<FormToDo />
		</div>
	);
};

export default Home;