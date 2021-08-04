import React from 'react';
declare type ResultProps = {
    code: string;
};
/**
 * Component that displays the code output in a textarea.
 * Automatically scales the font size to try to make it all visible in the client window.
 */
export declare class ResultComponent extends React.Component<ResultProps, {}> {
    ref: React.RefObject<HTMLTextAreaElement>;
    resizeListener: () => void;
    render(): JSX.Element;
    rescale(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
}
export {};
