"use client";

import { useState } from "react";
import QuestionModal from "./QuestionModal";

export default function QuizBoard({ tour, onFinish, isLast, settings }) {
	const [active, setActive] = useState(null);
	const [answeredIds, setAnsweredIds] = useState([]);

	const markAnswered = (id) => {
		setAnsweredIds((prev) => [...prev, id]);

		// Если все вопросы отвечены, вызываем onFinish для перехода к следующему туру
		if ([...answeredIds, id].length === tour.questions.length) {
			setTimeout(onFinish, settings.roundTransitionTime);
		}
	};

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">{tour.title}</h1>

			<div className="grid grid-cols-4 gap-4">
				{tour.questions.map((q) => (
					<button
						key={q.id}
						onClick={() =>
							!answeredIds.includes(q.id) && setActive(q)
						}
						disabled={answeredIds.includes(q.id)}
						className={`p-4 rounded-xl border text-center transition-all duration-300
${answeredIds.includes(q.id) ? "bg-gray-300 text-gray-600 line-through cursor-not-allowed" : "hover:bg-gray-100 scale-105"}
`}
					>
						Вопрос {q.id}
					</button>
				))}
			</div>

			{active && (
				<QuestionModal
					question={active}
					onClose={() => setActive(null)}
					onAnswered={() => markAnswered(active.id)}
					questionTime={settings.questionTime}
					modalCloseTime={settings.modalCloseTime}
				/>
			)}
		</div>
	);
}
