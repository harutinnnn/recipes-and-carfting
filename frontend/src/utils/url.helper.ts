export const getUrlPart = (url: string, index: number): string => {
    const result = url.replace(/^[\s/]+|[\s/]+$/g, '').split('/');
    return result[index];

}