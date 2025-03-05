/**
 * @param folder - the folder to sanitize.
 * @returns sanitized value with trailing slashes removed, if applicable.
 */
export function sanitizeFolder(folder: string): string {
    folder = folder.trim();
    return folder === "/" ? folder : folder.replace(/\/$/, "");
}
