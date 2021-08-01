import React from 'react';
import { hydrate, render } from 'react-dom';
import { INTENSITY_CUTOFF } from './common';

// Used for testing so I don't need to keep adding test values, publicly this is empty.
const INITIAL_CODE_VALUE =
    'let testfn;' +
    `
testfn = () => {
    return [1, 2, 3, 4, 5, 6];
};
`.repeat(50) +
    'testfn();';

type State = {
    result?: string;
    codeInput?: string;
    imageFile?: string;
    error?: string;
};

const customModule = import('./custom');

type ConfigState = {
    cutoff?: number;
    mode?: 'intensity' | 'saliency';
    invert?: boolean;
};

type ConfigProps = {
    code: string;
    image: string;
    onResult: (code: string) => void;
    onError: (err: string) => void;
};

class Configuration extends React.Component<ConfigProps, ConfigState> {
    state = {
        cutoff: INTENSITY_CUTOFF,
        mode: 'intensity' as const,
        invert: false,
    };

    handleSubmit = async () => {
        const { code, image } = this.props;
        const { drawCode } = await customModule;
        try {
            // TODO: then put it out in an output text box
            this.props.onResult(await drawCode(code, image));
        } catch (e) {
            this.props.onError(e.message);
        }
    };

    render() {
        // TODO implement inputs ui for config options
        return <button onClick={this.handleSubmit}>Do the thing</button>;
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
        const { codeInput, imageFile } = this.state;
        const imageArea =
            imageFile != null ? (
                <img src={this.state.imageFile}></img>
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
                    console.log(code);
                    this.setState({ result: code });
                }}
                onError={(error) => this.setState({ error })}
            />
        );

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
                    <textarea
                        id="code-text"
                        aria-label="input field for javascript source code"
                        onChange={(e) => this.setState({ codeInput: e.target.value })}
                        value={this.state.codeInput}
                    ></textarea>
                    {imageArea}
                    {configStep}
                </div>
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
