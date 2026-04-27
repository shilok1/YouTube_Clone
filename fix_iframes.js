const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    // 1. replace src with data-src in iframes
    content = content.replace(/<iframe src=/g, '<iframe data-src=');

    // 2. update stopVideo function
    const oldStop = `        function stopVideo(modalToggle) {
            const videoItem = modalToggle.closest('.video-item');
            if (videoItem) {
                const iframe = videoItem.querySelector('.modal iframe');
                if (iframe) {
                    const currentSrc = iframe.src;
                    // Resetting src stops the video
                    iframe.src = '';
                    iframe.src = currentSrc;
                }
            }
        }`;
    const newStop = `        function stopVideo(modalToggle) {
            const videoItem = modalToggle.closest('.video-item');
            if (videoItem) {
                const iframe = videoItem.querySelector('.modal iframe');
                if (iframe) {
                    // Resetting src stops the video and unloads it to save memory
                    iframe.src = '';
                }
            }
        }`;
    content = content.replace(oldStop, newStop);

    // 3. update modal toggle
    const oldToggle = `                if (this.checked) {
                    // When opening one video, stop all others just in case`;
    const newToggle = `                if (this.checked) {
                    // Lazy load iframe src to save page load time
                    const videoItem = this.closest('.video-item');
                    if (videoItem) {
                        const iframe = videoItem.querySelector('.modal iframe');
                        if (iframe && iframe.dataset.src) {
                            iframe.src = iframe.dataset.src;
                        }
                    }

                    // When opening one video, stop all others just in case`;
    content = content.replace(oldToggle, newToggle);

    fs.writeFileSync('index.html', content);
    console.log("Success");
} catch (e) {
    console.error(e);
}
