import React from 'react';

type State = {
    expanded: boolean;
};

type Props = {
    text: JSX.Element;
    helpText: JSX.Element;
    newLine?: boolean;
};

/**
 * Component that wraps some text, clicking it toggles help text.
 * If newLine is passed, then put a br between the two components.
 * Clicking the original span again closes it.
 */
export class ExpandableSpan extends React.Component<Props, State> {
    state = {
        expanded: false,
    };

    render() {
        const { text, helpText } = this.props;
        const { expanded } = this.state;
        return (
            <>
                <span onClick={() => this.setState({ expanded: !expanded })}>
                    {text}
                </span>
                {expanded && <br />}
                {expanded && helpText}
            </>
        );
    }
}
