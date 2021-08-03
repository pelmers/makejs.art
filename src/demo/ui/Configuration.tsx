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
                Processing Mode
                <div>
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
                        </>
                    ))}
                </div>
                <div>
                    Threshold
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
                    {cutoff}
                </div>
                <div>
                    Invert?
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
                        <button onClick={this.handleSubmit}>Do the thing</button>
                    )}
                    {loading && <>TODO Loading text here</>}
                </div>
            </>
        );
    }
}
