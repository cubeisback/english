"use client";
import { useState, useEffect } from "react";
import { tours } from "./data/questions";
import QuizBoard from "./components/QuizBoard";
import SettingsPanel from "./components/SettingsPanel";

const SETTINGS_KEY = "quiz_settings";

export default function Page() {
	const [phase, setPhase] = useState("start"); // start | roundIntro | questions | finished
	const [tourIndex, setTourIndex] = useState(0);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [settings, setSettings] = useState({
		questionTime: 60000,
		modalCloseTime: 2000,
		roundTransitionTime: 2000,
	});

	// Загружаем настройки из localStorage
	useEffect(() => {
		const saved = localStorage.getItem(SETTINGS_KEY);
		if (saved) setSettings(JSON.parse(saved));
	}, []);

	const handleSettingsChange = (newSettings) => {
		setSettings(newSettings);
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
	};

	const startGame = () => setPhase("roundIntro");
	const startQuestions = () => setPhase("questions");

	const nextRound = () => {
		if (tourIndex + 1 < tours.length) {
			setTourIndex(tourIndex + 1);
			setPhase("roundIntro");
		} else {
			setPhase("finished");
		}
	};

	// useEffect для перехода с Round Intro → Questions
	useEffect(() => {
		let timer;
		if (phase === "roundIntro") {
			timer = setTimeout(startQuestions, settings.roundTransitionTime);
		}
		return () => clearTimeout(timer);
	}, [phase, tourIndex, settings.roundTransitionTime]);

	// --- Рендер ---
	if (phase === "start") {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center relative">
				<button
					onClick={startGame}
					className="px-6 py-3 bg-black text-white rounded-xl mb-6"
				>
					Начать игру
				</button>

				<button
					onClick={() => setSettingsOpen(!settingsOpen)}
					className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg absolute bottom-10 right-10"
				>
					⚙️ Настройки
				</button>

				{settingsOpen && (
					<SettingsPanel
						settings={settings}
						onChange={handleSettingsChange}
						onClose={() => setSettingsOpen(false)}
					/>
				)}
			</div>
		);
	}

	if (phase === "roundIntro") {
		return (
			<div className="min-h-screen flex items-center justify-center text-3xl font-bold">
				Round {tourIndex + 1}
			</div>
		);
	}

	if (phase === "questions") {
		return (
			<QuizBoard
				key={tours[tourIndex].id}
				tour={tours[tourIndex]}
				settings={settings}
				onFinish={nextRound}
				isLast={tourIndex === tours.length - 1}
			/>
		);
	}

	if (phase === "finished") {
		return (
			<div className="min-h-screen flex items-center justify-center text-3xl font-bold">
				Викторина завершена 🎉
			</div>
		);
	}
}
