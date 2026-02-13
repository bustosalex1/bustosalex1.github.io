/* just some miscellaneous types **/

/**
 * A tuple containing an Image's ImageMetadata (it's src), it's alt string, and
 * a caption string to be displayed below it in Markdown posts.
 */
export type ImageTuple = [ImageMetadata, string, string?];
