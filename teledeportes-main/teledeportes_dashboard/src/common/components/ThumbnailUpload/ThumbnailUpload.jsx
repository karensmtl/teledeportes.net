import { useRef } from 'react';

// A button that opens a file dialog and hands the chosen image back via onSelect.
// Reused by the video and channel admin lists for custom thumbnails.
export default function ThumbnailUpload({ onSelect, disabled, className = 'btn btn--ghost btn--sm', children }) {
    const inputRef = useRef(null);

    const pick = (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';   // allow re-selecting the same file
        if (file) onSelect(file);
    };

    return (
        <>
            <button type="button" className={className} disabled={disabled} onClick={() => inputRef.current?.click()}>
                {children}
            </button>
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={pick} />
        </>
    );
}
