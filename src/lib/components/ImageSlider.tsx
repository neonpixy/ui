import { createSignal, createEffect, onCleanup, For, Show, mergeProps } from 'solid-js';

interface SliderImage {
	src: string;
	alt: string;
	caption?: string;
}

interface ImageSliderProps {
	images: SliderImage[];
	autoplay?: boolean;
	interval?: number;
	indicators?: boolean;
	class?: string;
}

export function ImageSlider(props: ImageSliderProps) {
	const merged = mergeProps({ autoplay: false, interval: 5000, indicators: true }, props);
	const [current, setCurrent] = createSignal(0);

	function next() {
		setCurrent((c) => (c + 1) % merged.images.length);
	}

	function prev() {
		setCurrent((c) => (c - 1 + merged.images.length) % merged.images.length);
	}

	function goTo(index: number) {
		setCurrent(index);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
		if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
		if (e.key === 'Home') { setCurrent(0); e.preventDefault(); }
		if (e.key === 'End') { setCurrent(merged.images.length - 1); e.preventDefault(); }
	}

	createEffect(() => {
		if (merged.autoplay && merged.images.length > 1) {
			const timer = setInterval(next, merged.interval);
			onCleanup(() => clearInterval(timer));
		}
	});

	return (
		<div
			class={`omnidea-slider relative overflow-hidden rounded-[--radius-lg] ${merged.class ?? ''}`}
			tabindex="0"
			role="region"
			aria-label="Image slider"
			aria-roledescription="carousel"
			onKeyDown={handleKeydown}
		>
			{/* Slides */}
			<div class="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${current() * 100}%)` }}>
				<For each={merged.images}>
					{(img, i) => (
						<img
							src={img.src}
							alt={img.alt}
							class="w-full h-full object-cover flex-shrink-0"
							aria-hidden={i() !== current()}
						/>
					)}
				</For>
			</div>

			{/* Navigation */}
			<Show when={merged.images.length > 1}>
				<button
					class="slider-nav absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/30 text-white rounded-full cursor-pointer transition-[background] duration-150"
					onClick={prev}
					aria-label="Previous slide"
				>
					<i class="ri-arrow-left-s-line text-sm" />
				</button>
				<button
					class="slider-nav absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/30 text-white rounded-full cursor-pointer transition-[background] duration-150"
					onClick={next}
					aria-label="Next slide"
				>
					<i class="ri-arrow-right-s-line text-sm" />
				</button>
			</Show>

			{/* Caption */}
			<Show when={merged.images[current()]?.caption}>
				<div class="absolute bottom-0 left-0 right-0 px-[--spacing-md] py-[--spacing-sm] bg-black/40 text-white text-sm">
					{merged.images[current()].caption}
				</div>
			</Show>

			{/* Indicators */}
			<Show when={merged.indicators && merged.images.length > 1}>
				<div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
					<For each={merged.images}>
						{(_, i) => (
							<button
								class={`w-2 h-2 rounded-full transition-[background,transform] duration-150 cursor-pointer ${i() === current() ? 'bg-white scale-125' : 'bg-white/50'}`}
								onClick={() => goTo(i())}
								aria-label={`Go to slide ${i() + 1}`}
							/>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
