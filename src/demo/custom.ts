// TODO
// what i really want to have is a way to make code in the shape of any picture
// like picture to asciiart, but with your code
// does that exist already?
// if not, i could perhaps do a edge detect and then write code in every other location
// or maybe some background detection? and then just fill in everything that's not background
// apparently a keyword is "stippling"
// https://github.com/IonicaBizau/image-to-ascii promising but has native deps (graphicsmagick)
// okay it seems like most of them are pretty simple using the pixel intensity values...
// for image resizing... https://github.com/nodeca/pica

// so an idea is, given an image:
// first convert to ascii by looking at intensities (filter out e.g. bottom half by median?)
// fyi intensity is just r + g + b
// number of set pixels = number of chars, scale up/down to the code's actual length
// send to reshaper, except don't join with newlines instead line up each
// segment with what's in the original

// https://coderwall.com/p/jzdmdq/loading-image-from-local-file-into-javascript-and-getting-pixel-data

// site design example? https://ascii-generator.site/
