"use client";

import { useState, useRef } from "react";
import Timer from "./Timer";

export default function QuestionModal({
	question,
	onClose,
	onAnswered,
	questionTime,
}) {
	const [selected, setSelected] = useState(null);
	const [correctSelected, setCorrectSelected] = useState(false);

	// 🔊 ссылки на аудио
	const correctSound = useRef(null);
	const wrongSound = useRef(null);

	const handleAnswer = (i) => {
		if (correctSelected) return;

		const isCorrect = i === question.correct;

		if (isCorrect) {
			setSelected(i);
			setCorrectSelected(true);

			// 🔊 проигрываем звук правильного ответа
			if (correctSound.current) {
				correctSound.current.currentTime = 0;
				correctSound.current.volume = 0.1;
				correctSound.current.play();
			}

			setTimeout(() => {
				onAnswered();
				onClose();
			}, 2000);
		} else {
			setSelected(i);

			// 🔊 проигрываем звук неправильного ответа
			if (wrongSound.current) {
				wrongSound.current.currentTime = 0;
				wrongSound.current.volume = 0.1;
				wrongSound.current.play();
			}

			// убрать подсветку через 1 секунду
			setTimeout(() => {
				setSelected(null);
			}, 1000);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white p-8 rounded-xl w-full max-w-6xl shadow-2xl">
				<Timer
					duration={questionTime / 1000}
					onEnd={() => {}}
					stopped={correctSelected}
				/>

				<h2 className="text-4xl font-bold mb-6 text-center">
					{question.question}
				</h2>

				<div className="grid grid-cols-3 gap-4">
					{question.answers.map((a, i) => {
						const isCorrect = i === question.correct;
						const isWrong = selected === i && !isCorrect;

						return (
							<button
								key={i}
								onClick={() => handleAnswer(i)}
								className={`px-4 py-8 rounded-xl border-2 text-2xl font-semibold transition-all duration-300 cursor-pointer text-center
		${!correctSelected && selected === null ? "hover:bg-sky-400" : ""}
		${correctSelected && isCorrect ? "bg-green-500" : ""}
		${isWrong ? "bg-red-500" : ""}
	`}
							>
								{a}
							</button>
						);
					})}
				</div>

				{/* 🔊 Аудио элементы */}
				<audio
					ref={correctSound}
					src="/sounds/correct.mp3"
					preload="auto"
				/>
				<audio
					ref={wrongSound}
					src="/sounds/wrong.mp3"
					preload="auto"
				/>
			</div>
		</div>
	);
}
