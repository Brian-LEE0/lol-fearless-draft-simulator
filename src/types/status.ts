// = ["b0", "b5", "b1", "b6", "b2", "b7", "p0", "p5", "p6", "p1", "p2", "p7", "b8", "b3", "b9", "b4", "p8", "p3", "p4", "p9"];
interface Status {
    type: string;
    plans: string[];
    champions: string[];
    timestamps: number[];
    ready: {
        blue: number | null;
        red: number | null;
    },
}