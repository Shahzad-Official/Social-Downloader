class PinterestUtils {
  static findMp4 = (jsonObject: Record<string, any>): string => {
    let stringObjectsEndingWithMp4: Record<string, string>[] = [];
    var finalUrl: string = "";

    const recursiveSearch = (currentObj: Record<string, any>) => {
      if (currentObj && typeof currentObj === "object") {
        for (const key in currentObj) {
          if (key === "url") {
            stringObjectsEndingWithMp4.push({ [key]: currentObj[key] });
            finalUrl =
              stringObjectsEndingWithMp4
                .filter((obj) => obj.url.endsWith(".mp4"))
                .at(0)
                ?.url.toString() ?? "";
          }
          if (typeof currentObj[key] === "object") {
            recursiveSearch(currentObj[key]);
          }
        }
      }
    };

    recursiveSearch(jsonObject);

    return finalUrl;
  };
  static findTitle = (jsonObject: Record<string, any>): string => {
    var finalUrl: string = "";
    let title: Record<string, string>[] = [];

    const recursiveSearch = (currentObj: Record<string, any>) => {
      if (currentObj && typeof currentObj === "object") {
        for (const key in currentObj) {
          if (key === "title") {
            title.push({ [key]: currentObj[key] });
            finalUrl =
              title
                .filter((obj) => obj.title !== null && obj.title !== "")
                .at(0)
                ?.title.toString() ?? "";
          }
          if (typeof currentObj[key] === "object") {
            recursiveSearch(currentObj[key]);
          }
        }
      }
    };

    recursiveSearch(jsonObject);

    return finalUrl;
  };
  static findThumbnail = (jsonObject: Record<string, any>): any => {
    var finalUrl: any ;
    let thumbnail: Record<string, string>[] = [];

    const recursiveSearch = (currentObj: Record<string, any>) => {
      if (currentObj && typeof currentObj === "object") {
        for (const key in currentObj) {
          if (key === "imageSpec_orig") {
            thumbnail.push({ [key]: currentObj[key] });
            finalUrl = thumbnail.at(0)?.imageSpec_orig ;
          }
          if (typeof currentObj[key] === "object") {
            recursiveSearch(currentObj[key]);
          }
        }
      }
    };

    recursiveSearch(jsonObject);

    return finalUrl;
  };
}
export default PinterestUtils;
