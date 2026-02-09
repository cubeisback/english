"use client";

export default function SettingsPanel({ settings, onChange, onClose }) {
	return (
		<div className="fixed bottom-16 right-4 bg-white p-4 rounded-xl shadow-xl w-64 border">
			<h3 className="text-lg font-bold mb-2">Настройки</h3>
			<div className="flex flex-col gap-2">
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
					Время закрытия модального после ответа (мс):
					<input
						type="number"
						value={settings.modalCloseTime}
						onChange={(e) =>
							onChange({
								...settings,
								modalCloseTime: parseInt(e.target.value),
							})
						}
						className="border rounded p-1 mt-1"
					/>
				</label>
				<label className="flex flex-col">
					Время показа текста перехода между турами (мс):
					<input
						type="number"
						value={settings.roundTransitionTime || 2000}
						onChange={(e) =>
							onChange({
								...settings,
								roundTransitionTime: parseInt(e.target.value),
							})
						}
						className="border rounded p-1 mt-1"
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
