import { RefObject, useEffect, useState } from 'react';

export type BoundingRectState = {
    height: number;
    width: number;
    x: number;
    y: number;
} | null;

export const useBoundingClientRect = <
    Element extends HTMLElement = HTMLElement
>({
    getTarget,
}: {
    getTarget: () => RefObject<Element | null>;
}): [BoundingRectState] => {
    const [boundingRectState, setBoundingRectState] =
        useState<BoundingRectState>(null);

    useEffect(() => {
        const boundingBox = getTarget().current?.getBoundingClientRect();

        if (boundingBox) {
            setBoundingRectState(boundingBox);
        }
    }, []);

    return [boundingRectState];
};
