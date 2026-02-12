"use client";

export default function ScoreBoard({ teams, addPoints, removePoints }) {
	return (
		<div className="fixed top-5 left-5 bg-white p-4 rounded-2xl shadow-xl z-50 w-72">
			<h3 className="font-bold text-lg mb-4">Score</h3>

			{teams.map((team, i) => (
				<div key={i} className="mb-4 border-b pb-3">
					<div className="flex justify-between items-center mb-2">
						<span className="font-medium">{team.name}</span>
						<span className="font-bold text-lg">{team.score}</span>
					</div>

					<div className="flex gap-2">
						<button
							onClick={() => addPoints(i)}
							className="flex-1 bg-green-600 text-white rounded-lg py-1 cursor-pointer"
						>
							+ Add
						</button>

						<button
							onClick={() => removePoints(i)}
							className="flex-1 bg-red-600 text-white rounded-lg py-1 cursor-pointer"
						>
							− Remove
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
