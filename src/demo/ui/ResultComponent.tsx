import React from 'react';

type ResultProps = {
    code: string;
};

export class ResultComponent extends React.Component<ResultProps, {}> {
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