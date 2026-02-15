"use client";
import { useState, useRef, useEffect } from "react";

export default function TimelineRound({ tour, onFinish }) {
	const [index, setIndex] = useState(0);
	const [selected, setSelected] = useState(null);

	// 🔊 аудио ссылки
	const correctSound = useRef(null);
	const wrongSound = useRef(null);

	// 🔉 устанавливаем громкость один раз
	useEffect(() => {
		if (correctSound.current) correctSound.current.volume = 0.4;
		if (wrongSound.current) wrongSound.current.volume = 0.3;
	}, []);

	const pair = tour.items[index];
	const first = pair[0];
	const second = pair[1];

	const correct = first.year < second.year ? first.id : second.id;

	const handleSelect = (id) => {
		if (selected !== null) return;

		setSelected(id);

		// 🔊 проигрываем звук
		if (id === correct) {
			if (correctSound.current) {
				correctSound.current.currentTime = 0;
				correctSound.current.volume = 0.1;
				correctSound.current.play();
			}
		} else {
			if (wrongSound.current) {
				wrongSound.current.currentTime = 0;
				wrongSound.current.volume = 0.1;
				wrongSound.current.play();
			}
		}
	};

	const next = () => {
		if (index + 1 < tour.items.length) {
			setIndex(index + 1);
			setSelected(null);
		} else {
			onFinish();
		}
	};

	const renderCard = (item) => {
		let color = "text-black";
		let border = "border-gray-400";

		if (selected !== null) {
			if (item.id === correct) {
				color = "text-green-500";
				border = "border-green-500";
			} else if (item.id === selected) {
				color = "text-red-500";
				border = "border-red-500";
			}
		}

		return (
			<div
				onClick={() => handleSelect(item.id)}
				className={`cursor-pointer ${border} border-4 rounded-xl p-6 w-80 flex flex-col items-center gap-4 transition-all`}
			>
				<h2 className="text-2xl font-bold text-center">{item.title}</h2>

				<div className="w-60 h-60 flex items-center justify-center rounded-xl overflow-hidden">
					<img
						src={item.image}
						alt={item.title}
						className="mix-blend-multiply"
					/>
				</div>

				{selected !== null && (
					<div className={`text-xl font-semibold ${color}`}>
						Year: {item.year}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-sky-100 p-8">
			<h1 className="text-5xl text-center font-bold mb-12">
				{tour.title}
			</h1>

			<div className="flex gap-12 justify-center">
				{renderCard(first)}
				{renderCard(second)}
			</div>

			{selected !== null && (
				<div className="flex justify-center mt-12">
					<button
						onClick={next}
						className="bg-black text-white px-8 py-3 rounded-xl cursor-pointer"
					>
						Next
					</button>
				</div>
			)}

			{/* 🔊 аудио */}
			<audio
				ref={correctSound}
				src="/sounds/correct.mp3"
				preload="auto"
			/>
			<audio ref={wrongSound} src="/sounds/wrong.mp3" preload="auto" />
		</div>
	);
}
