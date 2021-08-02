import React from 'react';
import { hydrate, render } from 'react-dom';
import {
    DEFAULT_CUTOFF_THRESHOLD,
    modeDescription,
    MODES,
    ModeType,
} from './algos/common';

// Used for testing so I don't need to keep adding test values, publicly this is empty.
const INITIAL_CODE_VALUE =
    'const x = console.log.bind(console);' +
    `
    x('hi');
    x(123);
    x(456);
`.repeat(150) +
    `x('done');`;

type State = {
    result?: string;
    codeInput?: string;
    imageFile?: string;
    error?: string;
};

const algoModule = import('./algos/entry');

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

class Configuration extends React.Component<ConfigProps, ConfigState> {
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

type ResultProps = {
    code: string;
};

class ResultComponent extends React.Component<ResultProps, {}> {
    ref: React.RefObject<HTMLTextAreaElement> = React.createRef();
    resizeListener: () => void;

    render() {
        const { code } = this.props;
        const lines = code.split('\n');
        const height = lines.length;
        const width = lines.reduce((prev, cur) => Math.max(prev, cur.length), 0);
        console.log('result', code);
        return (
            <textarea
                className="mono"
                ref={this.ref}
                style={{
                    height: `${height}em`,
                    width: `${width}ch`,
                    margin: '0 auto',
                    // only block-level elements can be centered; textarea is inline by default
                    display: 'block',
                }}
                value={code}
                disabled
            />
        );
    }

    rescale() {
        if (!this.ref.current) {
            return;
        }
        const $el = this.ref.current!;
        const styles = window.getComputedStyle($el);
        // find the ratio of code dimensions to the window dimensions
        const widthRatio = Number(styles.width.split('px')[0]) / window.innerWidth;
        const minFontSize = 3;
        const maxFontSize = 18;
        // if the code is too big for the window, scale the font size down
        $el.style.fontSize = `${Math.min(
            maxFontSize,
            Math.max(minFontSize, Number(styles.fontSize.split('px')[0]) / widthRatio)
        )}px`;
        $el.style.height = `${$el.scrollHeight + 5}px`;
    }

    componentDidMount() {
        this.resizeListener = () => this.rescale();
        window.addEventListener('resize', this.resizeListener);
        this.rescale();
    }

    componentDidUpdate() {
        this.rescale();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }
}

class App extends React.Component<{}, State> {
    state = {
        result: undefined,
        codeInput: INITIAL_CODE_VALUE,
        imageFile: undefined,
        error: undefined,
    };
    fileInput: React.RefObject<HTMLInputElement>;

    handleFiles = (files: FileList) => {
        const f = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            this.setState({ imageFile: e.target?.result?.toString() });
        };
        reader.readAsDataURL(f);
    };

    render() {
        const { codeInput, imageFile, result } = this.state;
        const imageArea =
            imageFile != null ? (
                <>
                    <img src={this.state.imageFile}></img>
                    <button onClick={() => this.setState({ imageFile: undefined })}>
                        Clear Image
                    </button>
                </>
            ) : (
                <div
                    id="dragdrop"
                    onClick={() => this.fileInput?.current?.click()}
                    onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onDragExit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onDrag={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleFiles(e.dataTransfer.files);
                    }}
                >
                    <h3>Select a photo 📷</h3>
                    <input
                        ref={this.fileInput}
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={(e) => this.handleFiles(e.target.files!)}
                    />
                </div>
            );
        const configStep = imageFile != null && codeInput != null && (
            <Configuration
                code={codeInput}
                image={imageFile!}
                onResult={(code) => {
                    this.setState({ result: code });
                }}
                onError={(error) => this.setState({ error })}
            />
        );
        const resultStep = result != null && <ResultComponent code={result!} />;

        return (
            <>
                <div id="header">
                    <div className="links">
                        {/* TODO fix links */}
                        <a href="/">About</a>
                        <a href="/">Source</a>
                    </div>
                </div>
                <div id="container">
                    {this.state.error != null && <div>Error! {this.state.error}</div>}
                    <h3>JavaScript Code 💻</h3>
                    <textarea
                        id="code-text"
                        aria-label="input field for javascript source code"
                        onChange={(e) => this.setState({ codeInput: e.target.value })}
                        value={this.state.codeInput}
                    ></textarea>
                    {imageArea}
                    {configStep}
                </div>
                {resultStep}
            </>
        );
    }
}

const $rootElement = document.getElementById('root')!;
if ($rootElement.hasChildNodes()) {
    hydrate(<App />, $rootElement);
} else {
    render(<App />, $rootElement);
}
