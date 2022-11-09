# [Make JS Art](https://makejs.art/)

JavaScript formatter (I guess?) that turns your code into (executable!) ascii
art in the form of a picture.

**Example:**
![](example.gif)

**[Try it out!](https://makejs.art/)**

Works best with images that have a well-defined subject.

### Develop

```
git submodule init
git submodule update
yarn
yarn build
yarn jest
```

### More Details

I have published a [blog post](https://pelmers.com/making-javascript-art/) on this project.

### Node API

Now you can also use this as a node module to programmatically turn your code into ascii art!
This will use the node-canvas library to render the provided image to an invisible buffer.

**Install**:

```
npm install makejs.art
OR
yarn add makejs.art
```

**Usage**:

```js
import { makeJsArt } from 'makejs.art';

const source = `
  const a = 1;
  const b = 2;
  const c = a + b;
  console.log(c);
`;

const art = await makeJsArt(source, {
    imagePath: 'path/to/image.png',
    mode: 'intensity',
    cutoff: 0.5,
    invert: false,
});
```

### Webpack Plugin API

This project uses its own webpack plugin to ascii artify itself!
See an example output at [index.js](/dist/index.js).

**Install**:

```
npm install makejs.art
OR
yarn add makejs.art
```

**Usage**:
In `webpack.config.js`:
```js
const { MakeJsArtWebpackPlugin } = require('makejs.art');
module.exports = {
    ...
    plugins: [
        new MakeJsArtWebpackPlugin({
            /* path to an image on disk to use as base of artwork */
            imagePath: 'path/to/image.png',
            /* mode = intensity | saliency */
            mode: 'intensity',
            /* cutoff = 0.0 - 1.0 */
            cutoff: 0.5,      
            /* invert = true | false */
            invert: false,
            /* ignorePatterns = [string | RegExp], if empty all .js assets are modified */
            ignorePatterns: [/vendors-.*/],
        }),
    ],
}
```