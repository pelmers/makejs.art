import React from 'react';
import {
    ModeType,
    DEFAULT_CUTOFF_THRESHOLD,
    MODES,
    modeDescription,
} from '../algos/common';
import { ExpandableSpan } from './ExpandableSpan';

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
            this.props.onResult(await drawCode(code, image, mode, cutoff, invert));
        } catch (e) {
            this.props.onError(e.message);
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const { mode, loading, cutoff, invert } = this.state;
        return (
            <>
                <h3>Processing Options ⚙</h3>
                <div>
                    <ExpandableSpan
                        text={<span className="config-label">Relevance Metric</span>}
                        helpText={
                            <blockquote className="config-label-help">
                                The relevance metric determines how we find which
                                regions to populate with code.
                                <br />
                                <b>Intensity:</b> compute r + g + b values at each pixel
                                and fill in the locations of the highest values.
                                <br />
                                <b>Saliency:</b> calculate a local saliency value at
                                each pixel with{' '}
                                <a href="https://mmcheng.net/mftp/Papers/SaliencyTPAMI.pdf">
                                    global contrast detection
                                </a>{' '}
                                and put code at the highest locations.
                            </blockquote>
                        }
                    />
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
                    <ExpandableSpan
                        text={<span className="config-label">Threshold</span>}
                        helpText={
                            <blockquote className="config-label-help">
                                The proportion of the image we will target code
                                coverage. For example, if threshold is 0.3 then we will
                                attempt to cover 30% of the image with code using the
                                relevance metric.
                            </blockquote>
                        }
                    />
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
                    <ExpandableSpan
                        text={<span className="config-label">Invert?</span>}
                        helpText={
                            <blockquote className="config-label-help">
                                If inverting, then instead of taking maximal values from
                                the relevancy metric, we take minimum values. For
                                example, if using intensity and threshold of 0.3, then
                                if you check this box, we will instead cover <i>70%</i>{' '}
                                of the image with <i>lowest intensity</i>.
                            </blockquote>
                        }
                    />

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
