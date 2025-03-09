/**
 * Returns a sanitized folder path by removing a trailing slash unless the path is the root ("/").
 *
 * The function trims whitespace from the input folder string. If the trimmed string equals "/", it is returned unchanged. Otherwise, any trailing slash is removed.
 *
 * @param folder - The folder path to sanitize.
 * @returns The folder path without a trailing slash, except for the root path.
 */
export function stripTrailingSlash(folder: string): string {
    folder = folder.trim();
    return folder === "/" ? folder : folder.replace(/\/$/, "");
}
