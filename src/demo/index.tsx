import React from 'react';
import { hydrate, render } from 'react-dom';

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

    handleSubmit = async () => {
        const { codeInput, imageFile } = this.state;
        if (codeInput == null || imageFile == null) {
            throw new Error('Cannot continue unless image and code are provided');
        }
        const { drawCode } = await customModule;
        try {
            await drawCode(codeInput, imageFile!);
        } catch (e) {
            this.setState({ error: e.message });
            console.error(e);
        }
    };

    render() {
        const imageArea =
            this.state.imageFile != null ? (
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
        const doIt =
            // this.state.imageFile != null && this.state.codeInput != null ? (
            true ? <button onClick={this.handleSubmit}>Do the thing</button> : <></>;

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
                    {doIt}
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
