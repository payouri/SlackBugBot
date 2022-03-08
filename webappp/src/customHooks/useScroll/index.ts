import { RefObject, useLayoutEffect, useState } from 'react';
import debounce from 'lodash.debounce';

export type ScrollState = {
    scrollHeight: number;
    scrollWidth: number;
    scrollTop: number;
    scrollLeft: number;
} | null;

export type ScrollHandlers = {
    updateScrollState: () => void;
};

const getScrollState = (target: Window | HTMLElement): ScrollState => {
    if (target instanceof Window) {
        return {
            scrollHeight: target.innerHeight,
            scrollTop: target.scrollY,
            scrollLeft: target.scrollX,
            scrollWidth: target.innerWidth,
        };
    }
    if (target instanceof HTMLElement) {
        target.getBoundingClientRect();
        return {
            scrollHeight: target.scrollHeight,
            scrollTop: target.scrollTop,
            scrollLeft: target.scrollLeft,
            scrollWidth: target.scrollWidth,
        };
    }
    return null;
};

export const useScroll = <Element extends HTMLElement = HTMLElement>({
    getScrollTarget = window,
    scrollOptions = { wait: 100, maxWait: 250 },
}: {
    getScrollTarget?: Window | (() => RefObject<Element | null>);
    scrollOptions?: {
        leading?: boolean;
        maxWait?: number;
        trailing?: boolean;
        wait?: number;
    };
} = {}): [ScrollState, ScrollHandlers] => {
    const [scrollState, setScrollState] = useState<ScrollState>(null);

    const handleScroll = (event: Event) => {
        const { target } = event;

        if (target instanceof Window || target instanceof HTMLElement) {
            setScrollState(getScrollState(target));
        } else {
            setScrollState(null);
        }
    };

    useLayoutEffect(() => {
        const currentTarget =
            getScrollTarget instanceof Window
                ? getScrollTarget
                : getScrollTarget().current;

        const { wait, ...options } = scrollOptions;
        const debouncedHandler = debounce(handleScroll, wait, options);

        if (currentTarget !== null) {
            currentTarget.addEventListener('scroll', debouncedHandler);
            if (scrollState === null) {
                setScrollState(getScrollState(currentTarget));
            }
        } else if (scrollState !== null) {
            setScrollState(null);
        }
        return () => {
            if (currentTarget !== null) {
                currentTarget.removeEventListener('scroll', debouncedHandler);
            } else if (scrollState !== null) {
                setScrollState(null);
            }
        };
    }, [scrollState, getScrollTarget, scrollOptions]);

    return [
        scrollState,
        {
            updateScrollState: () => {
                const currentTarget =
                    getScrollTarget instanceof Window
                        ? getScrollTarget
                        : getScrollTarget().current;

                if (currentTarget) {
                    currentTarget.dispatchEvent(new Event('scroll'));
                }
            },
        },
    ];
};
