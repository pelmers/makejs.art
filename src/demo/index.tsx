import React from 'react';
import { hydrate, render } from 'react-dom';
import { AutoPlaySilentVideo } from './ui/AutoPlaySilentVideo';
import { Configuration } from './ui/Configuration';
import { ResultComponent } from './ui/ResultComponent';

// @ts-ignore: webpack import raw file as string
import reactSourceCode from '!raw-loader!../__tests__/fixtures/react.production.min.js';

const INITIAL_CODE_VALUE = reactSourceCode;

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
    fileInput: React.RefObject<HTMLInputElement> = React.createRef();

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
                        <button
                            onClick={() =>
                                this.setState({
                                    imageFile: undefined,
                                    result: undefined,
                                })
                            }
                        >
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
                        <a href="https://pelmers.com/making-javascript-art/">About</a>
                        <a href="https://github.com/pelmers/makejs.art">Source</a>
                    </div>
                </div>
                <div className="container">
                    <blockquote className="intro">
                        This is not your typical JavaScript formatter! Instead, it turns
                        your code into pictures. Try it by pasting some code and loading
                        a picture!
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
