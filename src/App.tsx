import { Navigate, Route, Routes } from "react-router-dom";
import { ChatPage } from "./pages/ChatPage";
import { LoginPage } from "./pages/LoginPage";

import "./styles/base.css";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/chat" replace />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/chat" element={<ChatPage />} />
			<Route
				path="*"
				element={
					<div className="not-found">
						<h1>Not found</h1>
					</div>
				}
			/>
		</Routes>
	);
}