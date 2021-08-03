import React from 'react';
import {
    ModeType,
    DEFAULT_CUTOFF_THRESHOLD,
    MODES,
    modeDescription,
} from '../algos/common';

const algoModule = import('../algos/entry');

type ConfigState = {
    cutoff?: number;
    mode?: ModeType;
    invert?: boolean;
    loading?: boolean;
};

type ConfigProps = {
    code: string;
    image: string;
    onResult: (code: string) => void;
    onError: (err: string) => void;
};

function LoadingSpinner(props: { text?: string }) {
    return (
        <>
            <div className="loading-spinner"></div>
            {props.text && (
                <div className="loading-spinner-progress-text">{props.text}</div>
            )}
        </>
    );
}

export class Configuration extends React.Component<ConfigProps, ConfigState> {
    state = {
        cutoff: DEFAULT_CUTOFF_THRESHOLD,
        mode: MODES[0],
        invert: false,
        loading: false,
    };

    handleSubmit = async () => {
        const { code, image } = this.props;
        const { mode, cutoff, invert } = this.state;
        const { drawCode } = await algoModule;
        try {
            this.setState({ loading: true });
            // TODO: then put it out in an output text box
            this.props.onResult(await drawCode(code, image, mode, cutoff, invert));
        } catch (e) {
            this.props.onError(e.message);
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        // TODO implement loading spinner/text
        const { mode, loading, cutoff, invert } = this.state;
        return (
            <>
                <h3>Processing Options ⚙</h3>
                <div>
                    <span className="config-label">Relevance Metric</span>
                    <br />
                    {MODES.map((m, key) => (
                        <>
                            <input
                                key={key}
                                type="radio"
                                value={m}
                                name="mode"
                                checked={m === mode}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        this.setState({
                                            mode: event.target.value as ModeType,
                                        });
                                    }
                                }}
                            />{' '}
                            {modeDescription(m)}
                            <br />
                        </>
                    ))}
                </div>
                <div>
                    <span className="config-label">Threshold</span>
                    <input
                        type="range"
                        max="0.99"
                        min="0.01"
                        step="0.01"
                        value={cutoff}
                        onChange={(event) =>
                            this.setState({
                                cutoff: Number.parseFloat(event.target.value),
                            })
                        }
                    />
                    <span className="threshold-label">{cutoff}</span>
                </div>
                <div>
                    <span className="config-label">Invert?</span>
                    <input
                        type="checkbox"
                        checked={invert}
                        onChange={(event) =>
                            this.setState({ invert: event.target.checked })
                        }
                    />
                </div>
                <div>
                    {!loading && (
                        <button onClick={this.handleSubmit}>Do the Thing</button>
                    )}
                    {loading && <LoadingSpinner text="Doing It" />}
                </div>
            </>
        );
    }
}
