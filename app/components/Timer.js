"use client";

import { useEffect, useState } from "react";

export default function Timer({ duration, onEnd, stopped }) {
	const [time, setTime] = useState(duration);

	useEffect(() => {
		if (stopped) return;

		if (time === 0) {
			onEnd();
			return;
		}

		const t = setTimeout(() => setTime((s) => s - 1), 1000);
		return () => clearTimeout(t);
	}, [time, stopped]);

	return <div className="mb-3 text-xl text-gray-600">⏱ {time} сек</div>;
}
