export declare const Shapes: ({
    id: string;
    type: any;
    geometry: {
        points: number[][];
        bounds: {
            minX: number;
            maxX: number;
            minY: number;
            maxY: number;
        };
        x?: undefined;
        y?: undefined;
        w?: undefined;
        h?: undefined;
    };
    state: {};
} | {
    id: string;
    type: any;
    geometry: {
        x: number;
        y: number;
        w: number;
        h: number;
        bounds: {
            minX: number;
            minY: number;
            maxX: number;
            maxY: number;
        };
        points?: undefined;
    };
    state: {};
})[];
