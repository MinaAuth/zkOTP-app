// const shortenedText = longText.length > maxLength
//     ? longText.slice(0, maxLength) + "..." // Add ellipsis if the text is longer
//     : longText;

export const shortThisText = (longText) => {
    console.log("shortThisText called", longText);
    const maxLength = 10;
    return longText.length > maxLength
        ? longText.slice(0, maxLength) + "..." // Add ellipsis if the text is longer
        : longText;
}
