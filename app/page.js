"use client";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { tours } from "./data/questions";
import QuizBoard from "./components/QuizBoard";
import SettingsPanel from "./components/SettingsPanel";
import TimelineRound from "./components/TimelineRound";
import ScoreBoard from "./components/ScoreBoard";

const SETTINGS_KEY = "quiz_settings";

export default function Page() {
	const [phase, setPhase] = useState("start");
	const [tourIndex, setTourIndex] = useState(0);
	const [settingsOpen, setSettingsOpen] = useState(false);

	const defaultSettings = {
		questionTime: 60000,
		roundTransitionTime: 2000,
		team1: "Team 1",
		team2: "Team 2",
		team3: "Team 3",
		team1Color: "#ef4444",
		team2Color: "#3b82f6",
		team3Color: "#22c55e",
	};

	const [settings, setSettings] = useState(defaultSettings);
	const [teams, setTeams] = useState([]);

	// ================= LOAD SETTINGS =================

	useEffect(() => {
		const saved = localStorage.getItem(SETTINGS_KEY);
		const merged = saved
			? { ...defaultSettings, ...JSON.parse(saved) }
			: defaultSettings;

		setSettings(merged);

		setTeams([
			{ name: merged.team1, score: 0, color: merged.team1Color },
			{ name: merged.team2, score: 0, color: merged.team2Color },
			{ name: merged.team3, score: 0, color: merged.team3Color },
		]);

		localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
	}, []);

	// ================= SETTINGS CHANGE =================

	const handleSettingsChange = (newSettings) => {
		setSettings(newSettings);
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));

		setTeams([
			{
				name: newSettings.team1,
				score: 0,
				color: newSettings.team1Color,
			},
			{
				name: newSettings.team2,
				score: 0,
				color: newSettings.team2Color,
			},
			{
				name: newSettings.team3,
				score: 0,
				color: newSettings.team3Color,
			},
		]);
	};

	// ================= SCORE =================

	const getRoundPoints = () => {
		if (tourIndex === 2) return 3;
		if (tourIndex === 3) return 5;
		return 1;
	};

	const addPoints = (i) => {
		const pts = getRoundPoints();
		setTeams((prev) =>
			prev.map((t, idx) =>
				idx === i ? { ...t, score: t.score + pts } : t,
			),
		);
	};

	const removePoints = (i) => {
		const pts = getRoundPoints();
		setTeams((prev) =>
			prev.map((t, idx) =>
				idx === i ? { ...t, score: Math.max(0, t.score - pts) } : t,
			),
		);
	};

	// ================= GAME FLOW =================

	const startGame = () => {
		setTourIndex(0);
		setPhase("roundIntro");
	};

	const nextRound = () => {
		if (tourIndex + 1 < tours.length) {
			setTourIndex((prev) => prev + 1);
			setPhase("roundIntro");
		} else {
			setPhase("finished");
		}
	};

	// ================= ROUND INTRO TIMER =================

	useEffect(() => {
		if (phase === "roundIntro") {
			const timer = setTimeout(() => {
				setPhase("questions");
			}, settings.roundTransitionTime);
			return () => clearTimeout(timer);
		}
	}, [phase, tourIndex, settings.roundTransitionTime]);

	// ================= START SCREEN =================

	if (phase === "start") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-sky-100">
				<div
					onClick={startGame}
					className="text-6xl cursor-pointer text-green-700"
				>
					Start Game
				</div>

				<button
					onClick={() => setSettingsOpen(!settingsOpen)}
					className="absolute bottom-10 right-10 bg-black text-white px-4 py-2 rounded-full"
				>
					⚙
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

	// ================= ROUND INTRO (ВОТ ЭТО ИСПРАВЛЯЕТ БАГ) =================

	if (phase === "roundIntro") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-sky-100 text-6xl font-bold">
				Round {tourIndex + 1}
			</div>
		);
	}

	// ================= QUESTIONS =================

	if (phase === "questions") {
		return (
			<>
				<ScoreBoard
					teams={teams}
					addPoints={addPoints}
					removePoints={removePoints}
				/>

				{tours[tourIndex].type === "timeline" ? (
					<TimelineRound
						tour={tours[tourIndex]}
						onFinish={nextRound}
					/>
				) : (
					<QuizBoard
						key={tours[tourIndex].id}
						tour={tours[tourIndex]}
						settings={settings}
						onFinish={nextRound}
					/>
				)}
			</>
		);
	}

	// ================= FINAL =================

	if (phase === "finished") {
		const maxScore = Math.max(...teams.map((t) => t.score));

		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
				<Confetti />

				<div className="text-7xl animate-bounce mb-8">🏆</div>
				<h1 className="text-5xl mb-6">Game Over</h1>

				{teams.map((t, i) => {
					const isWinner = t.score === maxScore;
					return (
						<div
							key={i}
							className={`text-3xl font-bold px-6 py-3 mb-4 rounded-xl transition-all duration-500`}
							style={{
								backgroundColor: t.color,
								opacity: isWinner ? 1 : 0.6,
								transform: isWinner ? "scale(1.1)" : "scale(1)",
							}}
						>
							{isWinner ? "🏆 " : ""}
							{t.name} — {t.score} pts
						</div>
					);
				})}

				<button
					onClick={() => setPhase("start")}
					className="mt-10 bg-white text-black px-8 py-3 rounded-xl"
				>
					Play Again
				</button>
			</div>
		);
	}

	return null;
}
