(function customCoverWithMenu() {
    const imageKey = "customCoverImageURL";
    const defaultImage = "https://i.imgur.com/5aKbkZe.png";
    let customImageURL = localStorage.getItem(imageKey) || defaultImage;
    let styleTag = null;
    let button = null;

    function applyCustomCover() {
        if (styleTag) styleTag.remove();

        const css = `
            img[src*="i.scdn.co"],
            .cover-art-image,
            .main-nowPlayingWidget-coverArt,
            .main-trackList-rowImage img,
            .main-coverSlot-image,
            .main-entityHeader-image,
            .main-nowPlayingBar-coverArt-image,
            .main-cardImage-image {
                content: url(${customImageURL}) !important;
                object-fit: cover !important;
            }

            [style*="i.scdn.co"] {
                background-image: url(${customImageURL}) !important;
            }
        `;

        styleTag = document.createElement("style");
        styleTag.id = "custom-cover-style";
        styleTag.innerText = css;
        document.head.appendChild(styleTag);
    }

    function observeChanges() {
        const observer = new MutationObserver(() => {
            applyCustomCover();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function createDraggableButton() {
        button = document.createElement("button");
        button.innerText = "Set Cover";
        Object.assign(button.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "9999",
            padding: "10px 15px",
            backgroundColor: "#1db954",
            color: "white",
            border: "none",
            borderRadius: "25px",
            cursor: "grab",
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        });

        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;

        button.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            button.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            button.style.left = `${e.clientX - offsetX}px`;
            button.style.top = `${e.clientY - offsetY}px`;
            button.style.right = "auto";
            button.style.bottom = "auto";
            button.style.position = "fixed";
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            button.style.cursor = "grab";
        });

        button.onclick = () => {
            if (isDragging) return; // Prevent accidental click when dragging
            const url = prompt("Enter new cover image URL:", customImageURL);
            if (url) {
                customImageURL = url;
                localStorage.setItem(imageKey, url);
                applyCustomCover();
                alert("Custom cover image updated!");
            }
        };

        document.body.appendChild(button);
    }

    function init() {
        if (!Spicetify?.Platform) {
            setTimeout(init, 300);
            return;
        }
        applyCustomCover();
        observeChanges();
        createDraggableButton();
    }

    init();
})();
