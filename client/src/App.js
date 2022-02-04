import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Room from "./components/Room";
import Profile from "./components/Profile";

function App() {
	const token = localStorage.getItem("token");
	
	return (
		<Routes>
			{token && <Route path="/" exact element={<Main />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/profile" exact element={<Profile />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/room/:id" element={<Room />} />
		</Routes>
	);
}

export default App;