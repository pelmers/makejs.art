import React from 'react';
declare type State = {
    expanded: boolean;
};
declare type Props = {
    text: JSX.Element;
    helpText: JSX.Element;
    newLine?: boolean;
};
/**
 * Component that wraps some text, clicking it toggles help text.
 * If newLine is passed, then put a br between the two components.
 * Clicking the original span again closes it.
 */
export declare class ExpandableSpan extends React.Component<Props, State> {
    state: {
        expanded: boolean;
    };
    render(): JSX.Element;
}
export {};
