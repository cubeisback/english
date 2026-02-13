"use client";

export default function ScoreBoard({ teams, addPoints, removePoints }) {
	return (
		<div className="grid grid-cols-3">
			{teams.map((team, i) => (
				<div
					key={i}
					className="p-4 flex justify-between items-center gap-16"
					style={{
						backgroundColor: team.color,
						// color: team.color
					}}
				>
					<div className="flex flex-1 justify-between items-center gap-4">
						<span className="font-bold text-xl">{team.name}</span>
						<span className="font-bold text-2xl">
							{team.score} points
						</span>
					</div>

					<div className="flex gap-2">
						<button
							onClick={() => addPoints(i)}
							className="text-5xl cursor-pointer"
						>
							+
						</button>

						<button
							onClick={() => removePoints(i)}
							className="text-5xl cursor-pointer"
						>
							−
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
