// Figma-exported assets live in /public/figma so they can be refreshed
// from the library without touching component code.
export const asset = (name: string) => `${import.meta.env.BASE_URL}figma/${name}`
