/** Plays the film over one image. Returns a function that stops it and restores the image. */
export function smoke(img: HTMLImageElement): () => void;
/** Starts every film under `root`. Returns a function that stops them all. */
export function startSmoke(root?: ParentNode): () => void;
