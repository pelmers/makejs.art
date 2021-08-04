import React from 'react';
import { ModeType } from '../algos/common';
declare type ConfigState = {
    cutoff?: number;
    mode?: ModeType;
    invert?: boolean;
    loading?: boolean;
};
declare type ConfigProps = {
    code: string;
    image: string;
    onResult: (code: string) => void;
    onError: (err: string) => void;
};
export declare class Configuration extends React.Component<ConfigProps, ConfigState> {
    state: {
        cutoff: number;
        mode: "intensity";
        invert: boolean;
        loading: boolean;
    };
    handleSubmit: () => Promise<void>;
    render(): JSX.Element;
}
export {};
