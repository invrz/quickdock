import { useEffect, useState } from "react";

const Loading = () => {

    const [loadingText, setLoadingText] = useState("Loading...");
    const fontFamilies = ["Arial", "Courier New", "Times New Roman", "Georgia", "Verdana", "Consolas", "Wingddings"];
    const colors = ["blue", "green", "red", "purple", "orange", "pink", "brown"];

    useEffect(() => {
        let index = 0;
        const tipInterval = setInterval(() => {
            let text = "Loading" + ".".repeat(index % 3 + 1); // Mod by 3 for dots
            setLoadingText(text);
        }, 600);

        const progressInterval = setInterval(() => {
            const loadingTextElement = document.getElementById("loading-text");
            if (loadingTextElement) {
                loadingTextElement.style.fontFamily = fontFamilies[index % fontFamilies.length];
                loadingTextElement.style.color = colors[index % colors.length];
            }
            index = (index + 1) % (fontFamilies.length * colors.length);
        }, 200); // Update progress every 60ms (100 steps in 6 seconds)

        return () => {
            clearInterval(tipInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="page-view bg-body text-body">
            <div className="grid-row row-top row-center row-middle col-height-10">
                <h1 id="loading-text text-align--center">{loadingText}</h1>
            </div>
        </div>
    );
};

export default Loading;