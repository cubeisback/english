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
		roundTransitionTime: 5000,
		team1: "Team 1",
		team2: "Team 2",
		team3: "Team 3",
		team1Color: "#ef4444",
		team2Color: "#3b82f6",
		team3Color: "#22c55e",

		backgroundColor: "#e0f2fe", // sky-100
		questionButtonColor: "#00598a",
		questionButtonBorderColor: "#fdc700",
	};

	const roundImages = [
		"/images/round1.jpg",
		"/images/round2.jpg",
		"/images/round3.jpg",
		"/images/round4.jpg",
	];

	const [settings, setSettings] = useState(defaultSettings);
	const [teams, setTeams] = useState([]);

	// Для анимации финального экрана (не зависит от фазы)
	const [showIndex, setShowIndex] = useState(-1);

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

	// ================= FINAL SCREEN ANIMATION =================
	useEffect(() => {
		if (phase === "finished") {
			setShowIndex(-1);
			let i = 0;
			const interval = setInterval(() => {
				if (i < teams.length) {
					setShowIndex(i);
					i++;
				} else {
					clearInterval(interval);
				}
			}, 300);
			return () => clearInterval(interval);
		}
	}, [phase, teams.length]);

	// ================= START SCREEN =================
	if (phase === "start") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[url(/images/start.jpg)] bg-cover bg-center relative">
				<div
					onClick={startGame}
					className="text-6xl font-bold cursor-pointer text-white text-shadow-lg/30"
				>
					Start
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

	// ================= ROUND INTRO =================
	if (phase === "roundIntro") {
		return (
			<div
				className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
				style={{
					backgroundImage: `url(${roundImages[tourIndex]})`,
				}}
			>
				{/* <h1 className="relative text-6xl font-bold text-white drop-shadow-2xl">
					Round {tourIndex + 1}
				</h1> */}
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
		const winners = teams.filter((t) => t.score === maxScore);

		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
				{winners.length > 0 && (
					<Confetti numberOfPieces={300} recycle={true} />
				)}

				<h1 className="text-6xl font-bold mb-8">Game Over</h1>

				<div className="flex flex-col items-center gap-4">
					{teams.map((t, i) => {
						const isWinner = t.score === maxScore;
						const isVisible = i <= showIndex;

						return (
							<div
								key={i}
								className={`text-3xl font-bold px-6 py-3 rounded-xl transition-all duration-700`}
								style={{
									backgroundColor: t.color,
									opacity: isVisible ? 1 : 0,
									transform: isVisible
										? isWinner
											? "scale(1.2)"
											: "scale(1)"
										: "scale(0.8)",
									transitionDelay: `${i * 0.1}s`,
								}}
							>
								{isWinner ? "🏆 " : ""}
								{t.name} — {t.score} pts
							</div>
						);
					})}
				</div>

				<button
					onClick={() => setPhase("start")}
					className="mt-10 bg-white text-black px-8 py-3 rounded-xl hover:scale-105 transition-all"
				>
					Play Again
				</button>
			</div>
		);
	}

	return null;
}
