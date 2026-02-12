"use client";
import { useState } from "react";
import QuestionModal from "./QuestionModal";

export default function QuizBoard({ tour, onFinish, isLast, settings }) {
	const [active, setActive] = useState(null);
	const [answeredIds, setAnsweredIds] = useState([]);

	const markAnswered = (id) => {
		if (!answeredIds.includes(id)) {
			setAnsweredIds((prev) => [...prev, id]);
		}
	};

	return (
		<div className="bg-sky-100 min-h-screen p-8">
			<h1 className="text-5xl text-center font-bold mb-12">
				{tour.title}
			</h1>

			<div className="grid grid-cols-4 gap-4 max-w-8xl mx-auto">
				{tour.questions.map((q) => {
					const answered = answeredIds.includes(q.id);

					return (
						<button
							key={q.id}
							onClick={() => !answered && setActive(q)}
							disabled={answered}
							className={`px-4 py-8 border-4 text-center text-xl font-semibold transition-all duration-300
								${
									answered
										? "bg-gray-400 border-gray-400 text-gray-600 line-through cursor-not-allowed"
										: "bg-sky-900 border-sky-900 hover:border-yellow-400 text-white cursor-pointer"
								}
							`}
						>
							Question {q.id}
						</button>
					);
				})}
			</div>

			<div className="flex justify-center mt-12">
				<button
					onClick={onFinish}
					className="bg-black text-white px-6 py-3 rounded-xl cursor-pointer"
				>
					{isLast ? "Finish Quiz" : "Next Round →"}
				</button>
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
