"use client";

import { useEffect, useState } from "react";
import Timer from "./Timer";

export default function QuestionModal({
	question,
	onClose,
	onAnswered,
	questionTime,
	modalCloseTime,
}) {
	const [selected, setSelected] = useState(null);
	const [showResult, setShowResult] = useState(false);

	const handleAnswer = (i) => {
		if (selected !== null) return;
		setSelected(i);
		setShowResult(true); // подсветка
		setTimeout(() => {
			onAnswered();
			onClose();
		}, modalCloseTime); // ждем указанное время
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl animate-fadeIn">
				<Timer
					duration={questionTime / 1000} // секунды
					onEnd={() => {
						if (selected === null) handleAnswer(null);
					}}
					stopped={selected !== null}
				/>

				<h2 className="text-xl font-bold mb-4">{question.question}</h2>

				<div className="space-y-2">
					{question.answers.map((a, i) => {
						const isCorrect = i === question.correct;
						const isWrong = selected === i && !isCorrect;

						return (
							<button
								key={i}
								disabled={selected !== null}
								onClick={() => handleAnswer(i)}
								className={`w-full p-3 cursor-pointer rounded-lg border transition-all duration-300
                  ${showResult && isCorrect ? "bg-green-200" : ""}
                  ${showResult && isWrong ? "bg-red-200" : ""}
                  hover:scale-105
                `}
							>
								{a}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
