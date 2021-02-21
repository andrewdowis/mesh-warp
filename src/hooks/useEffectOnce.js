import { useEffect, useRef } from 'react'

export default function useEffectOnce(callback) {
	const usedOnce = useRef(false)

	useEffect(() => {
		if (!usedOnce.current) {
			if (callback) callback()
			usedOnce.current = true
		}
	})
}
