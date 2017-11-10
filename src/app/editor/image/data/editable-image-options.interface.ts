export interface EditableImageOptions
{
    backgroundColor?: string;
    controlColor?: string;
    spacing?: number | [number, number];
}

export function mergeDefaults( options?: EditableImageOptions ): EditableImageOptions
{
    options = options || {};

    return {
        backgroundColor: options.backgroundColor || "#F3F3F3",
        controlColor: options.controlColor || "#24B3E0",
        spacing: options.spacing || 50
    }
}