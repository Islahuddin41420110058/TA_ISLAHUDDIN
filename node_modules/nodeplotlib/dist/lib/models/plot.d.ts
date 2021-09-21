import { Layout, PlotData } from 'plotly.js';
export declare type Plot = Partial<PlotData>;
export interface IPlot {
    data: Plot[];
    layout?: Partial<Layout>;
}
