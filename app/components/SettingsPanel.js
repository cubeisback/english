"use client";

export default function SettingsPanel({ settings, onChange, onClose }) {
	return (
		<div className="fixed bottom-16 right-4 bg-white p-4 rounded-xl shadow-xl w-80 border">
			<h3 className="text-lg font-bold mb-3">Настройки</h3>

			<div className="flex flex-col gap-3">
				<label className="flex flex-col">
					Время до закрытия вопроса (мс):
					<input
						type="number"
						value={settings.questionTime}
						onChange={(e) =>
							onChange({
								...settings,
								questionTime: parseInt(e.target.value),
							})
						}
						className="border rounded p-1 mt-1"
					/>
				</label>

				<label className="flex flex-col">
					Время перехода между турами (мс):
					<input
						type="number"
						value={settings.roundTransitionTime}
						onChange={(e) =>
							onChange({
								...settings,
								roundTransitionTime: parseInt(e.target.value),
							})
						}
						className="border rounded p-1 mt-1"
					/>
				</label>

				<hr />

				<h4 className="font-semibold">Команды</h4>

				{["team1", "team2", "team3"].map((teamKey, i) => (
					<div key={teamKey} className="border p-2 rounded-xl flex">
						<label className="flex flex-col">
							Название:
							<input
								type="text"
								value={settings[teamKey]}
								onChange={(e) =>
									onChange({
										...settings,
										[teamKey]: e.target.value,
									})
								}
								className="border rounded p-1"
							/>
						</label>

						<label className="flex flex-col">
							Цвет:
							<input
								type="color"
								value={settings[`${teamKey}Color`]}
								onChange={(e) =>
									onChange({
										...settings,
										[`${teamKey}Color`]: e.target.value,
									})
								}
								className="mt-1 h-8"
							/>
						</label>
					</div>
				))}

				<hr />

				<h4 className="font-semibold">Оформление</h4>

				<label className="flex flex-col">
					Цвет фона:
					<input
						type="color"
						value={settings.backgroundColor}
						onChange={(e) =>
							onChange({
								...settings,
								backgroundColor: e.target.value,
							})
						}
						className="mt-1 h-8"
					/>
				</label>

				<label className="flex flex-col">
					Цвет кнопки вопроса:
					<input
						type="color"
						value={settings.questionButtonColor}
						onChange={(e) =>
							onChange({
								...settings,
								questionButtonColor: e.target.value,
							})
						}
						className="mt-1 h-8"
					/>
				</label>

				<label className="flex flex-col">
					Цвет рамки кнопки вопроса:
					<input
						type="color"
						value={settings.questionButtonBorderColor}
						onChange={(e) =>
							onChange({
								...settings,
								questionButtonBorderColor: e.target.value,
							})
						}
						className="mt-1 h-8"
					/>
				</label>
			</div>

			<button
				onClick={onClose}
				className="mt-4 bg-gray-800 text-white rounded px-3 py-2"
			>
				Закрыть
			</button>
		</div>
	);
}
