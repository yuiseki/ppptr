export declare type ResolutionKey = "SD" | "HD" | "FHD" | "2K" | "4K";
export declare const ppptr: (url: string, { resolution, width, height, cookieFilePath, clickAllXPath, targetXPath, scrollY, }: {
    resolution: ResolutionKey;
    width: number | undefined;
    height: number | undefined;
    cookieFilePath: string | undefined;
    clickAllXPath: string | undefined;
    targetXPath: string | undefined;
    scrollY: number | undefined;
}) => Promise<string[] | undefined>;
