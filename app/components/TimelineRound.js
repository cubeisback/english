"use client";
import { useState } from "react";

export default function TimelineRound({ tour, onFinish }) {
	const [index, setIndex] = useState(0);
	const [selected, setSelected] = useState(null);

	const pair = tour.items[index];
	const first = pair[0];
	const second = pair[1];

	const correct = first.year < second.year ? first.id : second.id;

	const handleSelect = (id) => {
		if (selected !== null) return;
		setSelected(id);
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
				color = "text-green-600";
				border = "border-green-600";
			} else if (item.id === selected) {
				color = "text-red-600";
				border = "border-red-600";
			}
		}

		return (
			<div
				onClick={() => handleSelect(item.id)}
				className={`cursor-pointer ${border} border-4 rounded-2xl p-6 w-80 flex flex-col items-center gap-4 transition-all`}
			>
				<h2 className="text-2xl font-bold">{item.title}</h2>

				<div className="w-60 h-60 bg-gray-300 flex items-center justify-center rounded-xl">
					Image
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
		<div className="min-h-screen flex flex-col items-center justify-center bg-sky-100 gap-10">
			<h1 className="text-4xl font-bold">{tour.title}</h1>

			<div className="flex gap-12">
				{renderCard(first)}
				{renderCard(second)}
			</div>

			{selected !== null && (
				<button
					onClick={next}
					className="bg-black text-white px-8 py-3 rounded-xl cursor-pointer"
				>
					Next
				</button>
			)}
		</div>
	);
}
