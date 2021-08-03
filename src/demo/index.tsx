import React from 'react';
import { hydrate, render } from 'react-dom';
import { AutoPlaySilentVideo } from './ui/AutoPlaySilentVideo';
import { Configuration } from './ui/Configuration';
import { ResultComponent } from './ui/ResultComponent';

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
                <div>
                    <img
                        style={{ marginBottom: '0px' }}
                        src={this.state.imageFile}
                    ></img>
                    <div>
                        <button onClick={() => this.setState({ imageFile: undefined })}>
                            Clear Image
                        </button>
                    </div>
                </div>
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
                    <h3>Select a Photo 📷</h3>
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
                    <AutoPlaySilentVideo video="/animation.mp4" />
                    <div className="links">
                        {/* TODO fix links */}
                        <a href="/">About</a>
                        <a href="/">Source</a>
                    </div>
                </div>
                <div className="container">
                    <blockquote className="intro">
                        Code Shaper is not your typical JavaScript formatter! Instead,
                        it turns your code into pictures. Try it by pasting some code
                        and loading a picture!
                    </blockquote>
                    <h3>JavaScript Code 💻</h3>
                    <textarea
                        id="code-text"
                        className="mono"
                        aria-label="input field for javascript source code"
                        onChange={(e) => this.setState({ codeInput: e.target.value })}
                        value={this.state.codeInput}
                    ></textarea>
                    {imageArea}
                    {this.state.error != null && (
                        <div className="error">Error! {this.state.error}</div>
                    )}
                    {configStep}
                </div>
                {/* result goes outside the container to take the full window width */}
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
