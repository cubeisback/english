"use client";

import { useState } from "react";
import Timer from "./Timer";

export default function QuestionModal({
	question,
	onClose,
	onAnswered,
	questionTime,
	modalCloseTime,
}) {
	const [selected, setSelected] = useState(null);
	const [correctSelected, setCorrectSelected] = useState(false);

	const handleAnswer = (i) => {
		if (correctSelected) return;

		if (i === question.correct) {
			setSelected(i);
			setCorrectSelected(true);

			setTimeout(() => {
				onAnswered();
				onClose();
			}, modalCloseTime);
		} else {
			// ❌ неправильный ответ — просто подсветить
			setSelected(i);

			// убрать подсветку через 1 секунду
			setTimeout(() => {
				setSelected(null);
			}, 1000);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white p-8 rounded-2xl w-full max-w-6xl shadow-2xl">
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
								className={`p-4 rounded-lg border text-2xl transition-all duration-300 cursor-pointer text-center
					${correctSelected && isCorrect ? "bg-green-300" : ""}
					${isWrong ? "bg-red-300" : ""}
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
